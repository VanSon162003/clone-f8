import { useState } from "react";
import styles from "./CourseDetail.module.scss";
import ParentCard from "@/components/ParentCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBatteryFull,
    faCheck,
    faCirclePlay,
    faClock,
    faFilm,
    faGaugeHigh,
} from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/Button";
import Model from "@/components/Model";
import ScrollLock from "@/components/ScrollLock";
import { useNavigate, useParams } from "react-router-dom";

const mockData = {
    data: {
        course: {
            id: 12,
            title: "Lập Trình JavaScript Nâng Cao",
            certificate_name: "JavaScript Advanced",
            slug: "javascript-nang-cao",
            description:
                "Hiểu sâu hơn về cách Javascript hoạt động, tìm hiểu về IIFE, closure, reference types, this keyword, bind, call, apply, prototype, ...",
            image_url: "https://files.fullstack.edu.vn/f8-prod/courses/12.png",
            duration: 31276,
            is_pro: false,
            level: {
                id: 2,
                title: "Trình độ trung bình",
                level: 2,

                created_at: null,

                updated_at: null,
            },
            will_learns: [
                {
                    id: 68,
                    content:
                        "Được học kiến thức miễn phí với nội dung chất lượng hơn mất phí",
                },
                {
                    id: 69,
                    content:
                        "Các kiến thức nâng cao của Javascript giúp code trở nên tối ưu hơn",
                },
                {
                    id: 70,
                    content:
                        "Hiểu được cách tư duy nâng cao của các lập trình viên có kinh nghiệm",
                },
            ],
            requirements: [
                {
                    id: 62,
                    content:
                        "Hoàn thành khóa học Javascript cơ bản tại F8 hoặc đã nắm chắc Javascript cơ bản",
                },
                {
                    id: 63,
                    content: "Tư duy mở để dễ dàng tiếp nhận các tư tưởng mới",
                },
            ],
            tracks: [
                {
                    id: 74,
                    title: "IIFE, Scope, Closure",
                    position: 1,
                    track_steps: [
                        {
                            id: 1,
                            step: {
                                title: "Giới thiệu",
                                position: 1,
                                duration: 108,
                            },
                        },
                        {
                            id: 2,
                            step: {
                                title: "IIFE là gì?",
                                position: 2,
                                duration: 1437,
                            },
                        },
                    ],
                },
                {
                    id: 188,
                    title: "Hoisting, Strict Mode, Data Types",
                    position: 2,
                    track_steps: [
                        {
                            id: 3,
                            step: {
                                title: "Hoisting là gì?",
                                position: 3,
                                duration: 658,
                            },
                        },
                        {
                            id: 4,
                            step: {
                                title: "Strict mode?",
                                position: 4,
                                duration: 845,
                            },
                        },
                    ],
                },
            ],
        },
    },
};

