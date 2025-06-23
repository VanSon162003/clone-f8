import useApi from "@/hook/useApi";
import React from "react";
import styles from "./CourseListDetail.module.scss";

function CourseListDetail({ course }) {
    return (
        <div className={styles.courseItem}>
            <a href="#">
                <img src={course.img} alt="" className={styles.courseThumb} />
            </a>
            <div className={styles.courseInfo}>
                <h3 className={styles.contentTitle}>
                    <a href="#">{course.title}</a>
                </h3>
                <p className={styles.lastCompeted}>
                    {`học cách đây ${Math.floor(Math.random() * 12)} tháng`}
                </p>
                <div
                    className={styles.wrap}
                    style={{
                        "--random-with": `${Math.floor(Math.random() * 100)}%`,
                    }}
                ></div>
            </div>
        </div>
    );
}

export default CourseListDetail;
