import { useEffect, useRef, useState } from "react";
import { useUpdateUserCourseProgressMutation } from "@/services/coursesService";

const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;
const YOUTUBE_API_SRC = "https://www.youtube.com/iframe_api";
const YOUTUBE_PLAYING_STATE = 1;
const YOUTUBE_PAUSED_STATE = 2;
const YOUTUBE_ENDED_STATE = 0;

let youtubeApiPromise;

const loadYouTubeApi = () => {
    if (window.YT?.Player) return Promise.resolve(window.YT);

    if (!youtubeApiPromise) {
        youtubeApiPromise = new Promise((resolve) => {
            const previousReady = window.onYouTubeIframeAPIReady;

            window.onYouTubeIframeAPIReady = () => {
                if (typeof previousReady === "function") {
                    previousReady();
                }
                resolve(window.YT);
            };

            if (!document.querySelector(`script[src="${YOUTUBE_API_SRC}"]`)) {
                const script = document.createElement("script");
                script.src = YOUTUBE_API_SRC;
                script.async = true;
                document.body.appendChild(script);
            }
        });
    }

    return youtubeApiPromise;
};

const getYouTubeVideoId = (url) => {
    if (!url) return "";

    const value = String(url).trim();
    if (YOUTUBE_ID_PATTERN.test(value)) return value;

    try {
        const parsedUrl = new URL(value);
        const host = parsedUrl.hostname.replace(/^www\./, "");

        if (host === "youtu.be") {
            return parsedUrl.pathname.split("/").filter(Boolean)[0] || "";
        }

        if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
            if (parsedUrl.searchParams.get("v")) {
                return parsedUrl.searchParams.get("v");
            }

            const pathParts = parsedUrl.pathname.split("/").filter(Boolean);
            if (["embed", "shorts", "live"].includes(pathParts[0])) {
                return pathParts[1] || "";
            }
        }
    } catch (error) {
        const match = value.match(
            /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
        );
        return match?.[1] || "";
    }

    return "";
};

const getEmbedUrl = (url, autoPlay = false) => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return "";

    const params = new URLSearchParams({
        rel: "0",
        modestbranding: "1",
        playsinline: "1",
    });

    if (autoPlay) params.set("autoplay", "1");

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
};

const YoutubePlayer = ({
    videoId,
    videoUrl,
    autoPlay = false,
    onTimeUpdate = () => {},
    onPlay = () => {},
    onPause = () => {},
}) => {
    const containerRef = useRef(null);
    const playerRef = useRef(null);
    const [updateUserCourseProgress] = useUpdateUserCourseProgressMutation();
    const youtubeVideoId = getYouTubeVideoId(videoUrl);
    const playableVideoUrl = getEmbedUrl(videoUrl, autoPlay);
    const [isPlaying, setIsPlaying] = useState(Boolean(autoPlay));

    // Ref to hold current state for cleanup function (avoid stale closure)
    const stateRef = useRef({ currentTime: 0, duration: 0 });
    const callbacksRef = useRef({ onTimeUpdate, onPlay, onPause });

    useEffect(() => {
        callbacksRef.current = { onTimeUpdate, onPlay, onPause };
    }, [onTimeUpdate, onPlay, onPause]);

    useEffect(() => {
        if (!youtubeVideoId || !containerRef.current) return undefined;

        let isMounted = true;

        loadYouTubeApi().then((YT) => {
            if (!isMounted || !containerRef.current) return;

            playerRef.current = new YT.Player(containerRef.current, {
                videoId: youtubeVideoId,
                width: "100%",
                height: "100%",
                playerVars: {
                    autoplay: autoPlay ? 1 : 0,
                    controls: 1,
                    rel: 0,
                    modestbranding: 1,
                    playsinline: 1,
                    origin: window.location.origin,
                },
                events: {
                    onReady: (event) => {
                        const savedTime = localStorage.getItem(
                            `video_progress_${videoId}`
                        );

                        if (savedTime) {
                            event.target.seekTo(parseFloat(savedTime), true);
                        }

                        stateRef.current.duration =
                            event.target.getDuration?.() || 0;

                        if (autoPlay) {
                            event.target.playVideo();
                        }
                    },
                    onStateChange: (event) => {
                        if (event.data === YOUTUBE_PLAYING_STATE) {
                            setIsPlaying(true);
                            callbacksRef.current.onPlay();
                            return;
                        }

                        if (
                            event.data === YOUTUBE_PAUSED_STATE ||
                            event.data === YOUTUBE_ENDED_STATE
                        ) {
                            setIsPlaying(false);
                            callbacksRef.current.onPause();
                        }
                    },
                },
            });
        });

        return () => {
            isMounted = false;
            if (playerRef.current?.destroy) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [autoPlay, videoId, youtubeVideoId]);

    useEffect(() => {
        if (!isPlaying) return undefined;

        const intervalId = window.setInterval(() => {
            const player = playerRef.current;
            if (!player?.getCurrentTime) return;

            const currentTime = player.getCurrentTime() || 0;
            const duration = player.getDuration?.() || 0;
            stateRef.current.currentTime = currentTime;
            stateRef.current.duration = duration;

            callbacksRef.current.onTimeUpdate(currentTime);
            localStorage.setItem(`video_progress_${videoId}`, currentTime);
        }, 1000);

        return () => window.clearInterval(intervalId);
    }, [isPlaying, videoId]);

    // Cleanup and send final progress to backend on unmount
    useEffect(() => {
        return () => {
            try {
                const lastPosition = stateRef.current.currentTime;
                const duration = stateRef.current.duration;
                const watchDuration = lastPosition;
                let completed = false;

                if (duration > 0) {
                    const percent = (lastPosition / duration) * 100;
                    completed = percent >= 95 || duration - lastPosition <= 5;
                }

                // Send progress update to server (fire-and-forget)
                updateUserCourseProgress({
                    lessonId: videoId,
                    watchDuration,
                    lastPosition,
                    completed,
                }).catch((e) => {
                    console.debug("updateUserCourseProgress failed for YouTube:", e);
                });
            } catch (err) {
                console.debug("Error sending progress on YouTube unmount", err);
            }

            callbacksRef.current.onPause();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoId, updateUserCourseProgress]);

    if (!playableVideoUrl) {
        return (
            <div style={{ background: "#000", color: "#fff", padding: 24, textAlign: "center" }}>
                Không tìm thấy video YouTube hợp lệ.
            </div>
        );
    }

    return (
        <div style={{ position: "relative", paddingTop: "56.25%", width: "100%", height: 0, background: "#000" }}>
            <div
                ref={containerRef}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
            />
        </div>
    );
};

export default YoutubePlayer;
