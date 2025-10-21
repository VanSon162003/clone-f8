import styles from "./LoadingCenter.module.scss";

function LoadingCenter() {
    return (
        <div className={styles.loadingCenter}>
            <div className={styles.loadingSpinner}></div>
        </div>
    );
}

export default LoadingCenter;
