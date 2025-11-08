import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LearningCourseItem.module.scss";
import Button from "@/components/Button";

function LearningCourseItem({ courseItem = {} }) {
    const navigate = useNavigate();

    const goToCourse = () => {
        if (courseItem?.enrolled) {
            navigate(`/learning/${courseItem.slug}`);
        } else {
            navigate(`/courses/${courseItem.slug}`);
        }
    };

    const formatCurrencyVND = (value) => {
        const number = Math.round(parseFloat(value) / 1000) * 1000;
        return new Intl.NumberFormat("vi-VN").format(number) + "đ";
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.inner}>
                <div className={styles.thumb}>
                    <img
                        src={`${import.meta.env.VITE_BASE_URL}${
                            courseItem?.thumbnail
                        }`}
                        alt={courseItem?.title}
                    />
                </div>

                <div className={styles.info}>
                    <h2 className={styles.subTitle}>{courseItem?.title}</h2>

                    <div className={styles.price}>
                        {courseItem?.is_pro ? (
                            <>
                                <span className={styles.oldPrice}>
                                    {formatCurrencyVND(courseItem?.old_price) ||
                                        "1,200,000đ"}
                                </span>
                                <span className={styles.mainPrice}>
                                    {formatCurrencyVND(courseItem?.price) ||
                                        "599,000đ"}
                                </span>
                            </>
                        ) : (
                            <span className={styles.freeTitle}>
                                {courseItem?.price || "Miễn phí"}
                            </span>
                        )}
                    </div>

                    <p className={styles.subDesc}>
                        {courseItem?.description || courseItem?.desc}
                    </p>

                    {/* Course stats */}
                    <div className={styles.stats}>
                        {courseItem?.total_lesson && (
                            <span className={styles.statItem}>
                                📚 {courseItem.total_lesson} bài học
                            </span>
                        )}
                        {courseItem?.total_duration && (
                            <span className={styles.statItem}>
                                ⏱️ {courseItem.total_duration} phút
                            </span>
                        )}
                        {courseItem?.level && (
                            <span className={styles.statItem}>
                                🎯 {courseItem.level}
                            </span>
                        )}
                    </div>

                    {/* Hiển thị progress nếu đã đăng ký */}
                    {courseItem?.enrolled && (
                        <div className={styles.progress}>
                            <div className={styles.progressBar}>
                                <div
                                    className={styles.progressFill}
                                    style={{
                                        width: `${
                                            courseItem?.progressPercent || 0
                                        }%`,
                                    }}
                                ></div>
                            </div>
                            <span className={styles.progressText}>
                                {courseItem?.progressPercent || 0}% hoàn thành
                            </span>
                        </div>
                    )}

                    <Button
                        onClick={goToCourse}
                        rounded
                        primary
                        size="medium"
                        className={styles.wrapBtn}
                    >
                        <span className={styles.btnInner}>
                            {courseItem?.enrolled
                                ? "TIẾP TỤC HỌC"
                                : "XEM KHOÁ HỌC"}
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default LearningCourseItem;
