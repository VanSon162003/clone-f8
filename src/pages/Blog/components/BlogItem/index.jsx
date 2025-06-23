import Button from "@/components/Button";
import styles from "./BlogItem.module.scss";

function BlogItem() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div className={styles.author}>
                    <Button href="#"></Button>
                </div>
            </div>
        </div>
    );
}

export default BlogItem;
