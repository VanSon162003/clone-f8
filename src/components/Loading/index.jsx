import styles from "./Loading.module.scss";

function Loading() {
    return (
        <div className={styles.loadingOverlay}>
            <div className={styles.loadingSpinner}></div>
            <p className={styles.loadingText}>Đang tải...</p>
        </div>
    );
}

export default Loading;
