import { useEffect, useRef } from "react";
import { useUpdateUserCourseProgressMutation } from "@/services/coursesService";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const VideoPlayer = ({ videoId, videoUrl }) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const [updateUserCourseProgress] = useUpdateUserCourseProgressMutation();

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

            try {
                // Try to send the last known position to server
                const lastPosition = player.currentTime
                    ? player.currentTime()
                    : 0;
                const duration = player.duration ? player.duration() : 0;
                const watchDuration = lastPosition; // For now use lastPosition as watchDuration

                // Determine if completed: either watched >= 95% or within 5 seconds of end
                let completed = false;
                if (duration > 0) {
                    const percent = (lastPosition / duration) * 100;
                    if (percent >= 95) completed = true;
                    if (duration - lastPosition <= 5) completed = true;
                }

                // Fire-and-forget; we don't await here because we're in cleanup
                updateUserCourseProgress({
                    lessonId: videoId,
                    watchDuration,
                    lastPosition,
                    completed,
                }).catch((e) => {
                    // swallow errors; progress is also stored in localStorage
                    console.debug("updateUserCourseProgress failed:", e);
                });
            } catch (err) {
                console.debug("Error sending progress on unmount", err);
            }

            if (playerRef.current) {
                playerRef.current.dispose();
            }
        };
    }, [videoId, videoUrl, updateUserCourseProgress]);

    return (
        <div data-vjs-player>
            <video ref={videoRef} className="video-js" />
        </div>
    );
};

export default VideoPlayer;
