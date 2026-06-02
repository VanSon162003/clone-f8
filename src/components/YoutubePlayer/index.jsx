import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useUpdateUserCourseProgressMutation } from "@/services/coursesService";

const YoutubePlayer = ({
    videoId,
    videoUrl,
    autoPlay = false,
    onTimeUpdate = () => {},
    onPlay = () => {},
    onPause = () => {},
}) => {
    const playerRef = useRef(null);
    const [updateUserCourseProgress] = useUpdateUserCourseProgressMutation();
    const [duration, setDuration] = useState(0);
    const [hasSeeked, setHasSeeked] = useState(false);

    // Ref to hold current state for cleanup function (avoid stale closure)
    const stateRef = useRef({ currentTime: 0, duration: 0 });

    useEffect(() => {
        stateRef.current.duration = duration;
    }, [duration]);

    // Check and seek to saved progress when ready
    const handleReady = () => {
        if (!hasSeeked && playerRef.current) {
            const savedTime = localStorage.getItem(`video_progress_${videoId}`);
            if (savedTime) {
                playerRef.current.seekTo(parseFloat(savedTime), "seconds");
            }
            setHasSeeked(true);
        }
    };

    const handleProgress = (progress) => {
        const currentTime = progress.playedSeconds;
        stateRef.current.currentTime = currentTime;
        onTimeUpdate(currentTime);

        // Save progress to localStorage periodically
        localStorage.setItem(`video_progress_${videoId}`, currentTime);
    };

    const handlePlay = () => {
        onPlay();
    };

    const handlePause = () => {
        onPause();
        const currentTime = stateRef.current.currentTime;
        localStorage.setItem(`video_progress_${videoId}`, currentTime);
    };

    const handleDuration = (dur) => {
        setDuration(dur);
    };

    // Cleanup and send final progress to backend on unmount
    useEffect(() => {
        return () => {
            try {
                const lastPosition = stateRef.current.currentTime;
                const dur = stateRef.current.duration;
                const watchDuration = lastPosition;

                let completed = false;
                if (dur > 0) {
                    const percent = (lastPosition / dur) * 100;
                    if (percent >= 95) completed = true;
                    if (dur - lastPosition <= 5) completed = true;
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
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoId, updateUserCourseProgress]);

    return (
        <div style={{ position: "relative", paddingTop: "56.25%", width: "100%", height: "0" }}>
            <ReactPlayer
                ref={playerRef}
                url={videoUrl}
                playing={autoPlay}
                controls={true}
                width="100%"
                height="100%"
                style={{ position: "absolute", top: 0, left: 0 }}
                onReady={handleReady}
                onProgress={handleProgress}
                onDuration={handleDuration}
                onPlay={handlePlay}
                onPause={handlePause}
                progressInterval={1000} // Trigger onProgress every second
            />
        </div>
    );
};

export default YoutubePlayer;
