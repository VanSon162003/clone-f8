import { useState, useEffect, useRef } from "react";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import styles from "./Editor.module.scss";

function Editor({
    onCancel,
    onSubmit,
    onEdit,
    type = "addComment",
    content,
    id,
}) {
    const [value, setValue] = useState(() => {
        return content || "";
    });
    const [activeFormats, setActiveFormats] = useState({});
    const [error, setError] = useState("");
    const quillRef = useRef(null);

    /*
    Keyboard shortcuts supported:
    - Bold: Ctrl+B
    - Italic: Ctrl+I  
    - Blockquote: Ctrl+Shift+Q
    - Code Block: Ctrl+Shift+C
    - Inline Code: Ctrl+Shift+X
    - Link: Ctrl+K (prompts for URL)
    - Clean Format: Ctrl+Shift+Z
    */

    const modules = {
        toolbar: [
            ["bold", "italic"],
            ["blockquote", "code", "code-block"],
            ["image", "link"],
            ["clean"],
        ],
    };

    const formats = [
        "bold",
        "italic",
        "blockquote",
        "code",
        "code-block",
        "image",
        "link",
    ];

    const isContentEmpty = (content) => {
        if (!content) return true;

        const textOnly = content.replace(/<[^>]*>/g, "").trim();
        return textOnly === "";
    };

    const handleValueChange = (content) => {
        setValue(content);
        if (error && !isContentEmpty(content)) {
            setError("");
        }
    };

    useEffect(() => {
        if (quillRef.current) {
            const quill = quillRef.current.getEditor();

            const handleSelectionChange = (range) => {
                if (range) {
                    const formats = quill.getFormat(range);
                    setActiveFormats(formats);
                    // Cập nhật manually active classes
                    updateToolbarClasses(formats);
                }
            };

            const handleTextChange = (delta, oldDelta, source) => {
                // Chỉ xử lý khi thay đổi từ user, không phải từ API
                if (source === "user") {
                    const selection = quill.getSelection();
                    if (selection) {
                        const formats = quill.getFormat(selection);
                        setActiveFormats(formats);
                        updateToolbarClasses(formats);
                    }
                }
            };

            // Thêm event listener cho toolbar buttons để xử lý click trực tiếp
            const handleToolbarClick = () => {
                setTimeout(() => {
                    const selection = quill.getSelection();
                    if (selection) {
                        const formats = quill.getFormat(selection);
                        setActiveFormats(formats);
                        updateToolbarClasses(formats);
                    }
                }, 10);
            };

            quill.on("selection-change", handleSelectionChange);
            quill.on("text-change", handleTextChange);

            const toolbarButtons =
                document.querySelectorAll(".ql-toolbar button");
            toolbarButtons.forEach((button) => {
                button.addEventListener("click", handleToolbarClick);
            });

            return () => {
                quill.off("selection-change", handleSelectionChange);
                quill.off("text-change", handleTextChange);

                toolbarButtons.forEach((button) => {
                    button.removeEventListener("click", handleToolbarClick);
                });
            };
        }
    }, []);

    const updateToolbarClasses = (formats) => {
        const toolbarButtons = document.querySelectorAll(".ql-toolbar button");

        toolbarButtons.forEach((button) => {
            const className = button.className;

            button.classList.remove("ql-active-custom");

            if (className.includes("ql-bold")) {
                if (formats.bold) {
                    button.classList.add("ql-active-custom");
                }
            }

            if (className.includes("ql-italic")) {
                if (formats.italic) {
                    button.classList.add("ql-active-custom");
                }
            }

            if (className.includes("ql-blockquote")) {
                if (formats.blockquote) {
                    button.classList.add("ql-active-custom");
                }
            }

            if (className.includes("ql-code-block")) {
                if (formats["code-block"]) {
                    button.classList.add("ql-active-custom");
                }
            }

            if (
                className.includes("ql-code") &&
                !className.includes("ql-code-block")
            ) {
                if (formats.code && !formats["code-block"]) {
                    button.classList.add("ql-active-custom");
                }
            }

            if (className.includes("ql-link")) {
                if (formats.link) {
                    button.classList.add("ql-active-custom");
                }
            }
        });
    };

    const handleKeyDown = (e) => {
        // Detect various keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            let shortcutDetected = false;

            // Bold: Ctrl+B
            if (e.key === "b") {
                shortcutDetected = true;
            }

            // Italic: Ctrl+I
            else if (e.key === "i") {
                shortcutDetected = true;
            }

            // Blockquote: Ctrl+Shift+Q
            else if (e.shiftKey && e.key === "Q") {
                e.preventDefault(); // Prevent default browser behavior
                if (quillRef.current) {
                    const quill = quillRef.current.getEditor();
                    const format = quill.getFormat();
                    quill.format("blockquote", !format.blockquote);
                }
                shortcutDetected = true;
            }

            // Code Block: Ctrl+Shift+C
            else if (e.shiftKey && e.key === "C") {
                e.preventDefault();
                if (quillRef.current) {
                    const quill = quillRef.current.getEditor();
                    const format = quill.getFormat();
                    quill.format("code-block", !format["code-block"]);
                }
                shortcutDetected = true;
            }

            // Inline Code: Ctrl+Shift+X
            else if (e.shiftKey && e.key === "X") {
                e.preventDefault();
                if (quillRef.current) {
                    const quill = quillRef.current.getEditor();
                    const format = quill.getFormat();
                    // Only toggle inline code if not in code block
                    if (!format["code-block"]) {
                        quill.format("code", !format.code);
                    }
                }
                shortcutDetected = true;
            }

            // Link: Ctrl+K
            else if (e.key === "k") {
                e.preventDefault();
                if (quillRef.current) {
                    const quill = quillRef.current.getEditor();
                    const selection = quill.getSelection();
                    if (selection && selection.length > 0) {
                        const format = quill.getFormat();
                        if (format.link) {
                            // Remove link if already exists
                            quill.format("link", false);
                        } else {
                            // Add link - you might want to show a dialog here
                            const url = prompt("Enter URL:");
                            if (url) {
                                quill.format("link", url);
                            }
                        }
                    }
                }
                shortcutDetected = true;
            }

            // Clean formatting: Ctrl+Shift+Z
            else if (e.shiftKey && e.key === "Z") {
                e.preventDefault();
                if (quillRef.current) {
                    const quill = quillRef.current.getEditor();
                    const selection = quill.getSelection();
                    if (selection) {
                        // Remove all formatting from selection
                        quill.removeFormat(selection);
                    }
                }
                shortcutDetected = true;
            }

            if (shortcutDetected) {
                setTimeout(() => {
                    if (quillRef.current) {
                        const quill = quillRef.current.getEditor();
                        const selection = quill.getSelection();
                        if (selection) {
                            const formats = quill.getFormat(selection);
                            setActiveFormats(formats);
                            updateToolbarClasses(formats);
                        }
                    }
                }, 10);
            }
        }
    };

    const handleSubmit = () => {
        if (isContentEmpty(value)) {
            setError("Nội dung bình luận không được để trống");
            return;
        }

        setError("");

        if (onSubmit) {
            onSubmit(value, id);
            onCancel();
        }
    };

    const handleEdit = () => {
        if (isContentEmpty(value)) {
            setError("Nội dung bình luận không được để trống");
            return;
        }

        setError("");

        if (onEdit) {
            onEdit(value, id);
            onCancel();
        }
    };

    return (
        <>
            <div className={styles.commentEditor}>
                <ReactQuill
                    ref={quillRef}
                    tabIndex={1}
                    theme="snow"
                    value={value}
                    onChange={handleValueChange}
                    modules={modules}
                    formats={formats}
                    placeholder="Nhập bình luận mới của bạn"
                    onKeyDown={handleKeyDown}
                />

                {/* Error message */}
                {error && <div className={styles.errorMessage}>{error}</div>}

                <div className={styles.buttonsBar}>
                    <button className={styles.btn} onClick={() => onCancel()}>
                        <div className={styles.inner}>
                            <span className={styles.title}>HUỶ</span>
                        </div>
                    </button>
                    {type === "editComment" ? (
                        <button
                            className={`${styles.btn} ${styles.primary}`}
                            onClick={handleEdit}
                        >
                            <div className={styles.inner}>
                                <span className={styles.title}>LƯU LẠI</span>
                            </div>
                        </button>
                    ) : (
                        <button
                            className={`${styles.btn} ${styles.primary}`}
                            onClick={handleSubmit}
                        >
                            <div className={styles.inner}>
                                <span className={styles.title}>BÌNH LUẬN</span>
                            </div>
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}

export default Editor;
