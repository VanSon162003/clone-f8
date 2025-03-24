import React from "react";
import styles from "./AccessForm.module.scss";

function AccessForm({ setIsAccess }) {
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setIsAccess(false);
    });

    return (
        <div className={styles.wrapper}>
            <div
                className={styles.overlay}
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        setIsAccess(false);
                    }
                }}
            ></div>

            <div className={styles.content}>
                <button
                    className={styles.close}
                    onClick={() => setIsAccess(false)}
                >
                    <span>×</span>
                </button>

                <iframe
                    className={styles.iframe}
                    src="./AuthenticationApp"
                ></iframe>
            </div>
        </div>
    );
}

export default AccessForm;
