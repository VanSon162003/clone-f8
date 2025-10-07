import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Header.module.scss";
import {
    faChevronLeft,
    faCircleQuestion,
    faFile,
} from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/Button";
import { useState, useMemo } from "react";

const mockData = {
    data: {
        completed: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
            18, 19, 20, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
            17, 18, 19, 20,
        ], // Thêm 10 bài đã hoàn thành
        remaining: [],
        has_paid: false,
        title: "lập trình js cơ bản",
        tracks: [
            {
                id: 117,
                course_id: 1,
                title: "Hoàn thành khóa học",
                is_free: false,
                position: 20,
                track_steps_count: 2,
                track_steps: [
                    {
                        id: 2827,
                        track_id: 117,
                        step_type: "App\\Common\\Models\\Lesson",
                        step_id: 687,
                        position: 205,
                        is_bookmarked: 0,
                        hash: "cMzcwOTY0ZWItMWM5My00MjQzLWI4NjUtNTBmYmI2MDc0NTU4I",
                        is_published: false,
                        step: {
                            id: 687,
                            title: "đói quá",
                            duration: 720,
                        },
                        resources: [],
                    },
                    {
                        id: 3147,
                        track_id: 117,
                        step_type: "App\\Common\\Models\\Lesson",
                        step_id: 698,
                        position: 206,
                        is_bookmarked: 0,
                        hash: "EY2E3ZTU5OTAtNWIxMy00ZGM2LWI2MzYtYjczMjhjZmVmNzAwA",
                        is_published: false,
                        step: {
                            id: 698,
                            title: "quá đói",
                            duration: 60,
                        },
                        resources: [],
                    },
                ],
                duration: 780,
            },
            {
                id: 117,
                course_id: 1,
                title: "học cái gì",
                is_free: false,
                position: 20,
                track_steps_count: 2,
                track_steps: [
                    {
                        id: 2827,
                        track_id: 117,
                        step_type: "App\\Common\\Models\\Lesson",
                        step_id: 687,
                        position: 205,
                        is_bookmarked: 0,
                        hash: "cMzcwOTY0ZWItMWM5My00MjQzLWI4NjUtNTBmYmI2MDc0NTU4I",
                        is_published: false,
                        step: {
                            id: 687,
                            title: "quá ok nha",
                            duration: 720,
                        },
                        resources: [],
                    },
                    {
                        id: 3147,
                        track_id: 117,
                        step_type: "App\\Common\\Models\\Lesson",
                        step_id: 698,
                        position: 206,
                        is_bookmarked: 0,
                        hash: "EY2E3ZTU5OTAtNWIxMy00ZGM2LWI2MzYtYjczMjhjZmVmNzAwA",
                        is_published: false,
                        step: {
                            id: 698,
                            title: "học đi",
                            duration: 60,
                        },
                        resources: [],
                    },
                ],
                duration: 780,
            },
        ],
        user_progress: [],
        is_registered: true,
        track_steps_count: 205,
    },
};

function Header() {
    const [course, setCourse] = useState(mockData.data);

    // Tính toán progress dựa trên completed và total lessons
    const progressData = useMemo(() => {
        const completed = course.completed?.length || 0;
        const total = course.track_steps_count || 0;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
            completed,
            total,
            percent,
        };
    }, [course.completed, course.track_steps_count]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.backBtn} title="rời khỏi dây">
                <FontAwesomeIcon icon={faChevronLeft} className={styles.icon} />
            </div>

            <Button to="/" className={styles.logo}>
                <img src="/src/assets/imgs/logo-f8.png" alt="f8" />
            </Button>

            <div className={styles.courseName}>{course.title}</div>
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
                                {progressData.completed}
                            </span>
                            /
                            <span className={styles.num}>
                                {progressData.total}
                            </span>
                        </strong>{" "}
                        bài học
                    </p>
                </div>

                <button className={styles.actionBtn} data-tour="">
                    <FontAwesomeIcon
                        icon={faFile}
                        className={`${styles.icon}`}
                    />
                    <span className={styles.label}>Ghi chú</span>
                </button>

                <button className={`${styles.actionBtn} ${styles.helpBtn}`}>
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
