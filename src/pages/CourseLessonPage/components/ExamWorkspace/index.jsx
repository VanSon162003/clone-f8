import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Radio, Input, Space, Modal, Alert, Progress, Tag, Typography, Row, Col, message } from "antd";
import {
    ClockCircleOutlined,
    WarningOutlined,
    ArrowLeftOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    EditOutlined,
    FileTextOutlined,
    ThunderboltOutlined
} from "@ant-design/icons";
import {
    useGetExamDetailsQuery,
    useStartExamMutation,
    useSubmitExamMutation
} from "@/services/examsService";
import {
    useGetBySlugQuery,
    useGetCourseProgressQuery,
    useGetUserLessonProgressQuery,
    useUpdateCourseProgressMutation,
    useUpdateUserCourseProgressMutation
} from "@/services/coursesService";

const { Title, Text, Paragraph } = Typography;

function ExamWorkspace() {
    const { slug } = useParams();
    const navigate = useNavigate();

    // Fetch Course details
    const { data: courseResponse, isLoading: isCourseLoading } = useGetBySlugQuery({ slug });
    const course = courseResponse?.data;

    const {
        data: progressResponse,
        isLoading: isProgressLoading,
        refetch: refetchProgress
    } =
        useGetCourseProgressQuery(
            { courseId: course?.id },
            { skip: !course?.id, refetchOnMountOrArgChange: true }
        );

    const {
        data: userLessonResponse,
        isLoading: isUserLessonsLoading,
        refetch: refetchUserLessons
    } =
        useGetUserLessonProgressQuery(
            { courseId: course?.id },
            { skip: !course?.id, refetchOnMountOrArgChange: true }
        );

    // Fetch Exam details
    const {
        data: examResponse,
        isLoading: isExamLoading,
        refetch: refetchExam
    } = useGetExamDetailsQuery(
        { courseId: course?.id },
        {
            skip: !course?.id,
            refetchOnMountOrArgChange: true,
            refetchOnFocus: true,
        }
    );
    const exam = examResponse?.data;

    const courseCompletion = useMemo(() => {
        const progressCourse = progressResponse?.data;
        const userProgress =
            progressCourse?.userProgress?.[0] || course?.userProgress?.[0];
        const lessonsFromProgress =
            userLessonResponse?.data?.tracks?.flatMap(
                (track) => track.lessons || []
            ) || [];
        const lessonsFromCourse =
            course?.tracks?.flatMap((track) => track.lessons || []) || [];
        const lessons =
            lessonsFromProgress.length > 0
                ? lessonsFromProgress
                : lessonsFromCourse;
        const totalLessons =
            progressCourse?.totalLessonByCourse ||
            course?.totalLessonByCourse ||
            lessons.length ||
            0;
        const completedLessons = lessons.filter(
            (lesson) =>
                lesson?.userLessons?.[0]?.completed ||
                lesson?.userLesson?.completed
        );
        const rawLearnedLessons = userProgress?.learned_lessons;
        let learnedLessons = [];

        if (Array.isArray(rawLearnedLessons)) {
            learnedLessons = rawLearnedLessons;
        } else if (typeof rawLearnedLessons === "string") {
            try {
                learnedLessons = JSON.parse(rawLearnedLessons) || [];
            } catch (error) {
                console.debug("Cannot parse learned_lessons:", error);
            }
        }

        const isCompleted =
            totalLessons > 0 &&
            (completedLessons.length >= totalLessons ||
                learnedLessons.length >= totalLessons ||
                Number(userProgress?.progress || 0) >= 100 ||
                Boolean(userProgress?.is_completed));

        return {
            isCompleted,
            lessons,
            totalLessons,
        };
    }, [course, progressResponse, userLessonResponse]);

    const isCourseCompletedForExam = courseCompletion.isCompleted;
    const isExamLocked = Boolean(exam?.is_locked) && !isCourseCompletedForExam;

    // Mutations
    const [startExam, { isLoading: isStarting }] = useStartExamMutation();
    const [submitExam, { isLoading: isSubmitting }] = useSubmitExamMutation();
    const [updateUserCourseProgress] = useUpdateUserCourseProgressMutation();
    const [updateCourseProgress] = useUpdateCourseProgressMutation();

    // Local state
    const [activeSubmission, setActiveSubmission] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({}); // { [questionId]: { selected_answer, essay_answer } }
    const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
    const [cheatCount, setCheatCount] = useState(0);
    const [cheatLogs, setCheatLogs] = useState([]);
    const [examStarted, setExamStarted] = useState(false);
    const [examFinished, setExamFinished] = useState(false);
    const [finishedResult, setFinishedResult] = useState(null);
    const [isSyncingProgress, setIsSyncingProgress] = useState(false);

    // Refs
    const timerRef = useRef(null);
    const cheatCountRef = useRef(0);
    const cheatLogsRef = useRef([]);

    // Check visibility change & window blur for anti-cheating
    useEffect(() => {
        if (!examStarted || examFinished) return;

        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                triggerCheatWarning("Ẩn trình duyệt / chuyển tab");
            }
        };

        const handleWindowBlur = () => {
            triggerCheatWarning("Click ra ngoài cửa sổ làm việc");
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleWindowBlur);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleWindowBlur);
        };
    }, [examStarted, examFinished]);

    // Update cheatCountRef & cheatLogsRef to avoid closures issues
    useEffect(() => {
        cheatCountRef.current = cheatCount;
    }, [cheatCount]);

    useEffect(() => {
        cheatLogsRef.current = cheatLogs;
    }, [cheatLogs]);

    const triggerCheatWarning = (reason) => {
        if (examFinished) return;
        const newCount = cheatCountRef.current + 1;
        const timestamp = new Date().toISOString();
        const logEntry = { timestamp, reason, count: newCount };
        
        const updatedLogs = [...cheatLogsRef.current, logEntry];
        setCheatCount(newCount);
        setCheatLogs(updatedLogs);

        if (newCount >= 3) {
            Modal.error({
                title: "VI PHẠM QUY CHẾ THI",
                content: "Bạn đã chuyển tab / rời cửa sổ thi quá 3 lần. Hệ thống sẽ tự động nộp bài thi ngay lập tức.",
                okText: "Đồng ý",
                onOk: () => {
                    handleAutoSubmitCheating(updatedLogs);
                }
            });
            // Automatically submit after a small delay in case they don't click OK
            setTimeout(() => {
                handleAutoSubmitCheating(updatedLogs);
            }, 3000);
        } else {
            Modal.warning({
                title: "CẢNH BÁO GIAN LẬN",
                content: `Bạn đã chuyển tab hoặc rời cửa sổ thi ${newCount}/3 lần. Nếu vi phạm 3 lần, bài thi sẽ bị tự động nộp ngay lập tức.`,
                okText: "Quay lại làm bài"
            });
        }
    };

    // Countdown Timer logic
    useEffect(() => {
        if (examStarted && timeRemaining > 0 && !examFinished) {
            timerRef.current = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        handleAutoSubmitTimeout();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [examStarted, timeRemaining, examFinished]);

    const getStartErrorMessage = (error) =>
        error?.data?.message ||
        error?.message ||
        "Không thể bắt đầu làm bài thi";

    const syncCompletedLessonsBeforeStart = async () => {
        if (!isCourseCompletedForExam) return;

        const lessons = courseCompletion.lessons.filter((lesson) => lesson?.id);

        if (lessons.length === 0) return;

        setIsSyncingProgress(true);
        try {
            await Promise.all(
                lessons.map((lesson) => {
                    const existingProgress =
                        lesson?.userLessons?.[0] || lesson?.userLesson || {};
                    const watchDuration =
                        existingProgress.watch_duration ||
                        existingProgress.watchDuration ||
                        lesson.duration ||
                        0;
                    const lastPosition =
                        existingProgress.last_position ||
                        existingProgress.lastPosition ||
                        watchDuration;

                    return Promise.allSettled([
                        updateUserCourseProgress({
                            lessonId: lesson.id,
                            watchDuration,
                            lastPosition,
                            completed: true,
                        }).unwrap(),
                        course?.id
                            ? updateCourseProgress({
                                  courseId: course.id,
                                  lessonId: lesson.id,
                              }).unwrap()
                            : Promise.resolve(),
                    ]).then((results) => {
                        if (
                            results.every(
                                (result) => result.status === "rejected"
                            )
                        ) {
                            throw results[0].reason;
                        }
                    });
                })
            );

            await Promise.all([
                refetchUserLessons(),
                refetchProgress(),
                refetchExam(),
            ]);
        } finally {
            setIsSyncingProgress(false);
        }
    };

    const startExamSession = async () => {
        const res = await startExam({ examId: exam.id }).unwrap();
        if (!res.success || !res.data) {
            throw new Error(res.message || "Không thể bắt đầu làm bài thi");
        }

        setActiveSubmission(res.data.submission);
        setQuestions(res.data.questions);
        setTimeRemaining(res.data.duration * 60);
        setExamStarted(true);
        // Initialize empty answers state
        const initialAnswers = {};
        res.data.questions.forEach((q) => {
            initialAnswers[q.id] = {
                exam_question_id: q.id,
                selected_answer: "",
                essay_answer: ""
            };
        });
        setAnswers(initialAnswers);
        message.success("Bắt đầu làm bài. Chúc bạn thi tốt!");
    };

    const handleStart = async () => {
        if (!exam) return;
        try {
            await syncCompletedLessonsBeforeStart();
            await startExamSession();
        } catch (error) {
            const errorMessage = getStartErrorMessage(error);
            const mightBeLocked =
                isCourseCompletedForExam &&
                /khóa|khoa|lock|complete|hoàn thành|hoan thanh/i.test(
                    errorMessage
                );

            if (mightBeLocked) {
                try {
                    await syncCompletedLessonsBeforeStart();
                    await startExamSession();
                    return;
                } catch (retryError) {
                    message.error(getStartErrorMessage(retryError));
                    return;
                }
            }

            message.error(errorMessage);
        }
    };

    const handleAnswerChange = (questionId, value, type) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: {
                ...prev[questionId],
                selected_answer: type === "multiple_choice" ? value : prev[questionId].selected_answer,
                essay_answer: type === "essay" ? value : prev[questionId].essay_answer
            }
        }));
    };

    const handleAutoSubmitTimeout = async () => {
        message.warning("Hết thời gian làm bài! Đang tự động nộp bài...");
        await submitAnswers(true, false);
    };

    const handleAutoSubmitCheating = async (logs) => {
        await submitAnswers(false, true, logs);
    };

    const submitAnswers = async (isTimeout = false, isCheating = false, customLogs = null) => {
        if (!activeSubmission?.id) {
            message.error("Không tìm thấy phiên làm bài. Vui lòng bấm thi lại để bắt đầu phiên mới.");
            return;
        }

        if (isSubmitting || examFinished) return;

        const payloadAnswers = Object.values(answers).map((ans) => ({
            exam_question_id: ans.exam_question_id,
            selected_answer: ans.selected_answer || null,
            essay_answer: ans.essay_answer || null
        }));

        if (payloadAnswers.length === 0) {
            message.error("Không có câu trả lời để nộp. Vui lòng tải lại đề thi và thử lại.");
            return;
        }

        try {
            const currentLogs = customLogs || cheatLogs;
            const currentCheatCount = isCheating ? 3 : cheatCount;
            const res = await submitExam({
                submissionId: activeSubmission.id,
                answers: payloadAnswers,
                tab_switch_count: currentCheatCount,
                cheat_logs: currentLogs,
                is_cheating: isCheating
            }).unwrap();

            if (res.success && res.data) {
                setFinishedResult(res.data);
                setExamFinished(true);
                await refetchExam();
                if (timerRef.current) clearInterval(timerRef.current);
                if (isCheating) {
                    message.error("Bài thi bị nộp do vi phạm quy chế.");
                } else {
                    message.success("Nộp bài thi thành công!");
                }
            } else {
                message.error(res.message || "Có lỗi xảy ra khi nộp bài thi");
            }
        } catch (error) {
            message.error(
                error?.data?.message ||
                    error?.message ||
                    "Có lỗi xảy ra khi nộp bài thi"
            );
        }
    };

    const handleSubmitClick = async () => {
        await submitAnswers(false, false);
    };

    // Format remaining time to MM:SS
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    const formatScore = (score) =>
        score !== null && score !== undefined ? Number(score).toFixed(1) : "0.0";

    const isCompletedSubmission = (submission) =>
        submission?.status === "submitted" ||
        submission?.status === "auto_submitted_cheating";

    const renderSubmissionStatus = (submission, options = {}) => {
        const isCheatSubmitted = submission?.status === "auto_submitted_cheating";
        const isWaitingForGrade =
            !isCheatSubmitted &&
            (submission?.score === null ||
                submission?.score === undefined ||
                submission?.essay_graded === false);
        const score = Number(submission?.score || 0);
        const passingScore = Number(
            submission?.passing_score || exam?.passing_score || 0
        );
        const isPassed =
            !isWaitingForGrade && !isCheatSubmitted && score >= passingScore;

        const title = isCheatSubmitted
            ? "BÀI THI BỊ KHÓA"
            : isWaitingForGrade
            ? "ĐANG CHỜ CHẤM"
            : isPassed
            ? "CHÚC MỪNG BẠN ĐÃ ĐẠT!"
            : "CHƯA ĐẠT KẾT QUẢ MONG MUỐN";

        const icon = isCheatSubmitted ? (
            <CloseCircleOutlined style={{ fontSize: 60, color: "#ff4d4f", marginBottom: 20 }} />
        ) : isWaitingForGrade ? (
            <EditOutlined style={{ fontSize: 60, color: "#1890ff", marginBottom: 20 }} />
        ) : isPassed ? (
            <CheckCircleOutlined style={{ fontSize: 60, color: "#52c41a", marginBottom: 20 }} />
        ) : (
            <CloseCircleOutlined style={{ fontSize: 60, color: "#ff4d4f", marginBottom: 20 }} />
        );

        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#0c0d14", color: "#fff", padding: "40px 20px" }}>
                <Card style={{ maxWidth: 650, width: "100%", background: "#181a26", border: "1px solid #2d303f", borderRadius: 12, textAlign: "center" }}>
                    {icon}
                    <Title level={2} style={{ color: "#fff" }}>{title}</Title>
                    <Text style={{ color: "#f05123", fontSize: 16, fontWeight: "bold" }}>
                        {course?.title}
                    </Text>

                    <div style={{ background: "#202336", padding: 24, borderRadius: 8, margin: "28px 0" }}>
                        {isCheatSubmitted ? (
                            <Alert
                                message="Bài thi bị nộp do vi phạm quy chế"
                                description="Bạn đã chuyển tab hoặc rời cửa sổ làm bài quá số lần cho phép. Hãy học lại kỹ hơn và thi lại khi đã sẵn sàng."
                                type="error"
                                showIcon
                            />
                        ) : isWaitingForGrade ? (
                            <div>
                                <Paragraph style={{ color: "#fff", fontSize: 17, fontWeight: "bold" }}>
                                    Bài thi của bạn đã được nộp và đang chờ giáo viên chấm điểm.
                                </Paragraph>
                                <Paragraph style={{ color: "#a5a6c4", marginBottom: 20 }}>
                                    Khi giáo viên chấm xong, hệ thống sẽ hiển thị điểm số và kết quả đạt hoặc chưa đạt.
                                </Paragraph>
                                <Progress type="dashboard" percent={100} status="active" strokeColor="#1890ff" />
                                <div style={{ marginTop: 16 }}>
                                    <Tag color="processing">Trạng thái: Đang chờ chấm</Tag>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <Text style={{ color: "#a5a6c4" }}>Điểm số đạt được:</Text>
                                <div style={{ fontSize: 48, fontWeight: "bold", color: isPassed ? "#52c41a" : "#ff4d4f", margin: "10px 0" }}>
                                    {formatScore(score)} / 10.0
                                </div>
                                <Progress
                                    type="circle"
                                    percent={Math.min(score * 10, 100)}
                                    strokeColor={isPassed ? "#52c41a" : "#ff4d4f"}
                                    format={() => (isPassed ? "Đạt" : "Trượt")}
                                />
                                <div style={{ marginTop: 18 }}>
                                    <Text style={{ color: "#a5a6c4" }}>Ngưỡng đạt: {passingScore} điểm</Text>
                                </div>
                                <Paragraph style={{ color: isPassed ? "#52c41a" : "#ffccc7", fontSize: 16, marginTop: 18, marginBottom: 0 }}>
                                    {isPassed
                                        ? "Chúc mừng bạn đã hoàn thành bài kiểm tra. Hãy tiếp tục khám phá khóa học khác."
                                        : "Bạn nên học lại để chắc kiến thức hơn trước khi thi lại."}
                                </Paragraph>
                            </div>
                        )}
                    </div>

                    <Space size="middle" wrap>
                        {isPassed ? (
                            <Button
                                type="primary"
                                size="large"
                                style={{ background: "#30d158", borderColor: "#30d158" }}
                                onClick={() => navigate("/learning-paths")}
                            >
                                Học khóa khác
                            </Button>
                        ) : (
                            <Button
                                type="primary"
                                size="large"
                                style={{ background: "#f05123", borderColor: "#f05123" }}
                                onClick={() => navigate(`/learning/${slug}`)}
                            >
                                Học lại
                            </Button>
                        )}
                        <Button
                            size="large"
                            loading={isStarting || isSyncingProgress}
                            style={{ background: "transparent", color: "#fff", borderColor: "#2d303f" }}
                            onClick={handleStart}
                        >
                            Thi lại
                        </Button>
                        {!options.hideBackButton && (
                            <Button
                                size="large"
                                style={{ background: "transparent", color: "#fff", borderColor: "#2d303f" }}
                                onClick={() => navigate(`/learning/${slug}`)}
                            >
                                Quay lại khóa học
                            </Button>
                        )}
                    </Space>
                </Card>
            </div>
        );
    };

    if (
        isCourseLoading ||
        isExamLoading ||
        isProgressLoading ||
        isUserLessonsLoading
    ) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#0c0d14", color: "#fff" }}>
                <div style={{ textAlign: "center" }}>
                    <Progress type="circle" percent={50} status="active" strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }} showInfo={false} />
                    <div style={{ marginTop: 16 }}>Đang tải đề thi...</div>
                </div>
            </div>
        );
    }

    if (!exam) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#0c0d14", color: "#fff", padding: 24 }}>
                <Card style={{ maxWidth: 500, width: "100%", background: "#181a26", borderColor: "#2d303f", color: "#fff", textAlign: "center" }}>
                    <CloseCircleOutlined style={{ fontSize: 50, color: "#ff4d4f" }} />
                    <Title level={3} style={{ color: "#fff", marginTop: 16 }}>Không có bài thi</Title>
                    <Paragraph style={{ color: "#a5a6c4" }}>Khóa học này chưa được cấu hình đề thi cuối khóa học.</Paragraph>
                    <Button type="primary" onClick={() => navigate(`/learning/${slug}`)}>Quay lại khóa học</Button>
                </Card>
            </div>
        );
    }

    const latestSubmission = exam.latestSubmission;

    if (
        !examStarted &&
        !examFinished &&
        isCompletedSubmission(latestSubmission)
    ) {
        return renderSubmissionStatus(latestSubmission);
    }

    // 1. Introduction screen
    if (!examStarted) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#0c0d14", color: "#fff", padding: "40px 20px" }}>
                <Card style={{ maxWidth: 650, width: "100%", background: "#181a26", border: "1px solid #2d303f", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                    <div style={{ textAlign: "center", marginBottom: 30 }}>
                        <ThunderboltOutlined style={{ fontSize: 40, color: "#f5222d", marginBottom: 12 }} />
                        <Title level={2} style={{ color: "#fff", margin: 0 }}>BÀI KIỂM TRA CUỐI KHÓA</Title>
                        <Text style={{ color: "#f05123", fontSize: 16, fontWeight: "bold" }}>{course?.title}</Text>
                    </div>

                    <Alert
                        message="QUY CHẾ THI CHỐNG GIAN LẬN"
                        description={
                            <ul style={{ paddingLeft: 20, margin: 0 }}>
                                <li>Hệ thống giám sát việc chuyển tab và mất focus cửa sổ.</li>
                                <li>Nếu vi phạm quá <strong>3 lần</strong>, bài thi sẽ bị khóa và tự động nộp ngay lập tức.</li>
                                <li>Thời gian thi bắt đầu đếm ngược ngay khi bạn nhấn "Bắt đầu làm bài".</li>
                            </ul>
                        }
                        type="warning"
                        showIcon
                        style={{ marginBottom: 24, borderRadius: 8, background: "rgba(255, 197, 61, 0.1)", borderColor: "#d4b106" }}
                    />

                    <div style={{ background: "#202336", padding: 20, borderRadius: 8, marginBottom: 30 }}>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Text style={{ color: "#a5a6c4" }}>Bài thi:</Text>
                                <Paragraph style={{ color: "#fff", fontSize: 16, fontWeight: "bold", margin: 0 }}>{exam.title}</Paragraph>
                            </Col>
                            <Col span={12}>
                                <Text style={{ color: "#a5a6c4" }}>Thời gian làm bài:</Text>
                                <Paragraph style={{ color: "#fff", fontSize: 16, fontWeight: "bold", margin: 0 }}>{exam.duration} phút</Paragraph>
                            </Col>
                            <Col span={12}>
                                <Text style={{ color: "#a5a6c4" }}>Cấu trúc câu hỏi:</Text>
                                <Paragraph style={{ color: "#fff", fontSize: 16, fontWeight: "bold", margin: 0 }}>
                                    {exam.mcCount} trắc nghiệm | {exam.essayCount} tự luận
                                </Paragraph>
                            </Col>
                            <Col span={12}>
                                <Text style={{ color: "#a5a6c4" }}>Điểm tối thiểu để đạt:</Text>
                                <Paragraph style={{ color: "#fff", fontSize: 16, fontWeight: "bold", margin: 0 }}>{exam.passing_score} / 10.0</Paragraph>
                            </Col>
                        </Row>
                    </div>

                    <Paragraph style={{ color: "#a5a6c4", fontSize: 14, textAlign: "center", marginBottom: 24 }}>
                        {exam.description || "Hãy đọc kỹ đề bài và hoàn thành các câu hỏi trắc nghiệm và câu hỏi tự luận để hoàn tất khóa học này."}
                    </Paragraph>

                    {isExamLocked ? (
                        <Alert
                            message="Bài thi đang bị khóa"
                            description="Bạn cần học và hoàn thành tất cả các bài học trước để tham gia bài thi cuối khóa."
                            type="error"
                            showIcon
                            style={{ marginBottom: 24 }}
                            action={
                                <Button size="small" type="primary" onClick={() => navigate(`/learning/${slug}`)}>Học tiếp</Button>
                            }
                        />
                    ) : (
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                            <Button
                                size="large"
                                icon={<ArrowLeftOutlined />}
                                style={{ background: "transparent", color: "#fff", borderColor: "#2d303f" }}
                                onClick={() => navigate(`/learning/${slug}`)}
                            >
                                Quay lại khóa học
                            </Button>
                            <Button
                                type="primary"
                                size="large"
                                loading={isStarting || isSyncingProgress}
                                style={{ background: "#f05123", borderColor: "#f05123", flex: 1 }}
                                onClick={handleStart}
                            >
                                Bắt đầu làm bài
                            </Button>
                        </div>
                    )}
                </Card>
            </div>
        );
    }

    // 2. Post-exam results screen
    if (examFinished) {
        return renderSubmissionStatus(finishedResult);
    }

    // 3. Exam Workspace view
    return (
        <div style={{ minHeight: "100vh", background: "#0c0d14", color: "#fff", display: "flex", flexDirection: "column" }}>
            {/* Header bar */}
            <div style={{
                background: "#181a26",
                borderBottom: "1px solid #2d303f",
                padding: "16px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "sticky",
                top: 0,
                zIndex: 100
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <FileTextOutlined style={{ fontSize: 24, color: "#f05123" }} />
                    <div>
                        <div style={{ fontSize: 16, fontWeight: "bold" }}>{exam.title}</div>
                        <div style={{ fontSize: 12, color: "#a5a6c4" }}>Khóa học: {course?.title}</div>
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                    {/* Cheat counter warning */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,77,79,0.1)", border: "1px solid #ff4d4f", padding: "6px 12px", borderRadius: 6 }}>
                        <WarningOutlined style={{ color: "#ff4d4f" }} />
                        <span style={{ color: "#ff4d4f", fontWeight: "bold" }}>
                            Rời cửa sổ: {cheatCount} / 3 lần
                        </span>
                    </div>

                    {/* Countdown Timer */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(24,144,255,0.1)", border: "1px solid #1890ff", padding: "6px 12px", borderRadius: 6 }}>
                        <ClockCircleOutlined style={{ color: "#1890ff" }} />
                        <span style={{ color: "#1890ff", fontWeight: "bold", fontSize: 16, fontFamily: "monospace" }}>
                            {formatTime(timeRemaining)}
                        </span>
                    </div>

                    <Button type="primary" size="large" style={{ background: "#30d158", borderColor: "#30d158" }} onClick={handleSubmitClick} loading={isSubmitting}>
                        Nộp bài thi
                    </Button>
                </div>
            </div>

            {/* Questions area */}
            <div style={{ flex: 1, padding: "30px 24px", maxWidth: 1000, margin: "0 auto", width: "100%" }}>
                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                    {questions.map((q, idx) => {
                        const isMC = q.question_type === "multiple_choice";
                        const answer = answers[q.id];

                        let parsedOptions = [];
                        if (isMC) {
                            try {
                                parsedOptions = typeof q.options === "string" ? JSON.parse(q.options) : q.options;
                            } catch (e) {
                                parsedOptions = [];
                            }
                        }

                        return (
                            <Card
                                key={q.id}
                                id={`question-${q.id}`}
                                title={
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff" }}>
                                        <span>Câu {idx + 1} <Tag color={isMC ? "blue" : "purple"}>{isMC ? "Trắc nghiệm" : "Tự luận"}</Tag></span>
                                        <span style={{ fontSize: 14, color: "#a5a6c4" }}>Điểm: {q.score}</span>
                                    </div>
                                }
                                style={{ background: "#181a26", borderColor: "#2d303f", borderRadius: 8 }}
                                bodyStyle={{ padding: 24 }}
                            >
                                <Paragraph style={{ fontSize: 16, color: "#fff", marginBottom: 20 }}>
                                    {q.question_text}
                                </Paragraph>

                                {isMC ? (
                                    <Radio.Group
                                        onChange={(e) => handleAnswerChange(q.id, e.target.value, "multiple_choice")}
                                        value={answer?.selected_answer}
                                        style={{ width: "100%" }}
                                    >
                                        <Space direction="vertical" style={{ width: "100%" }}>
                                            {parsedOptions.map((opt, oIdx) => (
                                                <Radio
                                                    key={oIdx}
                                                    value={opt}
                                                    style={{
                                                        color: "#fff",
                                                        background: answer?.selected_answer === opt ? "#202336" : "#0c0d14",
                                                        padding: "12px 16px",
                                                        borderRadius: 6,
                                                        width: "100%",
                                                        border: "1px solid",
                                                        borderColor: answer?.selected_answer === opt ? "#f05123" : "#2d303f",
                                                        transition: "all 0.2s"
                                                    }}
                                                >
                                                    <span style={{ fontSize: 14 }}>{opt}</span>
                                                </Radio>
                                            ))}
                                        </Space>
                                    </Radio.Group>
                                ) : (
                                    <Input.TextArea
                                        rows={6}
                                        placeholder="Nhập câu trả lời tự luận của bạn..."
                                        value={answer?.essay_answer}
                                        onChange={(e) => handleAnswerChange(q.id, e.target.value, "essay")}
                                        style={{
                                            background: "#0c0d14",
                                            color: "#fff",
                                            borderColor: "#2d303f",
                                            borderRadius: 6
                                        }}
                                    />
                                )}
                            </Card>
                        );
                    })}
                </Space>
            </div>
        </div>
    );
}

export default ExamWorkspace;
