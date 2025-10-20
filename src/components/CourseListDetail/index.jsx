import useApi from "@/hook/useApi";
import React from "react";
import styles from "./CourseListDetail.module.scss";
import isHttps from "@/utils/isHttps";
import Button from "../Button";

function CourseListDetail({ course = {} }) {
    const timeAgo = (dateString) => {
        if (!dateString) return "";

        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";

        const now = new Date();
        const diffMs = now - date;

        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (seconds < 60) return `${seconds} giây trước`;
        if (minutes < 60) return `${minutes} phút trước`;
        if (hours < 24) return `${hours} giờ trước`;
        if (days < 30) return `${days} ngày trước`;
        if (months < 12) return `${months} tháng trước`;
        return `${years} năm trước`;
    };

    return (
        <div className={styles.courseItem}>
            <Button to={`learning/${course.slug}`}>
                <img
                    src={
                        isHttps(course.thumbnail)
                            ? course.thumbnail
                            : `${import.meta.env.VITE_BASE_URL}${
                                  course.thumbnail
                              }`
                    }
                    alt=""
                    className={styles.courseThumb}
                />
            </Button>
            <div className={styles.courseInfo}>
                <h3 className={styles.contentTitle}>
                    <Button to={`learning/${course.slug}`}>
                        {course.title}
                    </Button>
                </h3>
                <p className={styles.lastCompeted}>
                    {course?.userProgress?.last_viewed_at
                        ? `học cách đây ${timeAgo(
                              course?.userProgress?.last_viewed_at
                          )} `
                        : "Học ngay thôi!"}
                </p>
                <div
                    className={styles.wrap}
                    style={{
                        "--random-with": `${
                            course?.userProgress?.progress || 0
                        }%`,
                    }}
                ></div>
            </div>
        </div>
    );
}

export default CourseListDetail;
