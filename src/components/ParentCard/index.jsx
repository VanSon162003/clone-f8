import styles from "./ParentCard.module.scss";

function ParentCard({ children }) {
    return (
        <div className={styles.parent}>
            <div className="container-fluid">
                <div className={styles.container}>{children}</div>
            </div>
        </div>
    );
}

export default ParentCard;
