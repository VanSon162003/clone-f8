import {
    useState,
    useEffect,
    useRef,
    forwardRef,
    useImperativeHandle,
} from "react";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import styles from "./Editor.module.scss";
import { toast } from "react-toastify";

const Editor = forwardRef(
    (
        {
            onCancel,
            onSubmit,
            onEdit,
            onContentChange,
            onPublish,
            onSaveDraft,
            type = "addComment",
            content = "",
            id,
        },
        ref
    ) => {
        const [value, setValue] = useState(content);
        const [error, setError] = useState("");
        const [activeFormats, setActiveFormats] = useState({});
        const quillRef = useRef(null);
        const editorRef = useRef(null);

        useEffect(() => {
            setValue(content);
        }, [content]);

        // Expose focus method to parent
        useImperativeHandle(ref, () => ({
            focus: () => {
                if (quillRef.current) {
                    const quill = quillRef.current.getEditor();
                    quill.focus();
                }
            },
        }));

        // ----------------- CONFIG -----------------
        const imageHandler = () => {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.click();

            input.onchange = async () => {
                const file = input.files[0];

                if (!file) return;

                try {
                    const fd = new FormData();
                    fd.append("file", file);

                    const res = await fetch(
                        `${import.meta.env.VITE_BASE_URL}uploads/imgs`,
                        {
                            method: "POST",
                            body: fd,
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem(
                                    "accessToken"
                                )}`,
                            },
                        }
                    );

                    if (!res.ok) throw new Error("Upload failed");

                    const data = await res.json();
                    const url = data.url || data.path || data.filePath;

                    const quill = quillRef.current.getEditor();
                    const range = quill.getSelection(true);
                    quill.insertEmbed(range.index, "image", url);
                    quill.setSelection(range.index + 1);
                } catch (err) {
                    toast.error("Không thể upload ảnh", { autoClose: 3000 });
                }
            };
        };

        const modules = {
            toolbar: {
                container: [
                    ["bold", "italic"],
                    ["blockquote", "code", "code-block"],
                    ["image", "link"],
                    ["clean"],
                ],

                handlers: {
                    image: imageHandler,
                },
            },
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

        const placeholder =
            type === "writePost"
                ? "Nhập tiêu đề bài viết..."
                : type === "writePostContent"
                ? "Nhập nội dung bài viết..."
                : "Nhập bình luận mới của bạn";

        // ----------------- UTILS -----------------
        const isContentEmpty = (content) => {
            if (!content) return true;
            return content.replace(/<[^>]*>/g, "").trim() === "";
        };

        const updateToolbarClasses = (formats) => {
            const toolbarButtons =
                document.querySelectorAll(".ql-toolbar button");
            toolbarButtons.forEach((button) => {
                button.classList.remove("ql-active-custom");
                if (button.className.includes("ql-bold") && formats.bold)
                    button.classList.add("ql-active-custom");
                if (button.className.includes("ql-italic") && formats.italic)
                    button.classList.add("ql-active-custom");
                if (
                    button.className.includes("ql-blockquote") &&
                    formats.blockquote
                )
                    button.classList.add("ql-active-custom");
                if (
                    button.className.includes("ql-code-block") &&
                    formats["code-block"]
                )
                    button.classList.add("ql-active-custom");
                if (
                    button.className.includes("ql-code") &&
                    !button.className.includes("ql-code-block") &&
                    formats.code
                )
                    button.classList.add("ql-active-custom");
                if (button.className.includes("ql-link") && formats.link)
                    button.classList.add("ql-active-custom");
            });
        };

        useEffect(() => {
            if (!editorRef.current) return;

            const toolbar = editorRef.current.querySelector("[role=toolbar]");
            const quillEl = editorRef.current.querySelector(".quill");
            const dataPlaceholder =
                editorRef.current.querySelector("[data-placeholder]");

            if (type === "writePost") {
                if (toolbar) {
                    toolbar.style.display = "none";
                }

                if (quillEl) {
                    quillEl.style.paddingTop = "16px";
                }
            }

            if (type === "writePostContent") {
                dataPlaceholder.style.minHeight = "400px";
            }
        }, [type]);

        useEffect(() => {
            if (!quillRef.current) return;

            const quill = quillRef.current.getEditor();

            const handleSelectionChange = (range) => {
                if (range) {
                    const formats = quill.getFormat(range);
                    setActiveFormats(formats);
                    updateToolbarClasses(formats);
                }
            };

            const handleTextChange = (delta, oldDelta, source) => {
                if (source === "user") {
                    const selection = quill.getSelection();
                    if (selection) {
                        const formats = quill.getFormat(selection);
                        setActiveFormats(formats);
                        updateToolbarClasses(formats);
                    }
                }
            };

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
            toolbarButtons.forEach((btn) =>
                btn.addEventListener("click", handleToolbarClick)
            );

            return () => {
                quill.off("selection-change", handleSelectionChange);
                quill.off("text-change", handleTextChange);
                toolbarButtons.forEach((btn) =>
                    btn.removeEventListener("click", handleToolbarClick)
                );
            };
        }, []);

        // ----------------- HANDLERS -----------------
        const handleValueChange = (content) => {
            const textOnly = content.replace(/<[^>]*>/g, "").trim();

            if (!textOnly) return;

            setValue(content);

            // Gọi callback để parent component nhận được giá trị mới
            if (onContentChange) {
                onContentChange(content);
            }

            const quill = editorRef.current?.querySelector(".quill");
            if (!quill) return;

            if (
                type === "writePost" &&
                textOnly.length > 0 &&
                textOnly.length < 3
            ) {
                setError("Tiêu đề phải có ít nhất 3 ký tự");
                quill.style.border = "1px solid #ffcdd2";
                quill.style.background = "#fff";
            } else if (
                type === "writePostContent" &&
                textOnly.length > 0 &&
                textOnly.length < 10
            ) {
                setError("Nội dung phải có ít nhất 10 ký tự");
                quill.style.border = "1px solid #ffcdd2";
                quill.style.background = "#fff";
            } else if (!isContentEmpty(content)) {
                setError("");
                quill.style.border = "1px solid #3498db";
                quill.style.background = "#eef4fc";
            } else {
                setError("");
                quill.style.border = "1px solid transparent";
                quill.style.background = "#eef4fc";
            }
        };

        const handleBlur = () => {
            const quill = editorRef.current?.querySelector(".quill");
            if (!quill) return;

            quill.style.border = "1px solid transparent";
            quill.style.background = "#eef4fc";

            if (isContentEmpty(value)) {
                const errorMsg =
                    type === "writePost"
                        ? "Vui lòng nhập tiêu đề"
                        : "Vui lòng nhập nội dung";
                setError(errorMsg);
                quill.style.border = "1px solid #ffcdd2";
                quill.style.background = "#fff";
            }
        };

        const handleFocus = () => {
            const quill = editorRef.current?.querySelector(".quill");
            if (!quill) return;

            quill.style.border = "1px solid #3498db";
            setError(""); // Clear error on focus
        };

        const handleSubmit = () => {
            if (isContentEmpty(value)) {
                setError("Nội dung không được để trống");
                return;
            }
            setError("");
            if (onSubmit) {
                onSubmit(value, id);
                onCancel?.();
            }
        };

        const handleEdit = () => {
            if (isContentEmpty(value)) {
                setError("Nội dung không được để trống");
                return;
            }
            setError("");
            if (onEdit) {
                onEdit(value, id);
                onCancel?.();
            }
        };

        // Handlers cho writePostContent - gọi callback từ parent
        const handlePostPublish = () => {
            if (onPublish) {
                onPublish();
            }
        };

        const handleSaveDraft = () => {
            if (onSaveDraft) {
                onSaveDraft();
            }
        };

        // ----------------- RENDER -----------------
        return (
            <div ref={editorRef} className={styles.commentEditor}>
                <ReactQuill
                    ref={quillRef}
                    tabIndex={1}
                    theme="snow"
                    value={value}
                    onChange={handleValueChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    modules={modules}
                    formats={formats}
                    placeholder={placeholder}
                    style={{
                        minHeight:
                            type === "writePostContent" ? "400px" : "auto",
                        paddingTop: type === "writePost" ? "16px" : undefined,
                        backgroundColor: "#eef4fc",
                        border: "1px solid transparent",
                    }}
                />

                {error && <div className={styles.errorMessage}>{error}</div>}

                {/* Buttons */}
                {type !== "writePost" &&
                    (type === "writePostContent" ? (
                        <div className={styles.buttonsBar}>
                            <button
                                onClick={handleSaveDraft}
                                className={styles.btn}
                            >
                                <div className={styles.inner}>
                                    <span className={styles.title}>
                                        LƯU BẢN NHÁP
                                    </span>
                                </div>
                            </button>
                            <button
                                onClick={handlePostPublish}
                                className={`${styles.btn} ${styles.primary}`}
                            >
                                <div className={styles.inner}>
                                    <span className={styles.title}>
                                        XUẤT BẢN
                                    </span>
                                </div>
                            </button>
                        </div>
                    ) : (
                        <div className={styles.buttonsBar}>
                            <button className={styles.btn} onClick={onCancel}>
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
                                        <span className={styles.title}>
                                            LƯU LẠI
                                        </span>
                                    </div>
                                </button>
                            ) : (
                                <button
                                    className={`${styles.btn} ${styles.primary}`}
                                    onClick={handleSubmit}
                                >
                                    <div className={styles.inner}>
                                        <span className={styles.title}>
                                            BÌNH LUẬN
                                        </span>
                                    </div>
                                </button>
                            )}
                        </div>
                    ))}
            </div>
        );
    }
);

Editor.displayName = "Editor";

export default Editor;
