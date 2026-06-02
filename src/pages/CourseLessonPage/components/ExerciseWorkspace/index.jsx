import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import DOMPurify from "dompurify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark, faPlay, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useGetExerciseByLessonIdQuery, useSubmitExerciseMutation } from "@/services/coursesService";
import styles from "./ExerciseWorkspace.module.scss";

function ExerciseWorkspace({ lesson, onProgressUpdate }) {
    const [code, setCode] = useState("");
    const [testResults, setTestResults] = useState([]);
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [alertMessage, setAlertMessage] = useState(null);

    const { data: exerciseResponse, isLoading, isError, refetch } = useGetExerciseByLessonIdQuery(
        { lessonId: lesson?.id },
        { skip: !lesson?.id }
    );

    const [submitExercise, { isLoading: isSubmitting }] = useSubmitExerciseMutation();

    useEffect(() => {
        if (exerciseResponse?.data) {
            setCode(exerciseResponse.data.initial_code || "");
        } else {
            setCode("");
        }
        setTestResults([]);
        setSubmissionStatus(null);
        setAlertMessage(null);
    }, [exerciseResponse, lesson?.id]);

    if (isLoading) {
        return (
            <div className={styles.loaderContainer}>
                <div className={styles.spinner}></div>
                <p>Đang tải thông tin bài tập...</p>
            </div>
        );
    }

    if (isError || !exerciseResponse?.success) {
        return (
            <div className={styles.loaderContainer}>
                <p style={{ color: "#ef4444" }}>
                    Không thể tải thông tin bài tập hoặc bài tập chưa được cấu hình.
                </p>
            </div>
        );
    }

    const exercise = exerciseResponse.data;

    const handleSubmit = async () => {
        if (!code.trim()) {
            setAlertMessage({ type: "error", text: "Vui lòng nhập code trước khi nộp bài." });
            return;
        }

        try {
            setAlertMessage(null);
            const res = await submitExercise({
                exerciseId: exercise.id,
                submittedCode: code,
            }).unwrap();

            if (res.success) {
                setTestResults(res.data.test_results || []);
                setSubmissionStatus(res.data.status);
                
                if (res.data.all_passed) {
                    setAlertMessage({
                        type: "success",
                        text: "Chúc mừng! Bạn đã hoàn thành chính xác toàn bộ bài tập.",
                    });
                    
                    // Trigger progress reload in parent CourseLessonPage
                    if (onProgressUpdate) {
                        onProgressUpdate();
                    }
                } else {
                    setAlertMessage({
                        type: "error",
                        text: "Một số test case không vượt qua. Vui lòng kiểm tra lại code của bạn.",
                    });
                }
            } else {
                setAlertMessage({
                    type: "error",
                    text: res.message || "Đã xảy ra lỗi khi nộp bài.",
                });
            }
        } catch (err) {
            setAlertMessage({
                type: "error",
                text: err?.data?.message || "Lỗi kết nối khi gửi bài tập.",
            });
        }
    };

    return (
        <div className={styles.workspace}>
            {/* Left Panel: Description */}
            <div className={styles.leftPanel}>
                <h2 className={styles.title}>{exercise.title || lesson.title}</h2>
                <div
                    className={styles.problemStatement}
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(exercise.problem_statement),
                    }}
                />
            </div>

            {/* Right Panel: Code Editor and Console */}
            <div className={styles.rightPanel}>
                {/* Editor Header */}
                <div className={styles.editorHeader}>
                    <span className={styles.langBadge}>{exercise.language}</span>
                    {submissionStatus && (
                        <span className={`${styles.statusIndicator} ${styles[submissionStatus]}`}>
                            Trạng thái: {submissionStatus === "passed" ? "ĐẠT (PASSED)" : "CHƯA ĐẠT (FAILED)"}
                        </span>
                    )}
                </div>

                {/* Editor Container */}
                <div className={styles.editorWrapper}>
                    <Editor
                        height="100%"
                        language={exercise.language === "javascript" ? "javascript" : exercise.language}
                        theme="vs-dark"
                        value={code}
                        onChange={(val) => setCode(val || "")}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            automaticLayout: true,
                            tabSize: 4,
                            wordWrap: "on",
                            scrollbar: {
                                vertical: "auto",
                                horizontal: "auto",
                            },
                        }}
                    />
                </div>

                {/* Console / Test results output */}
                <div className={styles.consolePanel}>
                    <h3 className={styles.consoleTitle}>Kết quả chạy thử</h3>

                    {testResults.length === 0 ? (
                        <p style={{ color: "#a1a1aa", fontSize: "1.3rem", fontStyle: "italic" }}>
                            Nộp bài để kiểm tra các test cases.
                        </p>
                    ) : (
                        <div className={styles.testCaseList}>
                            {testResults.map((tr, index) => (
                                <div
                                    key={index}
                                    className={`${styles.testCaseItem} ${
                                        tr.passed ? styles.passed : styles.failed
                                    }`}
                                >
                                    <div className={styles.caseHeader}>
                                        <span className={styles.caseName}>
                                            {tr.name || `Test Case ${index + 1}`}
                                        </span>
                                        <span
                                            className={`${styles.caseStatus} ${
                                                tr.passed ? styles.passed : styles.failed
                                            }`}
                                        >
                                            {tr.passed ? "Thành công" : "Thất bại"}
                                        </span>
                                    </div>

                                    {!tr.error && tr.hasOwnProperty("actual") && (
                                        <div className={styles.caseDetails}>
                                            <span>
                                                <strong>Đầu vào:</strong> {tr.input || "Mặc định"}
                                            </span>
                                            <span>
                                                <strong>Mong muốn:</strong>{" "}
                                                <code>{String(tr.expected)}</code>
                                            </span>
                                            <span>
                                                <strong>Thực tế:</strong>{" "}
                                                <code style={{ color: tr.passed ? "#4ade80" : "#fca5a5" }}>
                                                    {String(tr.actual)}
                                                </code>
                                            </span>
                                        </div>
                                    )}

                                    {tr.error && (
                                        <div className={styles.caseDetails} style={{ color: "#fca5a5" }}>
                                            <strong>Lỗi chương trình:</strong> {tr.error}
                                        </div>
                                    )}

                                    {tr.logs && tr.logs.length > 0 && (
                                        <div className={styles.caseLogs}>
                                            <div className={styles.logTitle}>Đầu ra (Console):</div>
                                            <pre>{tr.logs.join("\n")}</pre>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {alertMessage && (
                        <div className={`${styles.alertBox} ${styles[alertMessage.type]}`}>
                            {alertMessage.text}
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className={styles.actionFooter}>
                    <button
                        className={`${styles.btn} ${styles.btnSubmit}`}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        <FontAwesomeIcon icon={faPaperPlane} />
                        {isSubmitting ? "Đang nộp..." : "Kiểm tra & Nộp bài"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ExerciseWorkspace;
