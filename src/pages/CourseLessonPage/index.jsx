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
import {
    useGetBySlugQuery,
    useGetUserLessonProgressQuery,
    // useUpdateCourseProgressMutation,
    useUpdateUserCourseProgressMutation,
} from "@/services/coursesService";
import useQuery from "@/hook/useQuery";
import DOMPurify from "dompurify";
import VideoPlayer from "@/components/VideoPlayer";
import NotesSidebar from "./components/NotesSidebar";
import TutorialGuide from "./components/TutorialGuide";
import { useCreateNoteMutation } from "@/services/notesService";

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

    const [totalComments, setTotalComments] = useState(0);
    const [isWatch, setIsWatch] = useState(false);

    // video playback state for notes
    const [currentVideoTime, setCurrentVideoTime] = useState(0);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    // notes modal
    const [noteModalOpen, setNoteModalOpen] = useState(false);
    const [noteContent, setNoteContent] = useState("");
    const noteTextareaRef = useRef(null);
    const [createNote, { isLoading: isCreating }] = useCreateNoteMutation();
    const [showNoteToast, setShowNoteToast] = useState(false);
    const [noteToastMessage, setNoteToastMessage] = useState("");
    const [openNotesSidebar, setOpenNotesSidebar] = useState(false);
    const [tutorialOpen, setTutorialOpen] = useState(false);
    // reload track mỗi khi chạm đáy 10 phần tử
    const [hasMore, setHasMore] = useState(true);

    const [offset, setOffset] = useState(0);
    const limit = 10;
    const [tracks, setTracks] = useState([]);

    const { slug } = useParams();

    const { data, isSuccess, isFetching } = useGetBySlugQuery(
        {
            slug,
            offset,
            limit,
        },
        {
            refetchOnMountOrArgChange: true,
            refetchOnFocus: true,
            refetchOnReconnect: true,
        }
    );
    const { data: userLessonData, isSuccess: isUserLessonSuccess } =
        useGetUserLessonProgressQuery(
            { courseId: course?.id },
            {
                refetchOnMountOrArgChange: true,
                refetchOnFocus: true,
                refetchOnReconnect: true,
            }
        );

    const [updateUserCourseProgress] = useUpdateUserCourseProgressMutation();

    // lấy ra các tracks (chương bài học)
    useEffect(() => {
        if (data?.data?.tracks) {
            // If offset is 0 (initial load or slug changed), replace tracks.
            // Otherwise append for pagination.
            if (offset === 0) {
                setTracks(data.data.tracks);
            } else {
                setTracks((prev) => {
                    return [...prev, ...data.data.tracks];
                });
            }

            if (data.data.tracks.length < limit) setHasMore(false);

            setTotalComments(data.data.total_comment || 0);
        }
    }, [data, offset]);

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

    // Merge user lesson progress với course data
    useEffect(() => {
        if (userLessonData?.data && isUserLessonSuccess && course?.id) {
            const userLessons =
                userLessonData.data.tracks?.flatMap((track) =>
                    track.lessons?.map((lesson) => ({
                        lessonId: lesson.id,
                        userLesson: lesson.userLessons?.[0] || null,
                    }))
                ) || [];

            // Cập nhật tracks với user lesson progress
            setTracks((prevTracks) =>
                prevTracks.map((track) => ({
                    ...track,
                    lessons: track.lessons.map((lesson) => {
                        const userLessonInfo = userLessons.find(
                            (ul) => ul.lessonId === lesson.id
                        );
                        return {
                            ...lesson,
                            userLesson: userLessonInfo?.userLesson || null,
                        };
                    }),
                }))
            );
        }
    }, [userLessonData, isUserLessonSuccess, course?.id]);

    // Tự động mở bài tiếp theo khi lesson hiện tại được completed
    useEffect(() => {
        if (isCurrentLessonCompleted()) {
            const next = findNextLesson();
            if (next) {
                // Mở track của bài tiếp theo
                if (!trackLessons.includes(next.track.id)) {
                    setTrackLessons((prev) => [...prev, next.track.id]);
                }
            }
        }
    }, [tracks, idLesson, trackLessons]); // Re-run khi tracks, idLesson hoặc trackLessons thay đổi

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

    const getYouTubeEmbedUrl = (url) => {
        if (!url) return null;

        try {
            const parsedUrl = new URL(url);
            let videoId = null;

            if (
                parsedUrl.hostname.includes("youtube.com") &&
                parsedUrl.searchParams.get("v")
            ) {
                videoId = parsedUrl.searchParams.get("v");
            } else if (parsedUrl.hostname === "youtu.be") {
                videoId = parsedUrl.pathname.slice(1);
            } else if (parsedUrl.pathname.startsWith("/embed/")) {
                videoId = parsedUrl.pathname.split("/embed/")[1];
            } else if (parsedUrl.pathname.startsWith("/shorts/")) {
                videoId = parsedUrl.pathname.split("/shorts/")[1];
            }

            return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        } catch (error) {
            console.error("Invalid URL:", error);
            return null;
        }
    };

    const handleWatchVideo = () => {
        setIsWatch(true);
    };

    // Hàm để tìm lesson tiếp theo
    const findNextLesson = () => {
        const allLessons = tracks.flatMap((track) => track.lessons);
        const currentIndex = allLessons.findIndex(
            (lesson) => lesson.id === idLesson
        );

        if (currentIndex < allLessons.length - 1) {
            const nextLesson = allLessons[currentIndex + 1];
            const nextTrack = tracks.find((track) =>
                track.lessons.some((lesson) => lesson.id === nextLesson.id)
            );

            return { lesson: nextLesson, track: nextTrack };
        }
        return null;
    };

    // Hàm để tìm lesson trước đó
    const findPrevLesson = () => {
        const allLessons = tracks.flatMap((track) => track.lessons);
        const currentIndex = allLessons.findIndex(
            (lesson) => lesson.id === idLesson
        );

        if (currentIndex > 0) {
            const prevLesson = allLessons[currentIndex - 1];
            const prevTrack = tracks.find((track) =>
                track.lessons.some((lesson) => lesson.id === prevLesson.id)
            );

            return { lesson: prevLesson, track: prevTrack };
        }
        return null;
    };

    // Xử lý khi nhấn nút bài tiếp theo
    const handleNextLesson = async () => {
        const next = findNextLesson();

        // Attempt to mark current lesson as completed on the server
        try {
            const lastPosition = Number(
                localStorage.getItem(`video_progress_${idLesson}`)
            );
            const watchDuration = isNaN(lastPosition) ? 0 : lastPosition;

            // call API to update lesson progress as completed
            updateUserCourseProgress({
                lessonId: idLesson,
                watchDuration,
                lastPosition: watchDuration,
                completed: true,
            })
                .then(() => {
                    // Optimistically update local tracks to mark current lesson completed
                    setTracks((prevTracks) =>
                        prevTracks.map((track) => ({
                            ...track,
                            lessons: track.lessons.map((lesson) =>
                                lesson.id === idLesson
                                    ? {
                                          ...lesson,
                                          userLesson: {
                                              ...(lesson.userLesson || {}),
                                              completed: true,
                                          },
                                      }
                                    : lesson
                            ),
                        }))
                    );
                })
                .catch((err) => {
                    console.debug("Failed to update lesson completion:", err);
                });
        } catch (err) {
            console.debug("Error preparing progress payload:", err);
        }

        // Navigate to next lesson (unlock/open track if needed)
        if (next) {
            setIdLesson(next.lesson.id);
            setIdTrack(next.track.id);
            setTrackStepActive(next.lesson.id);

            // Mở track nếu chưa mở
            if (!trackLessons.includes(next.track.id)) {
                setTrackLessons((prev) => [...prev, next.track.id]);
            }
            // Khi điều hướng tới bài tiếp theo, reset isWatch để hiển thị khung preview
            setIsWatch(false);
        }
    };

    // Xử lý khi nhấn nút bài trước
    const handlePrevLesson = () => {
        const prev = findPrevLesson();
        if (prev) {
            setIdLesson(prev.lesson.id);
            setIdTrack(prev.track.id);
            setTrackStepActive(prev.lesson.id);

            // Mở track nếu chưa mở
            if (!trackLessons.includes(prev.track.id)) {
                setTrackLessons((prevTracks) => [...prevTracks, prev.track.id]);
            }
        }
    };

    // Kiểm tra xem lesson hiện tại có completed không
    const isCurrentLessonCompleted = () => {
        const currentLesson = tracks
            .flatMap((track) => track.lessons)
            .find((lesson) => lesson.id === idLesson);
        return currentLesson?.userLesson?.completed || false;
    };

    // Kiểm tra xem có thể nhấn nút bài tiếp theo không
    const canGoToNext = () => {
        // Only allow Next if current lesson is completed and there is a next lesson
        return isCurrentLessonCompleted() && !!findNextLesson();
    };

    // Kiểm tra xem có thể nhấn nút bài trước không
    const canGoToPrev = () => {
        const prev = findPrevLesson();
        return prev?.lesson?.userLesson?.completed || false;
    };

    // Kiểm tra xem lesson có thể được click không
    const canClickLesson = (lessonId) => {
        const allLessons = tracks.flatMap((track) => track.lessons);
        const currentIndex = allLessons.findIndex(
            (lesson) => lesson.id === lessonId
        );

        // Lesson đầu tiên luôn có thể click
        if (currentIndex === 0) return true;

        // Kiểm tra lesson trước đó có completed không
        const prevLesson = allLessons[currentIndex - 1];
        return prevLesson?.userLesson?.completed || false;
    };

    return (
        <>
            <section
                className={`${styles.indexModule_grid} ${styles.indexModule_fullWidth}`}
            >
                <Header
                    courseId={course?.id}
                    title={course?.title}
                    onOpenNotes={() => setOpenNotesSidebar(true)}
                    onOpenTutorial={() => setTutorialOpen(true)}
                />
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
                                                    lesson?.userLesson
                                                        ?.completed
                                                ) {
                                                    return acc + 1;
                                                } else return acc;
                                            },
                                            0
                                        );

                                    return (
                                        <div key={track.id}>
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
                                                                lesson
                                                                    ?.userLesson
                                                                    ?.completed;
                                                            return (
                                                                <div
                                                                    key={
                                                                        lesson.id
                                                                    }
                                                                    className={`${
                                                                        styles.learnItem
                                                                    } ${
                                                                        trackStepActive ===
                                                                            lesson.id &&
                                                                        styles.active
                                                                    } 
                                                                    
                                                                    ${
                                                                        (!lessonCompleted &&
                                                                            lessonCompleted !==
                                                                                false) ||
                                                                        (!canClickLesson(
                                                                            lesson.id
                                                                        ) &&
                                                                            styles.lock)
                                                                    }`}
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        // Chỉ cho phép click nếu lesson có thể được click
                                                                        if (
                                                                            !canClickLesson(
                                                                                lesson.id
                                                                            )
                                                                        ) {
                                                                            e.preventDefault();
                                                                            return;
                                                                        }

                                                                        handleTrackStepActive(
                                                                            e,
                                                                            lesson.id
                                                                        );

                                                                        // When switching lessons via sidebar, reset watch state
                                                                        // so the new lesson shows preview (and does not continue previous playback)
                                                                        setIsWatch(
                                                                            false
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
                                                                        {!lesson?.userLesson ||
                                                                        !canClickLesson(
                                                                            lesson.id
                                                                        ) ? (
                                                                            <FontAwesomeIcon
                                                                                className={`${styles.stateIcon} ${styles.faLock}`}
                                                                                icon={
                                                                                    trackStepActive !==
                                                                                        lesson.id &&
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
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            )}
                                        </div>
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
                    {!isWatch ? (
                        <div
                            className={`${styles.wrapperInner}  noselect ${styles.fulWidth}`}
                            onClick={handleWatchVideo}
                        >
                            <div data-tour="learning-center">
                                <div className={styles.videoWrapper}>
                                    <div
                                        className={styles.player}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                        }}
                                    >
                                        <div
                                            className={
                                                styles.reactPlayer__preview
                                            }
                                            tabIndex={0}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                backgroundSize: "cover",
                                                backgroundPosition:
                                                    "center center",
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
                    ) : (
                        // <iframe
                        //     width="100%"
                        //     height="550"
                        //     src={`${getYouTubeEmbedUrl(
                        //         lesson.video_url
                        //     )}?autoplay=1&mute=1`}
                        //     title="YouTube video player"
                        //     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                        //     referrerPolicy="strict-origin-when-cross-origin"
                        //     allowFullScreen
                        // ></iframe>

                        <VideoPlayer
                            key={lesson?.id}
                            videoUrl={`${import.meta.env.VITE_BASE_URL}${
                                lesson?.video_url
                            }`}
                            videoId={lesson?.id}
                            onProgressUpdate={updateUserCourseProgress}
                            autoPlay={isWatch}
                            onTimeUpdate={(t) => {
                                setCurrentVideoTime(t);
                            }}
                            onPlay={() => setIsVideoPlaying(true)}
                            onPause={() => setIsVideoPlaying(false)}
                        />
                    )}

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
                                onClick={() => {
                                    // open note modal
                                    setNoteContent("");
                                    setNoteModalOpen(true);
                                }}
                            >
                                <FontAwesomeIcon icon={faPlus} />
                                <span className={styles.label}>
                                    Thêm ghi chú tại{" "}
                                    <span className={styles.num}>
                                        {formatDuration(
                                            Math.floor(currentVideoTime)
                                        )}
                                    </span>
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
                    onPrev={handlePrevLesson}
                    onNext={handleNextLesson}
                    disabledNext={!canGoToNext()}
                    disabledPrev={!canGoToPrev()}
                />
            </section>
            {
                <CommentSidebar
                    commentableId={trackStepActive}
                    commentableType={"question"}
                    open={openCommentSideBar}
                    onCancel={handleCancelCommentSideBar}
                    totalComment={totalComments}
                    setTotalComment={setTotalComments}
                />
            }

            <NotesSidebar
                open={openNotesSidebar}
                onClose={() => setOpenNotesSidebar(false)}
                courseId={course?.id}
                tracks={tracks}
                onJumpToLesson={(lessonId, time) => {
                    // close sidebar and jump to lesson
                    setOpenNotesSidebar(false);
                    if (lessonId) {
                        // Find the track that contains this lesson
                        const trackContainingLesson = tracks.find((t) =>
                            t.lessons?.some((l) => l.id === lessonId)
                        );

                        if (trackContainingLesson) {
                            setIdTrack(trackContainingLesson.id);

                            // Open track in sidebar if not already open
                            setTrackLessons((prev) => {
                                if (!prev.includes(trackContainingLesson.id)) {
                                    return [...prev, trackContainingLesson.id];
                                }
                                return prev;
                            });
                        }

                        // Set the active lesson
                        setIdLesson(lessonId);
                        setTrackStepActive(lessonId);

                        // store desired time so VideoPlayer will seek to it on mount
                        if (typeof time === "number") {
                            localStorage.setItem(
                                `video_progress_${lessonId}`,
                                time
                            );
                        }
                        setIsWatch(true);
                    }
                }}
            />

            {/* Note modal (styled via CSS module) */}
            {noteModalOpen && (
                <div
                    className={styles.noteModalBackdrop}
                    onClick={() => setNoteModalOpen(false)}
                >
                    <div
                        className={styles.noteModal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>Thêm ghi chú</h3>
                        <p>
                            Thời gian:{" "}
                            <strong>
                                {formatDuration(Math.floor(currentVideoTime))}
                            </strong>
                        </p>
                        <textarea
                            ref={noteTextareaRef}
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            placeholder="Ghi nội dung ghi chú..."
                            rows={6}
                        />
                        <div className={styles.noteModal__actions}>
                            <button
                                type="button"
                                className={`${styles.btn} ${styles["btn--secondary"]}`}
                                onClick={() => setNoteModalOpen(false)}
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                className={`${styles.btn} ${styles["btn--primary"]}`}
                                onClick={async () => {
                                    if (!noteContent.trim()) return;
                                    try {
                                        await createNote({
                                            lesson_id: lesson?.id,
                                            content: noteContent.trim(),
                                            video_timestamp:
                                                Math.floor(currentVideoTime),
                                        }).unwrap();

                                        // reset UI
                                        setNoteContent("");

                                        setNoteModalOpen(false);
                                        // show success toast
                                        setNoteToastMessage(
                                            "Đã thêm ghi chú thành công"
                                        );
                                        setShowNoteToast(true);
                                        setTimeout(
                                            () => setShowNoteToast(false),
                                            2500
                                        );
                                    } catch (err) {
                                        console.error(
                                            "Failed to create note",
                                            err
                                        );
                                        // keep modal open so user can retry
                                    }
                                }}
                                disabled={!noteContent.trim() || isCreating}
                            >
                                {isCreating ? "Đang lưu..." : "Lưu"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Toast */}
            {showNoteToast && (
                <div className={styles.noteToast} role="status">
                    {noteToastMessage}
                </div>
            )}

            <TutorialGuide
                open={tutorialOpen}
                onClose={() => setTutorialOpen(false)}
            />
        </>
    );
}

export default CourseLessonPage;