function CourseDetail() {
    const [course, setCourse] = useState(mockData.data.course);
    const [openCollapse, setOpenCollapse] = useState([]);
    const [isCollapseAll, setIsCollapseAll] = useState(false);
    const [openIntroduce, setOpenIntroduce] = useState(false);

    const navigator = useNavigate();
    const { slug } = useParams();

    const totalTrack = course.tracks.length;
    const totalLesson = course.tracks.reduce((acc, track) => {
        return (acc += track.track_steps.length);
    }, 0);

    const totalSeconds = course.tracks.reduce((acc, track) => {
        return (
            acc +
            track.track_steps.reduce(
                (sum, step) => sum + (step.step.duration || 0),
                0
            )
        );
    }, 0);

    function formatDuration(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h} giờ ${m} phút`;
        if (m > 0) return `${m} phút ${s} giây`;
        return `${s} giây`;
    }

    function formatDurationBySeconds(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }

    const handleOpenCollapse = (id) => {
        setOpenCollapse((prev) => {
            return prev.includes(id)
                ? prev.filter((p) => p !== id)
                : [...prev, id];
        });
    };

    const toggleOpenCollapseAll = () => {
        setOpenCollapse(() => {
            return !isCollapseAll ? course.tracks.map((track) => track.id) : [];
        });

        setIsCollapseAll(!isCollapseAll);
    };

    const handleOpenIntroduce = () => {
        setOpenIntroduce(true);
    };

    const onCancel = () => {
        setOpenIntroduce(false);
    };

    const handleRegisterLesson = () => {
        // fetch dữ liệu cập nhật is_register với slug

        navigator(`/learning/${slug}`);
    };

    return (
        <>
            <ParentCard>
                <div className={styles.wrapper}>
                    <div className="row">
                        <div className="col col-8">
                            <article className={styles.content}>
                                <div className={styles.header}>
                                    <div>
                                        <h1 className={styles.title}>
                                            {course.title}
                                        </h1>
                                        <p className={styles.desc}>
                                            {course.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Will learn */}
                                <div className={styles.topicList}>
                                    <h2>Bạn sẽ học được gì?</h2>

                                    <section
                                        className={styles.index_module_row}
                                    >
                                        <section className={styles.col}>
                                            <ul className={styles.list}>
                                                {course.will_learns.map(
                                                    (item) => {
                                                        return (
                                                            <li key={item.id}>
                                                                <FontAwesomeIcon
                                                                    className={
                                                                        styles.icon
                                                                    }
                                                                    icon={
                                                                        faCheck
                                                                    }
                                                                />

                                                                <span>
                                                                    {
                                                                        item.content
                                                                    }
                                                                </span>
                                                            </li>
                                                        );
                                                    }
                                                )}
                                            </ul>
                                        </section>
                                    </section>
                                </div>

                                {/* Tracks */}
                                <div className={styles.curriculumOfCourse}>
                                    <div className={styles.headerSticky}>
                                        <div className={styles.headerBlock}>
                                            <h2>Nội dung khoá học</h2>
                                        </div>

                                        <div
                                            className={styles.subHeaderWrapper}
                                        >
                                            <ul>
                                                <li className="d-lg-none">
                                                    <strong>
                                                        {totalTrack}{" "}
                                                    </strong>{" "}
                                                    chương
                                                </li>
                                                <li
                                                    className={`${styles.dot} d-lg-none`}
                                                >
                                                    •
                                                </li>
                                                <li>
                                                    <strong>
                                                        {totalSeconds}
                                                    </strong>{" "}
                                                    bài học
                                                </li>
                                                <li
                                                    className={`${styles.dot} d-sm-none`}
                                                >
                                                    •
                                                </li>
                                                <li>
                                                    <span>
                                                        Thời lượng{" "}
                                                        <strong>
                                                            {formatDuration(
                                                                totalSeconds
                                                            )}
                                                        </strong>
                                                    </span>
                                                </li>
                                            </ul>

                                            <div
                                                onClick={toggleOpenCollapseAll}
                                                className={styles.toggleBtn}
                                            >
                                                {!isCollapseAll
                                                    ? "Mở rộng"
                                                    : "Thu nhỏ"}{" "}
                                                tất cả
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.curriculumPanner}>
                                        <div className={styles.pannerGroup}>
                                            {course.tracks.map((track) => {
                                                const isOpen =
                                                    openCollapse.includes(
                                                        track.id
                                                    );
                                                return (
                                                    <div
                                                        className={
                                                            styles.panner
                                                        }
                                                        key={track.id}
                                                        onClick={() =>
                                                            handleOpenCollapse(
                                                                track.id
                                                            )
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                styles.heading
                                                            }
                                                        >
                                                            <h5
                                                                className={
                                                                    styles.title
                                                                }
                                                            >
                                                                <div
                                                                    className={`${
                                                                        styles.headLine
                                                                    } ${
                                                                        isOpen &&
                                                                        styles.active
                                                                    }`}
                                                                >
                                                                    <strong>
                                                                        {
                                                                            track.position
                                                                        }
                                                                        {". "}
                                                                        {
                                                                            track.title
                                                                        }
                                                                    </strong>
                                                                    <div
                                                                        className={
                                                                            styles.timeOfSection
                                                                        }
                                                                    >
                                                                        {
                                                                            totalLesson
                                                                        }{" "}
                                                                        bài học
                                                                    </div>
                                                                </div>
                                                            </h5>
                                                        </div>

                                                        {isOpen && (
                                                            <div
                                                                onClick={(e) =>
                                                                    e.stopPropagation()
                                                                }
                                                                className={`${styles.collapse} ${styles.in}`}
                                                            >
                                                                <div
                                                                    className={
                                                                        styles.pannerBody
                                                                    }
                                                                >
                                                                    <div>
                                                                        {track.track_steps.map(
                                                                            (
                                                                                step
                                                                            ) => {
                                                                                return (
                                                                                    <div
                                                                                        className={
                                                                                            styles.lessonItem
                                                                                        }
                                                                                        key={
                                                                                            step.id
                                                                                        }
                                                                                    >
                                                                                        <span
                                                                                            className={
                                                                                                styles.iconLink
                                                                                            }
                                                                                        >
                                                                                            <FontAwesomeIcon
                                                                                                className={`${styles.icon} ${styles.video}`}
                                                                                                icon={
                                                                                                    faCirclePlay
                                                                                                }
                                                                                            />
                                                                                            <div
                                                                                                className={
                                                                                                    styles.lessonName
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    step
                                                                                                        .step
                                                                                                        .position
                                                                                                }
                                                                                                {
                                                                                                    ". "
                                                                                                }
                                                                                                {
                                                                                                    step
                                                                                                        .step
                                                                                                        .title
                                                                                                }
                                                                                            </div>
                                                                                        </span>

                                                                                        <span>
                                                                                            {formatDurationBySeconds(
                                                                                                step
                                                                                                    .step
                                                                                                    .duration
                                                                                            )}
                                                                                        </span>
                                                                                    </div>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Requirements */}
                                <div className={styles.topicList}>
                                    <h2>Bạn sẽ học được gì?</h2>

                                    <section
                                        className={styles.index_module_row}
                                    >
                                        <section className={styles.col}>
                                            <ul
                                                className={`${styles.list} ${styles.column}`}
                                            >
                                                {course.requirements.map(
                                                    (item) => {
                                                        return (
                                                            <li key={item.id}>
                                                                <FontAwesomeIcon
                                                                    className={
                                                                        styles.icon
                                                                    }
                                                                    icon={
                                                                        faCheck
                                                                    }
                                                                />

                                                                <span>
                                                                    {
                                                                        item.content
                                                                    }
                                                                </span>
                                                            </li>
                                                        );
                                                    }
                                                )}
                                            </ul>
                                        </section>
                                    </section>
                                </div>
                            </article>
                        </div>
                        <div className="col col-4">
                            <div className={styles.purchaseBadge}>
                                <div
                                    onClick={handleOpenIntroduce}
                                    className={styles.imgPreview}
                                >
                                    <div
                                        className={styles.bg}
                                        style={{
                                            backgroundImage: `url(${course.image_url})`,
                                        }}
                                    ></div>

                                    <FontAwesomeIcon
                                        icon={faCirclePlay}
                                        className={styles.icon}
                                    />
                                    <p>Xem giới thiệu khoá học</p>
                                </div>
                                <h5>
                                    {course.is_pro ? "Mất phí" : "Miễn phí"}
                                </h5>

                                <Button
                                    onClick={handleRegisterLesson}
                                    className={styles.wrapper}
                                    rounded
                                >
                                    <span className={styles.inner}>
                                        <span className={styles.title}>
                                            ĐĂNG KÝ HỌC
                                        </span>
                                    </span>
                                </Button>

                                <ul className="d-md-none">
                                    <li>
                                        <FontAwesomeIcon
                                            icon={faGaugeHigh}
                                            className={styles.icon}
                                        />

                                        <span>{course.level.title}</span>
                                    </li>
                                    <li>
                                        <FontAwesomeIcon
                                            icon={faFilm}
                                            className={styles.icon}
                                        />
                                        <span>
                                            Tổng số <strong>118</strong> bài học
                                        </span>
                                    </li>
                                    <li>
                                        <FontAwesomeIcon
                                            icon={faClock}
                                            className={styles.icon}
                                        />
                                        <span>
                                            Thời lượng{" "}
                                            <strong>28 giờ 05 phút</strong>
                                        </span>
                                    </li>
                                    <li>
                                        <FontAwesomeIcon
                                            icon={faBatteryFull}
                                            className={styles.icon}
                                        />
                                        <span>Học mọi lúc, mọi nơi</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </ParentCard>
            {openIntroduce && (
                <Model onCancel={onCancel}>
                    <>
                        <div className={styles.model}>
                            <h3>Giới thiệu khoá học</h3>
                            <h2>{course.title}</h2>

                            <div className={styles.wrapper}>
                                <div className={styles.player}>
                                    <div className={styles.inner}>
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src="https://www.youtube.com/embed/x0fSBAgBrOQ?si=5wNywhnas3MPlZUH"
                                            title="YouTube video player"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            referrerPolicy="strict-origin-when-cross-origin"
                                            allowfullscreen
                                        ></iframe>{" "}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>

                    <ScrollLock />
                </Model>
            )}
        </>
    );
}

export default CourseDetail;
