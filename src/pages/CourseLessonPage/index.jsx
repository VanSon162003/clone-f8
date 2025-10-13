import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "./components/Footer";
import Header from "./components/Header";
import styles from "./CourseLessonPage.module.scss";
import {
    faChevronDown,
    faChevronUp,
    faCircleCheck,
    faCirclePlay,
    faCircleQuestion,
    faComments,
    faCompactDisc,
    faFileLines,
    faHeart,
    faLock,
    faPen,
    faPlus,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import CommentSidebar from "@/components/CommentSidebar";
import { useParams } from "react-router-dom";
import { useGetBySlugQuery } from "@/services/coursesService";
import useQuery from "@/hook/useQuery";

import DOMPurify from "dompurify";

function CourseLessonPage() {
    const { param } = useQuery();

    const [openSideBar, setOpenSideBar] = useState(true);
    const [openCommentSideBar, setOpenCommentSideBar] = useState(false);
    const [trackLessons, setTrackLessons] = useState([]); // mở lesson mà track đang được active
    const [trackStepActive, setTrackStepActive] = useState(null); // lấy ra bài học đang được học
    const [lessonByTrackId, setLessonByTrackId] = useState(null); // Lấy ra track id mà người dùng đang học tại chương nào
    const [course, setCourse] = useState({});
    const [lesson, setLesson] = useState({});
    const [idTrack, setIdTrack] = useState(() => +param.get("track-id"));
    const [idLesson, setIdLesson] = useState(() => +param.get("lesson-id"));

    // reload track mỗi khi chạm đáy 10 phần tử
    const [hasMore, setHasMore] = useState(true);

    const [offset, setOffset] = useState(0);
    const limit = 10;
    const [tracks, setTracks] = useState([]);

    const { slug } = useParams();

    const { data, isSuccess, isFetching } = useGetBySlugQuery(
        { slug, offset, limit },
        {
            refetchOnMountOrArgChange: true,
        }
    );

    // lấy ra các tracks (chương bài học)
    useEffect(() => {
        if (data?.data?.tracks) {
            setTracks((prev) => {
                return [...prev, ...data.data.tracks];
            });

            if (data.data.tracks.length < limit) setHasMore(false);
        }
    }, [data]);

    const observer = useRef();

    const lastTrackRef = (node) => {
        if (isFetching || !hasMore) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setOffset((prev) => prev + limit);
            }
        });

        if (node) observer.current.observe(node);
    };

    // lấy ra lesson thông qua id
    useEffect(() => {
        if (idLesson && idTrack) {
            setLesson(() => {
                const track = tracks?.find((track) => track.id === idTrack);

                const lesson = track?.lessons.find(
                    (lesson) => lesson.id === idLesson
                );

                return lesson;
            });
        }
    }, [idLesson, idTrack, tracks]);

    // kiểm tra người dùng đang học đến bìa nào và active đến đó
    useEffect(() => {
        if (!course) return;

        const currentLessonId =
            course?.userProgress?.[0]?.UserCourseProgress?.current_lesson_id;

        const currentTrack = course.tracks?.find((track) =>
            track.lessons?.some((lesson) => lesson.id === currentLessonId)
        );

        if (currentTrack) {
            setTrackLessons((prev) => [...prev, currentTrack.id]);
            setLessonByTrackId(currentTrack.id);
        }

        setTrackStepActive(currentLessonId);

        setIdTrack(currentTrack?.id);
        setIdLesson(currentLessonId);
    }, [course]);

    // xét course
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

    const toggleSideBar = () => {
        setOpenSideBar(!openSideBar);
    };

    const formatDuration = (seconds) => {
        if (typeof seconds !== "number" || seconds < 0) return "00:00";

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        return `${String(minutes).padStart(2, "0")}:${String(
            remainingSeconds
        ).padStart(2, "0")}`;
    };

    function formatVietnameseMonthYear(isoString) {
        if (!isoString) return "";
        const date = new Date(isoString);

        if (isNaN(date)) return "";

        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return `tháng ${month} năm ${year}`;
    }

    const handleCancelCommentSideBar = () => {
        setOpenCommentSideBar(false);
    };

    const handleTrackStepActive = (e, id) => {
        e.stopPropagation();
        setTrackStepActive(id);
    };

    const handleOpenTrackLesson = (id) => {
        setTrackLessons((prev) => {
            if (prev.includes(id)) return prev.filter((item) => item !== id);
            else return [...prev, id];
        });
    };

    return (
        <>
            <section
                className={`${styles.indexModule_grid} ${styles.indexModule_fullWidth}`}
            >
                <Header />
                {openSideBar && (
                    <div className={styles.sidebar}>
                        <div id="learn-playlist" className={styles.container}>
                            <header className={styles.header}>
                                <h1 className={styles.heading}>
                                    Nội dung khóa học
                                </h1>
                                <button className={styles.closeBtn}>
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>
                            </header>
                            <div className={styles.body}>
                                {tracks?.map((track, i) => {
                                    const openLesson = trackLessons?.includes(
                                        track.id
                                    );

                                    const isLast = i === tracks.length - 1;

                                    const countLessonCompleted =
                                        track?.lessons?.reduce(
                                            (acc, lesson) => {
                                                if (
                                                    lesson?.users?.[0]
                                                        ?.UserLesson.completed
                                                ) {
                                                    return acc + 1;
                                                } else return acc;
                                            },
                                            0
                                        );

                                    return (
                                        <>
                                            <div
                                                ref={
                                                    isLast ? lastTrackRef : null
                                                }
                                                className={
                                                    styles.sectionWrapper
                                                }
                                                onClick={() =>
                                                    handleOpenTrackLesson(
                                                        track.id
                                                    )
                                                }
                                            >
                                                <h3
                                                    className={
                                                        styles.sectionTitle
                                                    }
                                                >
                                                    {`${track.position}. ${track.title}`}
                                                </h3>
                                                <span
                                                    className={
                                                        styles.sectionDesc
                                                    }
                                                >
                                                    {`${countLessonCompleted}/${
                                                        track.total_lesson
                                                    } | ${formatDuration(
                                                        track.total_duration
                                                    )}`}
                                                </span>
                                                <span
                                                    className={
                                                        styles.sectionIcon
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={
                                                            openLesson
                                                                ? faChevronUp
                                                                : faChevronDown
                                                        }
                                                    />
                                                </span>
                                            </div>

                                            {openLesson && (
                                                <div
                                                    className={`${styles.trackStepsList} ${styles.open}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                    }}
                                                >
                                                    {track.lessons.map(
                                                        (lesson) => {
                                                            const stepType =
                                                                lesson.lesson_type;

                                                            const iconType =
                                                                stepType ===
                                                                "Video"
                                                                    ? faCirclePlay
                                                                    : stepType ===
                                                                      "Lesson"
                                                                    ? faFileLines
                                                                    : stepType ===
                                                                      "Challenge"
                                                                    ? faPen
                                                                    : faCircleQuestion;

                                                            const lessonCompleted =
                                                                lesson?.users[0]
                                                                    ?.UserLesson
                                                                    ?.completed;
                                                            return (
                                                                <>
                                                                    <div
                                                                        className={`${
                                                                            styles.learnItem
                                                                        } ${
                                                                            trackStepActive ===
                                                                                lesson.id &&
                                                                            styles.active
                                                                        } 
                                                                        
                                                                        ${
                                                                            !lessonCompleted &&
                                                                            lessonCompleted !==
                                                                                false &&
                                                                            styles.lock
                                                                        }`}
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            handleTrackStepActive(
                                                                                e,
                                                                                lesson.id
                                                                            );

                                                                            setIdLesson(
                                                                                lesson.id
                                                                            );
                                                                            setIdTrack(
                                                                                track.id
                                                                            );
                                                                        }}
                                                                    >
                                                                        <div
                                                                            className={
                                                                                styles.info
                                                                            }
                                                                        >
                                                                            <h3
                                                                                className={
                                                                                    styles.title
                                                                                }
                                                                            >
                                                                                {`${lesson.position}. ${lesson.title}`}
                                                                            </h3>
                                                                            <p
                                                                                className={
                                                                                    styles.desc
                                                                                }
                                                                            >
                                                                                <FontAwesomeIcon
                                                                                    icon={
                                                                                        (stepType ===
                                                                                            "Video" &&
                                                                                            trackStepActive ===
                                                                                                lesson.id &&
                                                                                            faCompactDisc) ||
                                                                                        iconType
                                                                                    }
                                                                                    className={
                                                                                        stepType ===
                                                                                            "Video" &&
                                                                                        trackStepActive ===
                                                                                            lesson.id &&
                                                                                        styles.active
                                                                                    }
                                                                                />
                                                                                <span>
                                                                                    {`${formatDuration(
                                                                                        lesson.duration
                                                                                    )}`}
                                                                                </span>
                                                                            </p>
                                                                        </div>
                                                                        <div
                                                                            className={
                                                                                styles.iconBox
                                                                            }
                                                                        >
                                                                            {/* falock */}
                                                                            {lesson
                                                                                ?.users
                                                                                .length ===
                                                                            0 ? (
                                                                                <FontAwesomeIcon
                                                                                    className={`${styles.stateIcon} ${styles.faLock}`}
                                                                                    icon={
                                                                                        faLock
                                                                                    }
                                                                                />
                                                                            ) : (
                                                                                <FontAwesomeIcon
                                                                                    className={`${styles.stateIcon}`}
                                                                                    icon={
                                                                                        (lessonCompleted &&
                                                                                            faCircleCheck) ||
                                                                                        null
                                                                                    }
                                                                                />
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                <div
                    className={`${styles.wrapper} ${
                        !openSideBar && styles.fulWidth
                    }`}
                >
                    <div
                        className={`${styles.wrapperInner}  noselect ${styles.fulWidth}`}
                    >
                        <div data-tour="learning-center">
                            <div className={styles.videoWrapper}>
                                <div
                                    className={styles.player}
                                    style={{ width: "100%", height: "100%" }}
                                >
                                    <div
                                        className={styles.reactPlayer__preview}
                                        tabIndex={0}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            backgroundSize: "cover",
                                            backgroundPosition: "center center",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundImage: `url(${lesson?.thumbnail})`,
                                        }}
                                    >
                                        <div
                                            className={
                                                styles.reactPlayer__shadow
                                            }
                                            style={{
                                                background:
                                                    "radial-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0) 60%)",
                                                borderRadius: "64px",
                                                width: "64px",
                                                height: "64px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <div
                                                className={
                                                    styles.reactPlayer__playIcon
                                                }
                                                style={{
                                                    borderStyle: "solid",
                                                    borderWidth:
                                                        "16px 0px 16px 26px",
                                                    borderColor:
                                                        "transparent transparent transparent white",
                                                    marginLeft: "7px",
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className={`${styles.content} ${
                            !openSideBar && styles.fulWidth
                        }`}
                    >
                        <div className={styles.contentTop}>
                            <header className={styles.header}>
                                <h1 className={styles.heading}>
                                    {lesson?.title}
                                </h1>
                                <p className={styles.updated}>
                                    Cập nhật{" "}
                                    {formatVietnameseMonthYear(
                                        lesson?.updated_at
                                    )}
                                </p>
                            </header>

                            <button
                                className={styles.addNote}
                                data-tour="notes-tutorial"
                            >
                                <FontAwesomeIcon icon={faPlus} />
                                <span className={styles.label}>
                                    Thêm ghi chú tại{" "}
                                    <span className={styles.num}>00:00</span>
                                </span>
                            </button>
                        </div>

                        <div
                            className={styles.lessonBody}
                            style={{
                                "--font-size": "1.6rem",
                                "--line-height": "1.8",
                            }}
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(lesson?.content),
                            }}
                        >
                            {/* <p>
                                Tham gia nhóm{" "}
                                <a
                                    rel="noopener noreferrer nofollow"
                                    target="_blank"
                                    href="https://www.facebook.com/groups/f8official/"
                                >
                                    Học lập trình tại F8
                                </a>{" "}
                                trên Facebook để cùng nhau trao đổi trong quá
                                trình học tập ❤️
                            </p>
                            <p>
                                Các bạn subscribe kênh Youtube{" "}
                                <a
                                    rel="noopener noreferrer nofollow"
                                    target="_blank"
                                    href="https://url.mycv.vn/f8_youtube?ref=lesson_desc"
                                >
                                    F8 Official
                                </a>{" "}
                                để nhận thông báo khi có các bài học mới nhé ❤️
                            </p> */}
                        </div>
                    </div>

                    <p className={styles.footer}>
                        Made with{" "}
                        <FontAwesomeIcon
                            icon={faHeart}
                            className={styles.heart}
                        />
                        <span className={styles.dot}>·</span> Powered by F8
                    </p>
                </div>

                <div
                    data-tour="comments-tutorial"
                    className={`${styles.commentBtn} ${
                        openSideBar && styles.showTracks
                    }`}
                    onClick={() => setOpenCommentSideBar(!openCommentSideBar)}
                >
                    <button className={styles.commentWrapper}>
                        <FontAwesomeIcon icon={faComments} />
                        <span className={styles.title}>Hỏi đáp</span>
                    </button>
                </div>
                <Footer
                    openSideBar={openSideBar}
                    toggleSideBar={toggleSideBar}
                    track={tracks.find((track) => track.id === lessonByTrackId)}
                />
            </section>

            {
                <CommentSidebar
                    commentableId={trackStepActive}
                    commentableType={"question"}
                    open={openCommentSideBar}
                    onCancel={handleCancelCommentSideBar}
                />
            }
        </>
    );
}

export default CourseLessonPage;
