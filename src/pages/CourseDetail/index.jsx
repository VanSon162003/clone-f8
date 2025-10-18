import { useEffect, useState } from "react";
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
import Model from "@/components/Model";
import ScrollLock from "@/components/ScrollLock";
import CourseRegistrationButton from "@/components/CourseRegistrationButton";
import { useParams } from "react-router-dom";
import { useGetBySlugQuery } from "@/services/coursesService";

function CourseDetail() {
    const [course, setCourse] = useState({});
    const [openCollapse, setOpenCollapse] = useState([]);
    const [isCollapseAll, setIsCollapseAll] = useState(false);
    const [openIntroduce, setOpenIntroduce] = useState(false);

    const { slug } = useParams();
    const { data, isSuccess } = useGetBySlugQuery(
        { slug },
        {
            refetchOnMountOrArgChange: true,
        }
    );

    useEffect(() => {
        if (data?.data && isSuccess) {
            setCourse((prev) => {
                return {
                    ...prev,
                    ...data.data,
                    requirement: JSON.parse(data.data.requirement),
                    what_you_learn: JSON.parse(data.data.what_you_learn),
                };
            });
        }
    }, [data, isSuccess]);

    const formatDuration = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h} giờ ${m} phút`;
        if (m > 0) return `${m} phút ${s} giây`;
        return `${s} giây`;
    };

    const formatDurationBySeconds = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    const formatCurrencyVND = (value) => {
        const number = Math.round(parseFloat(value) / 1000) * 1000;
        return new Intl.NumberFormat("vi-VN").format(number) + "đ";
    };

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

    // Removed handleRegisterLesson as it's replaced by CourseRegistrationButton

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
                                                {course?.what_you_learn?.map(
                                                    (item) => {
                                                        return (
                                                            <li key={item}>
                                                                <FontAwesomeIcon
                                                                    className={
                                                                        styles.icon
                                                                    }
                                                                    icon={
                                                                        faCheck
                                                                    }
                                                                />

                                                                <span>
                                                                    {item}
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
                                                        {course.total_track}{" "}
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
                                                        {course.total_lesson}
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
                                                                course.total_duration
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
                                            {course.tracks?.map((track) => {
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
                                                                            course.total_lesson
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
                                                                        {track.lessons.map(
                                                                            (
                                                                                lesson
                                                                            ) => {
                                                                                return (
                                                                                    <div
                                                                                        className={
                                                                                            styles.lessonItem
                                                                                        }
                                                                                        key={
                                                                                            lesson.id
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
                                                                                                    lesson.position
                                                                                                }
                                                                                                {
                                                                                                    ". "
                                                                                                }
                                                                                                {
                                                                                                    lesson.title
                                                                                                }
                                                                                            </div>
                                                                                        </span>

                                                                                        <span>
                                                                                            {formatDurationBySeconds(
                                                                                                lesson.duration
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
                                    <h2>Yêu cầu</h2>

                                    <section
                                        className={styles.index_module_row}
                                    >
                                        <section className={styles.col}>
                                            <ul
                                                className={`${styles.list} ${styles.column}`}
                                            >
                                                {course.requirement?.map(
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
                                                                    {item}
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
                                            backgroundImage: `url(${course.thumbnail})`,
                                        }}
                                    ></div>

                                    <FontAwesomeIcon
                                        icon={faCirclePlay}
                                        className={styles.icon}
                                    />
                                    <p>Xem giới thiệu khoá học</p>
                                </div>
                                <h5>
                                    {course?.is_pro
                                        ? `${formatCurrencyVND(course?.price)}`
                                        : "Miễn phí"}
                                </h5>

                                <CourseRegistrationButton
                                    courseId={course.id}
                                    courseSlug={slug}
                                    isPro={course.is_pro}
                                    onError={(error) =>
                                        console.error(
                                            "Registration error:",
                                            error
                                        )
                                    }
                                />

                                <ul className="d-md-none">
                                    <li>
                                        <FontAwesomeIcon
                                            icon={faGaugeHigh}
                                            className={styles.icon}
                                        />

                                        <span>{course.level}</span>
                                    </li>
                                    <li>
                                        <FontAwesomeIcon
                                            icon={faFilm}
                                            className={styles.icon}
                                        />
                                        <span>
                                            Tổng số{" "}
                                            <strong>
                                                {course?.total_lesson}
                                            </strong>{" "}
                                            bài học
                                        </span>
                                    </li>
                                    <li>
                                        <FontAwesomeIcon
                                            icon={faClock}
                                            className={styles.icon}
                                        />
                                        <span>
                                            Thời lượng{" "}
                                            <strong>
                                                {" "}
                                                {formatDuration(
                                                    course?.total_duration
                                                )}
                                            </strong>
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
