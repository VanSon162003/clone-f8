import { useState, useRef } from "react";
import PropTypes from "prop-types";
import styles from "./UploadImg.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

function UploadImg({ onFileChange }) {
    const [preview, setPreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef(null);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file);
            setPreview(url);
            if (onFileChange) onFileChange(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file);
            setPreview(url);
            if (onFileChange) onFileChange(file);
        }
    };

    const handleRemove = (e) => {
        e.stopPropagation(); // không bị trigger click cha
        setPreview(null);
        if (inputRef.current) {
            inputRef.current.value = ""; // reset input
        }
        if (onFileChange) onFileChange(null);
    };

    return (
        <div
            className={`${styles.dropArea} ${
                isDragging ? styles.dragging : ""
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => inputRef.current.click()}
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
            />

            <div className={styles.formGroup}>
                {!preview && (
                    <>
                        <FontAwesomeIcon icon={faImage} />
                        <div className={styles.text}>
                            <div className={styles.primary}>
                                Chọn Ảnh đại diện
                            </div>
                            <div className={styles.secondary}>
                                Kéo thả hoặc nhấp vào đây để chọn
                            </div>
                            <div className={styles.hint}>Tôi đa 15mb</div>
                        </div>
                    </>
                )}
                <div className={styles.wrap}>
                    <div className={styles.uploadArena}>
                        {preview && (
                            <div className={styles.previewWrapper}>
                                <img
                                    src={preview}
                                    alt="preview"
                                    className={styles.preview}
                                />
                                <button
                                    type="button"
                                    className={styles.removeBtn}
                                    onClick={handleRemove}
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

UploadImg.propTypes = {
    onFileChange: PropTypes.func,
};

export default UploadImg;
