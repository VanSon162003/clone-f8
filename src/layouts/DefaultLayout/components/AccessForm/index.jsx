import React, { useState } from "react";
import styles from "./AccessForm.module.scss";

function AccessForm({ setIsAccess, isAccess = false }) {
    const [isClosing, setIsClosing] = useState(false);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") handleClose();
    });

    const handleClose = () => {
        setIsClosing(true);

        setTimeout(() => {
            setIsAccess(false);
            setIsClosing(false);
        }, 200);
    };

    return (
        <div className={styles.wrapper}>
            <div
                className={`${styles.overlay} ${
                    isClosing && styles.turnOffOverlay
                }`}
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        handleClose();
                    }
                }}
            ></div>

            <div
                className={`${styles.content} ${
                    isClosing && styles.turnOffContent
                }`}
            >
                <button className={styles.close} onClick={() => handleClose()}>
                    <span>×</span>
                </button>

                <iframe
                    className={styles.iframe}
                    src="/AuthenticationApp"
                ></iframe>
            </div>
        </div>
    );
}

export default AccessForm;
