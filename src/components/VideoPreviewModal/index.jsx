import { Modal } from "antd";

function VideoPreviewModal({ open, videoUrl, onCancel }) {
    const fullVideoUrl = videoUrl;

    return (
        <Modal
            title="Xem video"
            open={open}
            onCancel={onCancel}
            width={800}
            footer={null}
            centered
            destroyOnClose
        >
            {fullVideoUrl && (
                <div style={{ width: "100%", aspectRatio: "16/9" }}>
                    <video
                        src={fullVideoUrl}
                        controls
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                        }}
                        autoPlay
                    />
                </div>
            )}
        </Modal>
    );
}

export default VideoPreviewModal;
