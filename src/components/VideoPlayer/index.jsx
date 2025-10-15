import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const VideoPlayer = ({ videoId, videoUrl, lessonId }) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);

    useEffect(() => {
        const player = videojs(videoRef.current, {
            controls: true,
            fluid: true,
        });

        playerRef.current = player;

        player.src({ src: videoUrl, type: "video/mp4" });

        // Lấy tiến độ từ localStorage
        const savedTime = localStorage.getItem(`video_progress_${videoId}`);

        if (savedTime) {
            player.on("loadedmetadata", () => {
                player.currentTime(parseFloat(savedTime));
            });
        }

        // Lưu tiến độ mỗi 3 giây
        const interval = setInterval(() => {
            const currentTime = player.currentTime();
            localStorage.setItem(`video_progress_${videoId}`, currentTime);
        }, 3000);

        // Lưu khi pause
        player.on("pause", () => {
            localStorage.setItem(
                `video_progress_${videoId}`,
                player.currentTime()
            );
        });

        // Cleanup
        return () => {
            clearInterval(interval);
            if (playerRef.current) {
                playerRef.current.dispose();
            }
        };
    }, [videoId, videoUrl]);

    return (
        <div data-vjs-player>
            <video ref={videoRef} className="video-js" />
        </div>
    );
};

export default VideoPlayer;
