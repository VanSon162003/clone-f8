import React from "react";

import styles from "./Section.module.scss";
import CourseList from "../CourseList";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import formatNumberVN from "@/utils/formatNumberVN";

function Section({
    heading,
    courseType = "free",
    courseList = [],
    path = null,
    titleViewAll = "",
}) {
    let viewCountCoursesFree = null;

    if (courseType === "free") {
        viewCountCoursesFree = courseList.reduce((acc, course) => {
            return acc + +course.total_view;
        }, 0);
    }

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
                    <div className={styles.flexCenter}>
                        {viewCountCoursesFree && (
                            <p className={styles.subHeading}>
                                {formatNumberVN(viewCountCoursesFree)}+ người đã
                                học
                            </p>
                        )}
                        <h2 className={styles.heading}>
                            <Link to={path}>{heading}</Link>
                        </h2>
                    </div>
                )}

                {courseType !== "pro" && (
                    <Link to={path} className={styles.viewAll}>
                        {titleViewAll}

                        <FontAwesomeIcon icon={faChevronRight} />
                    </Link>
                )}
            </div>

            <div className={styles.body}>
                <CourseList courseType={courseType} courseList={courseList} />
            </div>
        </div>
    );
}

export default Section;
