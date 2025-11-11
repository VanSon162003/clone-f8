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
        if (course) {
            const userProgress = course?.userProgress?.[0];

            const totalCompleted =
                JSON.parse(userProgress?.learned_lessons || null)?.length || 0;

            const completed = userProgress?.is_completed;
            const total = course?.totalLessonByCourse || 0;
            const percent = userProgress?.progress
                ? Math.round(userProgress?.progress)
                : 0;
            return { completed, total, percent, totalCompleted };
        }
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
                        <div className={styles.shadow}></div>

                        <div className={styles.pie}>
                            <div
                                className={`${styles.leftSide} ${styles.halfCircle}`}
                            ></div>
                            {/* <div
                                className={`${styles.rightSide} ${styles.halfCircle}`}
                            ></div> */}
                        </div>

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
