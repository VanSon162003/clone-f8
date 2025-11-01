import { useState } from "react";
import { Upload, Button, message, Progress } from "antd";
import { UploadOutlined, PlayCircleOutlined } from "@ant-design/icons";
import VideoPreviewModal from "@/components/VideoPreviewModal";
import isHttps from "@/utils/isHttps";
import PropTypes from "prop-types";

const VideoUploader = ({ defaultValue, onChange }) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [uploadedVideo, setUploadedVideo] = useState(defaultValue);
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);

    const customRequest = async ({ file, onSuccess, onError }) => {
        setUploading(true);
        setProgress(0);

        try {
            const formData = new FormData();
            formData.append("video", file);

            const xhr = new XMLHttpRequest();
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percent = Math.round(
                        (event.loaded * 100) / event.total
                    );
                    setProgress(percent);
                }
            };

            const response = await new Promise((resolve, reject) => {
                xhr.open(
                    "POST",
                    `${import.meta.env.VITE_BASE_URL_ADMIN}lessons/upload-video`
                );
                xhr.setRequestHeader(
                    "Authorization",
                    `Bearer ${localStorage.getItem("accessToken")}`
                );

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(
                            new Response(xhr.response, {
                                status: xhr.status,
                                statusText: xhr.statusText,
                            })
                        );
                    } else {
                        reject(new Error("Upload failed"));
                    }
                };

                xhr.onerror = () => reject(new Error("Upload failed"));
                xhr.send(formData);
            });

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const data = await response.json();
            onSuccess(data);
            message.success("Upload video thành công");

            onChange(data.data.video_url);
            setUploadedVideo(data.data.video_url);
            setUploading(false);
        } catch (error) {
            console.error("Error uploading video:", error);
            onError(error);
            message.error("Error uploading video");
            setUploading(false);
        }
    };

    const fullVideoUrl =
        uploadedVideo && !isHttps(uploadedVideo)
            ? `${import.meta.env.VITE_BASE_URL}${uploadedVideo}`
            : uploadedVideo;

    return (
        <div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <Upload
                    customRequest={customRequest}
                    accept="video/*"
                    showUploadList={false}
                    disabled={uploading}
                >
                    <Button icon={<UploadOutlined />} loading={uploading}>
                        {uploading
                            ? "Uploading"
                            : uploadedVideo
                            ? "Change Video"
                            : "Upload Video"}
                    </Button>
                </Upload>
                {uploadedVideo && (
                    <Button
                        type="primary"
                        icon={<PlayCircleOutlined />}
                        onClick={() => setIsPreviewVisible(true)}
                    >
                        Xem video
                    </Button>
                )}
            </div>
            {uploading && <Progress percent={progress} />}
            {uploadedVideo && (
                <VideoPreviewModal
                    open={isPreviewVisible}
                    videoUrl={fullVideoUrl}
                    onCancel={() => setIsPreviewVisible(false)}
                />
            )}
        </div>
    );
};

VideoUploader.propTypes = {
    defaultValue: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};

export default VideoUploader;
