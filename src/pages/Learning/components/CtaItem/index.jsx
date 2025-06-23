import styles from "./CtaItem.module.scss";
import Button from "@/components/Button";

function CtaItem({ to, src }) {
    return (
        <div
            className={`${styles.wrapper} ${styles.progress} ${styles.progressChild}`}
        >
            <div className={styles.pie}>
                <div
                    className={`${styles.leftSide} ${styles.halfCircle}`}
                ></div>
            </div>

            <div className={styles.shadow}></div>
            <div className={styles.body}>
                <Button to={to} className={styles.wrapperChild}>
                    <img src={src} alt="" />
                </Button>
            </div>
        </div>
    );
}

export default CtaItem;
