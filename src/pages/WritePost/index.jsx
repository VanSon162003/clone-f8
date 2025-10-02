import { useState, useRef, useEffect } from "react";
import Editor from "@/components/Editor";
import styles from "./WritePost.module.scss";
import ParentCard from "@/components/ParentCard";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Model from "@/components/Model";
import ScrollLock from "@/components/ScrollLock";
import UploadImg from "@/components/UploadImg";
import Button from "@/components/Button";

function WritePost() {
    const [formEdit, setFormEdit] = useState({
        title: "",
        content: "",
        metaTitle: "",
        metaContent: "",
        thumbnail: "",
        tags: ["ok"],
        publish: "now",
    });
    const [openModelEdit, setOpenModelEdit] = useState(false);
    const [errorModel, seErrorModel] = useState(null);

    const titleEditorRef = useRef(null);
    const contentEditorRef = useRef(null);

    const navigate = useNavigate();

    const isContentEmpty = (value) => {
        if (!value) return true;
        return value.replace(/<[^>]*>/g, "").trim() === "";
    };

    const getPlainText = (htmlString = "") => {
        if (!htmlString) return 0;

        return htmlString.replace(/<[^>]*>/g, "").trim() || " ";
    };

    const validateField = (value, type) => {
        if (isContentEmpty(value)) {
            return type === "title"
                ? "Tiêu đề không được để trống"
                : "Nội dung không được để trống";
        }

        const textOnly = value.replace(/<[^>]*>/g, "").trim();

        if (type === "title" && textOnly.length < 3) {
            return "Tiêu đề phải có ít nhất 3 ký tự";
        }

        if (type === "content" && textOnly.length < 10) {
            return "Nội dung phải có ít nhất 10 ký tự";
        }

        return null;
    };

    const validateAll = () => {
        const titleError = validateField(formEdit.title, "title");
        const contentError = validateField(formEdit.content, "content");

        if (titleError) {
            toast.error(titleError);
            titleEditorRef?.current?.showError(titleError);
            return false;
        }

        if (contentError) {
            toast.error(contentError);
            contentEditorRef?.current?.showError(contentError);
            return false;
        }

        return true;
    };

    const handlePublish = () => {
        if (!validateAll()) {
            return;
        }

        setOpenModelEdit(true);
    };

    const handleSaveDraft = () => {
        if (!validateAll()) {
            return;
        }

        // fetch api ở đây

        toast.success("Lưu bản nháp thành công!");

        setTimeout(() => {
            navigate("/");
        }, 3000);
    };

    const handleChangeModelEdit = (type, value) => {
        let plainText = getPlainText(value);

        if (type === "metaTitle") {
            if (plainText.length > 100) {
                plainText = plainText.slice(0, 100);
            }
            setFormEdit((prev) => ({
                ...prev,
                metaTitle: plainText,
            }));
            return;
        }

        if (type === "metaContent") {
            if (plainText.length > 160) {
                plainText = plainText.slice(0, 160);
            }
            setFormEdit((prev) => ({
                ...prev,
                metaContent: plainText,
            }));
            return;
        }

        setFormEdit((prev) => ({
            ...prev,
            [type]: value,
        }));
    };

    const handleAddTags = (e) => {
        e.preventDefault();

        const newTag = e.target.querySelector("input").value.trim();

        const exitTag = formEdit.tags.find((tag) => tag === newTag);

        if (exitTag) return seErrorModel("Bạn đã thêm thẻ này");
        if (formEdit.tags.length >= 5) return;

        setFormEdit((prev) => {
            return {
                ...prev,
                tags: [...prev.tags, newTag],
            };
        });

        e.target.querySelector("input").value = "";
    };

    const handleRemoveTag = (removeTag) => {
        setFormEdit((prev) => {
            const newTags = prev.tags.filter((tag) => tag !== removeTag);
            return {
                ...prev,
                tags: newTags,
            };
        });
    };

    const getDateAndTime = () => {
        const now = new Date();

        const today = now.toISOString().split("T")[0];

        const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
        const hours = String(nextHour.getHours()).padStart(2, "0");
        const minutes = String(nextHour.getMinutes()).padStart(2, "0");
        const time = `${hours}:${minutes}`;

        return {
            today,
            time,
        };
    };

    return (
        <>
            <ParentCard>
                <div className={styles.form}>
                    <div className={styles.field}>
                        <label className={styles.label}>Tiêu đề (*)</label>
                        <Editor
                            ref={titleEditorRef}
                            type="writePost"
                            content={formEdit.title}
                            onContentChange={(value) =>
                                setFormEdit((prev) => ({
                                    ...prev,
                                    title: value,
                                    metaTitle: value,
                                }))
                            }
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Nội dung (*)</label>
                        <Editor
                            ref={contentEditorRef}
                            type="writePostContent"
                            content={formEdit.content}
                            onContentChange={(value) =>
                                setFormEdit((prev) => ({
                                    ...prev,
                                    content: value,
                                    metaContent: value,
                                }))
                            }
                            onPublish={handlePublish}
                            onSaveDraft={handleSaveDraft}
                        />
                    </div>
                </div>
            </ParentCard>
            {openModelEdit && <ScrollLock />}
            {openModelEdit && (
                <Model>
                    <div className={styles.model}>
                        <h3 className={styles.title}>Xuất bản bài viết</h3>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Ảnh đại diện</label>
                            <div className={styles.wrap}>
                                <UploadImg />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Tiêu đề hiển thị (
                                {getPlainText(formEdit?.metaTitle)?.length || 0}
                                /100)
                            </label>
                            <div className={styles.wrap}>
                                <div className={styles.inner}>
                                    <input
                                        type="text"
                                        value={
                                            getPlainText(formEdit.metaTitle) ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            handleChangeModelEdit(
                                                "metaTitle",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Tiêu đề khi bài viết được hiển thị"
                                        className={styles.inputText}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Mô tả hiển thị (
                                {getPlainText(formEdit?.metaContent)?.length ||
                                    0}
                                /160)
                            </label>
                            <div className={styles.wrap}>
                                <div className={styles.inner}>
                                    <textarea
                                        placeholder="Mô tả khi bài viết được hiển thị"
                                        className={styles.inputText}
                                        value={
                                            getPlainText(
                                                formEdit.metaContent
                                            ) || ""
                                        }
                                        onChange={(e) =>
                                            handleChangeModelEdit(
                                                "metaContent",
                                                e.target.value
                                            )
                                        }
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Thêm tối đa 5 thẻ để độc giả biết bài viết của
                                bạn nói về điều gì. (*)
                            </label>
                            <div className={styles.wrap}>
                                <div
                                    className={`${styles.inner} ${
                                        errorModel && styles.error
                                    }`}
                                >
                                    <form onSubmit={handleAddTags}>
                                        <input
                                            type="text"
                                            onChange={() => seErrorModel(null)}
                                            placeholder="Ví dụ: Front-end, ReactJS, UI, UX"
                                            className={styles.inputText}
                                        />
                                    </form>
                                </div>
                                <div className={styles.error}>{errorModel}</div>
                            </div>

                            <div className={styles.tagLists}>
                                {formEdit.tags.map((tag, i) => {
                                    return (
                                        <div key={i} className={styles.tag}>
                                            {tag}
                                            <Button
                                                className={styles.removeTag}
                                                onClick={() =>
                                                    handleRemoveTag(tag)
                                                }
                                            >
                                                x
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.checkBoxLabel}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                />
                                <span>
                                    Đề xuất bài viết của bạn đến các độc giả
                                    quan tâm tới nội dung này.
                                </span>
                            </label>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Thời gian xuất bản
                            </label>

                            <div className={styles.publishOptions}>
                                <label className={styles.radioOption}>
                                    <input
                                        type="radio"
                                        name="publishType"
                                        value="now"
                                        checked={
                                            formEdit.publish === "now" && true
                                        }
                                        onChange={() => {
                                            setFormEdit((prev) => {
                                                return {
                                                    ...prev,
                                                    publish: "now",
                                                };
                                            });
                                        }}
                                    />
                                    <span>Xuất bản ngay</span>
                                </label>

                                <label className={styles.radioOption}>
                                    <input
                                        type="radio"
                                        name="publishType"
                                        value="schedule"
                                        onChange={() => {
                                            setFormEdit((prev) => {
                                                return {
                                                    ...prev,
                                                    publish: "schedule",
                                                };
                                            });
                                        }}
                                        checked={
                                            formEdit.publish === "schedule" &&
                                            true
                                        }
                                    />
                                    <span>Lên lịch xuất bản</span>
                                </label>
                            </div>

                            {formEdit.publish === "schedule" && (
                                <div className={styles.scheduleInputs}>
                                    <div className={styles.dateTimeRow}>
                                        <div className={styles.dateInput}>
                                            <label className={styles.subLabel}>
                                                Ngày
                                            </label>
                                            <input
                                                type="date"
                                                min="2025-10-01"
                                                className={styles.input}
                                                defaultValue={
                                                    getDateAndTime().today
                                                }
                                            />
                                        </div>
                                        <div className={styles.timeInput}>
                                            <label className={styles.subLabel}>
                                                Giờ
                                            </label>
                                            <input
                                                type="time"
                                                className={styles.input}
                                                defaultValue={
                                                    getDateAndTime().time
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={styles.note}>
                            <strong>Lưu ý: </strong>
                            Chỉnh sửa tại đây không ảnh hưởng đến nội dung bài
                            viết, chỉ thay đổi cách hiển thị bài viết trên các
                            công cụ tìm kiếm như Google.
                        </div>

                        <div className={styles.actions}>
                            <Button className={`${styles.wrap}`}>
                                <div className={styles.inner}>
                                    <div className={styles.title}>HUỶ</div>
                                </div>
                            </Button>
                            <Button
                                className={`${styles.wrap} ${styles.primary}`}
                            >
                                <div className={styles.inner}>
                                    <div className={styles.title}>
                                        {" "}
                                        {formEdit.publish === "now"
                                            ? "XUẤT BẢN NGAY"
                                            : "LÊN LỊCH XUẤT BẢN"}
                                    </div>
                                </div>
                            </Button>
                        </div>
                    </div>
                </Model>
            )}
        </>
    );
}

export default WritePost;
