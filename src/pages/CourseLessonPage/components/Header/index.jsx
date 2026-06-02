import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Header.module.scss";
import {
    faChevronLeft,
    faCircleQuestion,
    faFile,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useMemo, useState } from "react";
import { useGetCourseProgressQuery } from "@/services/coursesService";
// no route params here; courseId will be passed via props

// const mockData = null;

function Header({ courseId, title, onOpenNotes, onOpenTutorial }) {
    const [course, setCourse] = useState({ title: title || "" });
    const { data: progressDataApi } = useGetCourseProgressQuery(
        { courseId },
        {
            skip: !courseId,
            refetchOnMountOrArgChange: true,
            refetchOnFocus: true,
        }
    );

    useEffect(() => {
        if (progressDataApi?.data) {
            setCourse(progressDataApi.data);
        }
    }, [progressDataApi]);

    // Tính toán progress dựa trên completed và total lessons
    const progressData = useMemo(() => {
        const userProgress = course?.userProgress?.[0];
        const rawLearnedLessons = userProgress?.learned_lessons;
        
        let learnedArr = [];
        if (Array.isArray(rawLearnedLessons)) {
            learnedArr = rawLearnedLessons;
        } else if (typeof rawLearnedLessons === "string") {
            try {
                learnedArr = JSON.parse(rawLearnedLessons) || [];
            } catch (e) {
                console.error("Error parsing learned_lessons:", e);
            }
        }

        const totalCompleted = learnedArr?.length || 0;
        const completed = userProgress?.is_completed || false;
        const total = course?.totalLessonByCourse || 0;
        const percent = userProgress?.progress ? Math.round(userProgress?.progress) : 0;
        
        return { completed, total, percent, totalCompleted };
    }, [course]);

    return (
        <div className={styles.wrapper}>
            <a href="/" className={styles.backBtn} title="rời khỏi dây">
                <FontAwesomeIcon icon={faChevronLeft} className={styles.icon} />
            </a>

            <a href="/" className={styles.logo}>
                <img
                    src={`${import.meta.env.VITE_BASE_URL}uploads/imgs/logo`}
                    alt="f8"
                />
            </a>

            <div className={styles.courseName}>
                {title || course.title || ""}
            </div>
            <div className={styles.actions}>
                <div className={styles.progressBar}>
                    <div
                        className={styles.pieWrapper}
                        style={{
                            "--size": "34px",
                            "--progress": progressData.percent,
                            "--bar-width": "2px",
                            "--shadow-border-color": "#4d4f50",
                        }}
                    >
                        <svg
                            width="34"
                            height="34"
                            viewBox="0 0 34 34"
                            style={{
                                transform: "rotate(-90deg)",
                                width: "100%",
                                height: "100%",
                                display: "block"
                            }}
                        >
                            {/* Base grey track circle */}
                            <circle
                                cx="17"
                                cy="17"
                                r="15"
                                fill="transparent"
                                stroke="#4d4f50"
                                strokeWidth="2"
                            />
                            {/* Orange progress circle */}
                            <circle
                                cx="17"
                                cy="17"
                                r="15"
                                fill="transparent"
                                stroke="#f05123"
                                strokeWidth="2"
                                strokeDasharray={2 * Math.PI * 15}
                                strokeDashoffset={2 * Math.PI * 15 * (1 - progressData.percent / 100)}
                                strokeLinecap="round"
                                style={{
                                    transition: "stroke-dashoffset 0.3s ease-in-out",
                                }}
                            />
                        </svg>

                        <div className={styles.body}>
                            <div className={styles.percent}>
                                <span className={styles.num}>
                                    {progressData.percent}
                                </span>
                                %
                            </div>
                        </div>
                    </div>

                    <p className={styles.completedMsg}>
                        <strong>
                            <span className={styles.num}>
                                {progressData.totalCompleted}
                            </span>
                            /
                            <span className={styles.num}>
                                {progressData.total}
                            </span>
                        </strong>{" "}
                        bài học
                    </p>
                </div>

                <button
                    className={styles.actionBtn}
                    data-tour=""
                    onClick={() => onOpenNotes && onOpenNotes()}
                >
                    <FontAwesomeIcon
                        icon={faFile}
                        className={`${styles.icon}`}
                    />
                    <span className={styles.label}>Ghi chú</span>
                </button>

                <button
                    className={`${styles.actionBtn} ${styles.helpBtn}`}
                    onClick={() => onOpenTutorial && onOpenTutorial()}
                >
                    <FontAwesomeIcon
                        icon={faCircleQuestion}
                        className={`${styles.icon}`}
                    />

                    <span className={styles.label}>Hướng dẫn</span>
                </button>
            </div>
        </div>
    );
}

export default Header;
