import React from "react";
import styles from "./LearningCourseSection.module.scss";
import Button from "@/components/Button";

function LearningCourseSection({ children, header, desc }) {
    const courses = React.Children.toArray(children);

    console.log(courses);

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>{header}</h2>
            <p className={styles.desc}>{desc}</p>

            {children}

        </div>
    );
}

export default LearningCourseSection;
