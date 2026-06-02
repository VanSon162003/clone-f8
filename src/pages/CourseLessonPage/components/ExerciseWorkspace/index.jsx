import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Editor from "@monaco-editor/react";
import DOMPurify from "dompurify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark, faPlay, faPaperPlane, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useGetExerciseByLessonIdQuery, useSubmitExerciseMutation } from "@/services/coursesService";
import styles from "./ExerciseWorkspace.module.scss";

function ExerciseWorkspace({ lesson, onProgressUpdate, onNext }) {
    const currentUser = useSelector((state) => state.auth.currentUser);

    const [code, setCode] = useState("");
    const [testResults, setTestResults] = useState([]);
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [alertMessage, setAlertMessage] = useState(null);

    // Live coding state
    const [previewCode, setPreviewCode] = useState("");
    const [isAutoRun, setIsAutoRun] = useState(true);
    const [activeTab, setActiveTab] = useState("console"); // "console" | "preview"
    const [previewWidth, setPreviewWidth] = useState("100%"); // "100%" | "768px" | "375px"
    const [consoleLogs, setConsoleLogs] = useState([]);

    const { data: exerciseResponse, isLoading, isError, refetch } = useGetExerciseByLessonIdQuery(
        { lessonId: lesson?.id },
        { skip: !lesson?.id }
    );

    const [submitExercise, { isLoading: isSubmitting }] = useSubmitExerciseMutation();

    useEffect(() => {
        if (exerciseResponse?.data) {
            const submission = exerciseResponse.data.latest_submission;
            const initialCode = exerciseResponse.data.initial_code || "";

            // Restore from localStorage draft if available for this specific account
            const draftKey = `draft_${currentUser?.id || "guest"}_${exerciseResponse.data.id}`;
            const localDraft = localStorage.getItem(draftKey);
            const savedCode = localDraft !== null ? localDraft : (submission?.submitted_code || initialCode);

            setCode(savedCode);
            setPreviewCode(savedCode);
            setSubmissionStatus(submission?.status || null);
            setTestResults(submission?.test_results || []);

            const logs = [];
            (submission?.test_results || []).forEach((r) => {
                if (r.logs && r.logs.length > 0) {
                    logs.push(...r.logs);
                }
                if (r.error) {
                    logs.push(`[LỖI] ${r.error}`);
                }
            });
            setConsoleLogs(logs);

            setActiveTab(
                exerciseResponse.data.language === "html" || exerciseResponse.data.language === "css"
                    ? "preview"
                    : "console"
            );
        } else {
            setCode("");
            setPreviewCode("");
            setSubmissionStatus(null);
            setTestResults([]);
            setConsoleLogs([]);
            setActiveTab("console");
        }
        setAlertMessage(null);
    }, [exerciseResponse, lesson?.id]);

    const runLocalJs = (userCode, testCases = []) => {
        let funcName = null;
        const match = userCode.match(/(?:function|const|let|var)\s+([a-zA-Z0-9_]+)\s*(?:=\s*(?:async\s*)?\([^)]*\)\s*=>|\(|\s*=\s*function)/);
        if (match) {
            funcName = match[1];
        }

        const results = [];
        let allPassed = true;

        const compare = (act, exp) => {
            if (act === undefined || act === null) {
                return String(act) === String(exp);
            }
            const actStr = typeof act === "object" ? JSON.stringify(act) : String(act);
            if (actStr.trim() === String(exp).trim()) {
                return true;
            }
            try {
                const expObj = JSON.parse(exp);
                if (typeof act === "object") {
                    return JSON.stringify(act) === JSON.stringify(expObj);
                }
            } catch (e) {}
            return false;
        };

        if (testCases.length === 0) {
            const logs = [];
            const mockConsole = {
                log: (...args) => logs.push(args.map(x => typeof x === "object" ? JSON.stringify(x) : String(x)).join(" ")),
                error: (...args) => logs.push(args.map(x => typeof x === "object" ? JSON.stringify(x) : String(x)).join(" ")),
                warn: (...args) => logs.push(args.map(x => typeof x === "object" ? JSON.stringify(x) : String(x)).join(" ")),
                info: (...args) => logs.push(args.map(x => typeof x === "object" ? JSON.stringify(x) : String(x)).join(" "))
            };
            try {
                const runner = new Function("console", userCode);
                runner(mockConsole);
                results.push({
                    name: "Chạy thử code",
                    passed: true,
                    logs
                });
            } catch (e) {
                allPassed = false;
                results.push({
                    name: "Chạy thử code",
                    passed: false,
                    error: e.message,
                    logs
                });
            }
            return { allPassed, results };
        }

        for (let i = 0; i < testCases.length; i++) {
            const tc = testCases[i];
            const logs = [];
            const mockConsole = {
                log: (...args) => logs.push(args.map(x => typeof x === "object" ? JSON.stringify(x) : String(x)).join(" ")),
                error: (...args) => logs.push(args.map(x => typeof x === "object" ? JSON.stringify(x) : String(x)).join(" ")),
                warn: (...args) => logs.push(args.map(x => typeof x === "object" ? JSON.stringify(x) : String(x)).join(" ")),
                info: (...args) => logs.push(args.map(x => typeof x === "object" ? JSON.stringify(x) : String(x)).join(" "))
            };

            try {
                let evalExpr = "";
                if (typeof tc.input === "string") {
                    evalExpr = tc.input;
                } else if (Array.isArray(tc.input)) {
                    if (!funcName) {
                        throw new Error("Không thể tự động phát hiện tên hàm để chạy test case.");
                    }
                    evalExpr = `${funcName}(${tc.input.map(x => JSON.stringify(x)).join(", ")})`;
                } else {
                    throw new Error("Đầu vào test case không hợp lệ (phải là chuỗi hoặc mảng).");
                }

                const runner = new Function("console", `
                    ${userCode}
                    try {
                        return ${evalExpr};
                    } catch(err) {
                        throw new Error("Lỗi khi chạy biểu thức ${evalExpr}: " + err.message);
                    }
                `);

                const actualResult = runner(mockConsole);
                const expected = tc.expected_output !== undefined ? tc.expected_output : (tc.output !== undefined ? tc.output : tc.expected);
                const passed = compare(actualResult, expected);

                results.push({
                    name: tc.name || `Chạy ${evalExpr}`,
                    input: typeof tc.input === "string" ? tc.input : JSON.stringify(tc.input),
                    passed,
                    actual: actualResult,
                    expected: expected,
                    logs
                });

                if (!passed) {
                    allPassed = false;
                }
            } catch (e) {
                allPassed = false;
                results.push({
                    name: tc.name || `Test Case ${i + 1}`,
                    passed: false,
                    error: e.message,
                    logs
                });
            }
        }

        return { allPassed, results };
    };

    const validateHtmlCssCode = (userCode, exercise) => {
        const code = (userCode || "").trim();
        const initial = (exercise?.initial_code || "").trim();

        if (!code) {
            return {
                allPassed: false,
                results: [{ name: "Kiểm tra mã nguồn", passed: false, error: "Mã nguồn không được để trống." }]
            };
        }

        if (code === initial) {
            return {
                allPassed: false,
                results: [{ name: "Kiểm tra thay đổi", passed: false, error: "Bạn chưa chỉnh sửa hoặc thêm mã nguồn mới." }]
            };
        }

        const results = [];
        let allPassed = true;

        if (exercise.language === "html") {
            if (exercise.id === 1 || exercise.title.toLowerCase().includes("html cơ bản")) {
                const hasHeader = /<header\b[^>]*>/i.test(code) || /<\/header>/i.test(code);
                const hasMain = /<main\b[^>]*>/i.test(code) || /<\/main>/i.test(code);
                const hasFooter = /<footer\b[^>]*>/i.test(code) || /<\/footer>/i.test(code);

                results.push({
                    name: "Thẻ <header>",
                    passed: hasHeader,
                    expected: "Có sử dụng thẻ <header>",
                    actual: hasHeader ? "Đã sử dụng" : "Chưa sử dụng"
                });
                results.push({
                    name: "Thẻ <main>",
                    passed: hasMain,
                    expected: "Có sử dụng thẻ <main>",
                    actual: hasMain ? "Đã sử dụng" : "Chưa sử dụng"
                });
                results.push({
                    name: "Thẻ <footer>",
                    passed: hasFooter,
                    expected: "Có sử dụng thẻ <footer>",
                    actual: hasFooter ? "Đã sử dụng" : "Chưa sử dụng"
                });

                if (!hasHeader || !hasMain || !hasFooter) {
                    allPassed = false;
                }
            } else {
                results.push({
                    name: "Kiểm tra cú pháp HTML",
                    passed: true,
                    expected: "Mã HTML không trống",
                    actual: "Đã điền mã"
                });
            }
        } else if (exercise.language === "css") {
            if (exercise.id === 2 || exercise.title.toLowerCase().includes("responsive")) {
                const hasMedia = /@media/i.test(code);
                const has768 = /768px/i.test(code);
                const hasDisplayNone = /display\s*:\s*none/i.test(code);

                results.push({
                    name: "Sử dụng Media Query (@media)",
                    passed: hasMedia,
                    expected: "Có sử dụng @media",
                    actual: hasMedia ? "Đã sử dụng" : "Chưa sử dụng"
                });
                results.push({
                    name: "Thiết lập kích thước (768px)",
                    passed: has768,
                    expected: "Có chứa '768px'",
                    actual: has768 ? "Đã sử dụng" : "Chưa sử dụng"
                });
                results.push({
                    name: "Ẩn thanh menu (display: none)",
                    passed: hasDisplayNone,
                    expected: "Có chứa 'display: none'",
                    actual: hasDisplayNone ? "Đã sử dụng" : "Chưa sử dụng"
                });

                if (!hasMedia || !has768 || !hasDisplayNone) {
                    allPassed = false;
                }
            } else {
                results.push({
                    name: "Kiểm tra cú pháp CSS",
                    passed: true,
                    expected: "Mã CSS không trống",
                    actual: "Đã điền mã"
                });
            }
        }

        return { allPassed, results };
    };

    const handleLocalRun = () => {
        setAlertMessage(null);
        if (!exerciseResponse?.data) return;

        if (exerciseResponse.data.language === "javascript") {
            const local = runLocalJs(code, exerciseResponse.data.test_cases || []);
            setTestResults(local.results);

            const logs = [];
            local.results.forEach((r) => {
                if (r.logs && r.logs.length > 0) {
                    logs.push(...r.logs);
                }
                if (r.error) {
                    logs.push(`[LỖI] ${r.error}`);
                }
            });
            setConsoleLogs(logs);
        } else if (exerciseResponse.data.language === "html" || exerciseResponse.data.language === "css") {
            setPreviewCode(code);
            const local = validateHtmlCssCode(code, exerciseResponse.data);
            setTestResults(local.results);
            
            const logs = [];
            local.results.forEach((r) => {
                if (r.error) {
                    logs.push(`[LỖI] ${r.error}`);
                }
            });
            setConsoleLogs(logs);
        } else {
            setPreviewCode(code);
            setTestResults([{ name: "Kiểm tra hiển thị giao diện", passed: true }]);
            setConsoleLogs([]);
        }
    };

    useEffect(() => {
        if (!isAutoRun || !exerciseResponse?.data) return;

        const timer = setTimeout(() => {
            handleLocalRun();
        }, 800);

        return () => clearTimeout(timer);
    }, [code, isAutoRun, exerciseResponse]);

    const getPreviewDoc = () => {
        if (!exerciseResponse?.data) return "";
        if (exerciseResponse.data.language === "html") {
            return previewCode;
        } else if (exerciseResponse.data.language === "css") {
            return `
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8">
                  <style>${previewCode}</style>
                </head>
                <body style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; padding: 20px; background: #1e1e2f; color: #fff; margin: 0;">
                  <div class="preview-container">
                    <h3 style="margin-top: 0; color: #a1a1aa; font-size: 1.4rem;">Giao diện hiển thị Live Preview</h3>
                    <hr style="border: 0; border-top: 1px solid #2e2e3e; margin-bottom: 20px;" />
                    
                    <div class="menu" style="display: flex; gap: 15px; background: #2a2a3a; padding: 12px; border-radius: 6px; margin-bottom: 20px;">
                      <a href="#" style="color: #38bdf8; text-decoration: none; font-weight: 500;">Trang chủ</a>
                      <a href="#" style="color: #ececf1; text-decoration: none; font-weight: 500;">Khóa học</a>
                      <a href="#" style="color: #ececf1; text-decoration: none; font-weight: 500;">Liên hệ</a>
                    </div>

                    <div class="header" style="font-size: 2.2rem; font-weight: bold; margin-bottom: 12px; color: #fff;">
                      Tiêu đề chính (.header)
                    </div>
                    
                    <button class="btn btn-primary" style="padding: 10px 20px; background: #f05123; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 1.4rem;">
                      Nút bấm (.btn / .btn-primary)
                    </button>
                    
                    <div class="card" style="margin-top: 20px; padding: 20px; border: 1px solid #2e2e3e; border-radius: 8px; background: #15151e; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                      <div style="font-weight: 600; font-size: 1.6rem; color: #fff;">Thẻ thông tin (.card)</div>
                      <p style="color: #a1a1aa; font-size: 1.3rem; margin-top: 8px; line-height: 1.5;">Đây là một khối card mẫu để bạn kiểm tra CSS. Viết style cho class .card để thấy sự thay đổi trực tiếp.</p>
                    </div>
                  </div>
                </body>
                </html>
            `;
        }
        return "";
    };

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

                const logs = [];
                (res.data.test_results || []).forEach((r) => {
                    if (r.logs && r.logs.length > 0) {
                        logs.push(...r.logs);
                    }
                    if (r.error) {
                        logs.push(`[LỖI] ${r.error}`);
                    }
                });
                setConsoleLogs(logs);
                
                if (res.data.all_passed) {
                    setAlertMessage({
                        type: "success",
                        text: "Chúc mừng! Bạn đã hoàn thành chính xác toàn bộ bài tập.",
                    });
                    
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
                    {(submissionStatus === "passed" || lesson?.userLesson?.completed) ? (
                        <span className={`${styles.statusIndicator} ${styles.passed}`}>
                            Trạng thái: ĐẠT (PASSED)
                        </span>
                    ) : (
                        <span className={`${styles.statusIndicator} ${styles.failed}`}>
                            Trạng thái: CHƯA ĐẠT (FAILED)
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
                        onChange={(val) => {
                            const newCode = val || "";
                            setCode(newCode);
                            if (exercise?.id) {
                                const draftKey = `draft_${currentUser?.id || "guest"}_${exercise.id}`;
                                localStorage.setItem(draftKey, newCode);
                            }
                        }}
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
                    <div className={styles.consoleHeader}>
                        <div className={styles.tabs}>
                            <button
                                className={`${styles.tabBtn} ${activeTab === "console" ? styles.active : ""}`}
                                onClick={() => setActiveTab("console")}
                            >
                                Kết quả chạy thử
                            </button>
                            {(exercise.language === "html" || exercise.language === "css") && (
                                <button
                                    className={`${styles.tabBtn} ${activeTab === "preview" ? styles.active : ""}`}
                                    onClick={() => setActiveTab("preview")}
                                >
                                    Giao diện hiển thị (Live)
                                </button>
                            )}
                        </div>

                        {activeTab === "preview" && (
                            <div className={styles.previewSizes}>
                                <button
                                    className={`${styles.sizeBtn} ${previewWidth === "100%" ? styles.active : ""}`}
                                    onClick={() => setPreviewWidth("100%")}
                                >
                                    Desktop
                                </button>
                                <button
                                    className={`${styles.sizeBtn} ${previewWidth === "768px" ? styles.active : ""}`}
                                    onClick={() => setPreviewWidth("768px")}
                                >
                                    Tablet (768px)
                                </button>
                                <button
                                    className={`${styles.sizeBtn} ${previewWidth === "375px" ? styles.active : ""}`}
                                    onClick={() => setPreviewWidth("375px")}
                                >
                                    Mobile (375px)
                                </button>
                            </div>
                        )}
                    </div>

                    <div className={styles.tabContent}>
                        {activeTab === "console" ? (
                            testResults.length === 0 ? (
                                <p style={{ color: "#a1a1aa", fontSize: "1.3rem", fontStyle: "italic" }}>
                                    Nhập code và click "Chạy thử" hoặc bật "Tự động chạy" để xem kết quả.
                                </p>
                            ) : (
                                <div className={styles.testCaseList}>
                                    {consoleLogs && consoleLogs.length > 0 && (
                                        <div className={styles.globalConsole}>
                                            <div className={styles.globalConsoleHeader}>
                                                <span>Đầu ra console (console.log):</span>
                                                <button 
                                                    className={styles.clearConsoleBtn}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setConsoleLogs([]);
                                                    }}
                                                >
                                                    Xóa sạch
                                                </button>
                                            </div>
                                            <pre className={styles.consoleOutput}>{consoleLogs.join("\n")}</pre>
                                        </div>
                                    )}
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
                            )
                        ) : (
                            <div className={styles.previewContainer} style={{ width: previewWidth }}>
                                <iframe
                                    title="Live Preview"
                                    srcDoc={getPreviewDoc()}
                                    className={styles.previewIframe}
                                />
                            </div>
                        )}
                    </div>

                    {alertMessage && (
                        <div style={{ padding: "0 20px 20px" }}>
                            <div className={`${styles.alertBox} ${styles[alertMessage.type]}`}>
                                {alertMessage.text}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className={styles.actionFooter}>
                    <label className={styles.autoRunLabel}>
                        <input
                            type="checkbox"
                            checked={isAutoRun}
                            onChange={(e) => setIsAutoRun(e.target.checked)}
                        />
                        <span>Tự động chạy (Live Code)</span>
                    </label>

                    <button
                        className={`${styles.btn} ${styles.btnRun}`}
                        onClick={handleLocalRun}
                    >
                        <FontAwesomeIcon icon={faPlay} />
                        Chạy thử
                    </button>

                    <button
                        className={`${styles.btn} ${styles.btnSubmit}`}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        <FontAwesomeIcon icon={faPaperPlane} />
                        {isSubmitting ? "Đang nộp..." : "Nộp bài"}
                    </button>

                </div>
            </div>
        </div>
    );
}

export default ExerciseWorkspace;
