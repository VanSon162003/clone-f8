import React from "react";

import styles from "./Course.module.scss";
import CourseItem from "../CourseItem";
import { Link } from "react-router-dom";

function Course({
    heading,
    courseType = "free",
    courseList,
    path = null,
    titleViewAll = "",
}) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.headingWrap}>
                {courseType === "pro" ? (
                    <h2 className={styles.heading}>
                        <span>
                            {heading}
                            <span className={styles.label}>Mới</span>
                        </span>
                    </h2>
                ) : courseType === "video" ? (
                    <h2 className={styles.heading}>
                        <a href={path} target="_blank">
                            {heading}
                        </a>
                    </h2>
                ) : (
                    <h2 className={styles.heading}>
                        <Link to={path}>{heading}</Link>
                    </h2>
                )}

                {courseType !== "pro" && (
                    <Link to={path} className={styles.viewAll}>
                        {titleViewAll}
                        <svg
                            aria-hidden="true"
                            focusable="false"
                            data-prefix="fas"
                            data-icon="chevron-right"
                            className="svg-inline--fa fa-chevron-right "
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 320 512"
                        >
                            <path
                                fill="currentColor"
                                d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
                            ></path>
                        </svg>
                    </Link>
                )}
            </div>

            <div className={styles.body}>
                <CourseItem courseType={courseType} courseList={courseList} />
            </div>
        </div>
    );
}

export default Course;
