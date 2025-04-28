import React from "react";

import styles from "./LearningCourseItem.module.scss";

function LearningCourseItem() {
    return (
        <div className={styles.wrapper}>
            <h2 className={styles.titles}></h2>
            <p className={styles.desc}></p>

            <div className={styles.wrap}>
                <div className={styles.inner}>
                    <div className={styles.thumb}></div>
                </div>
            </div>
        </div>
    );
}

export default LearningCourseItem;
