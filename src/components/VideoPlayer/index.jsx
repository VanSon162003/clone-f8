import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const VideoPlayer = ({ videoId, videoUrl, lessonId, onProgressUpdate }) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const progressIntervalRef = useRef(null);

    useEffect(() => {
        const player = videojs(videoRef.current, {
            controls: true,
            fluid: true,
        });

        playerRef.current = player;

        player.src({ src: videoUrl, type: "video/mp4" });

        // Lấy tiến độ từ localStorage
        const savedTime = localStorage.getItem(`video_progress_${lessonId}`);

        if (savedTime) {
            player.on("loadedmetadata", () => {
                player.currentTime(parseFloat(savedTime));
            });
        }

        // Lưu tiến độ mỗi 3 giây
        progressIntervalRef.current = setInterval(() => {
            const currentTime = player.currentTime();
            const duration = player.duration();
            
            localStorage.setItem(`video_progress_${lessonId}`, currentTime);
            
            // Kiểm tra nếu đã xem được 50% thì đánh dấu completed
            if (duration > 0 && currentTime / duration >= 0.5) {
                if (onProgressUpdate && lessonId) {
                    onProgressUpdate({
                        lessonId,
                        watchDuration: Math.floor(currentTime),
                        lastPosition: Math.floor(currentTime),
                        completed: true
                    });
                }
            }
        }, 3000);

        // Lưu khi pause
        player.on("pause", () => {
            const currentTime = player.currentTime();
            localStorage.setItem(`video_progress_${lessonId}`, currentTime);
            
            if (onProgressUpdate && lessonId) {
                onProgressUpdate({
                    lessonId,
                    watchDuration: Math.floor(currentTime),
                    lastPosition: Math.floor(currentTime),
                    completed: false
                });
            }
        });

        // Cleanup function để lưu progress khi unmount
        const cleanup = () => {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
            
            if (playerRef.current) {
                const currentTime = playerRef.current.currentTime();
                localStorage.setItem(`video_progress_${lessonId}`, currentTime);
                
                // Lưu progress cuối cùng khi unmount
                if (onProgressUpdate && lessonId) {
                    onProgressUpdate({
                        lessonId,
                        watchDuration: Math.floor(currentTime),
                        lastPosition: Math.floor(currentTime),
                        completed: false
                    });
                }
                
                playerRef.current.dispose();
            }
        };

        return cleanup;
    }, [videoId, videoUrl, lessonId, onProgressUpdate]);

    return (
        <div data-vjs-player>
            <video ref={videoRef} className="video-js" />
        </div>
    );
};

export default VideoPlayer;
