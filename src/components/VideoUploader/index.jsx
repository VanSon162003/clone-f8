import { useState, useEffect } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import isHttps from "@/utils/isHttps";

function VideoUploader({ onChange, defaultValue }) {
    const [videoFile, setVideoFile] = useState(null);
    const [videoUrl, setVideoUrl] = useState(defaultValue || "");

    const handleBeforeUpload = (file) => {
        const isVideo = file.type.startsWith("video/");
        if (!isVideo) {
            message.error("Vui lòng chọn file video!");
            return false;
        }

        const isLt500M = file.size / 1024 / 1024 < 500;
        if (!isLt500M) {
            message.error("Video phải nhỏ hơn 500MB!");
            return false;
        }

        setVideoFile(file);
        if (onChange) {
            onChange(file);
        }
        return false; // Prevent auto upload
    };

    return (
        <div style={{ marginBottom: 16 }}>
            <Upload
                accept="video/*"
                showUploadList={false}
                beforeUpload={handleBeforeUpload}
                disabled={uploading}
            >
                <Button icon={<UploadOutlined />} loading={uploading}>
                    {uploading ? "Đang tải lên..." : "Chọn Video"}
                </Button>
            </Upload>

            {uploading && (
                <Progress
                    percent={progress}
                    status="active"
                    style={{ marginTop: 8 }}
                />
            )}

            {videoUrl && !uploading && (
                <div style={{ marginTop: 8 }}>
                    <video
                        src={videoUrl}
                        controls
                        style={{ maxWidth: "100%", maxHeight: 200 }}
                    />
                </div>
            )}
        </div>
    );
}

export default VideoUploader;
