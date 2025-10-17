import { useState, useRef, useEffect } from "react";
import Editor from "@/components/Editor";
import styles from "./WritePost.module.scss";
import ParentCard from "@/components/ParentCard";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import Model from "@/components/Model";
import ScrollLock from "@/components/ScrollLock";
import UploadImg from "@/components/UploadImg";
import Button from "@/components/Button";
import {
    useCreatePostMutation,
    useGetPostByIdQuery,
    useUpdatePostMutation,
} from "@/services/postsService";

function WritePost() {
    const [formEdit, setFormEdit] = useState({
        title: "",
        content: "",
        metaTitle: "",
        metaContent: "",
        thumbnail: "",
        tags: [],
        visibility: "published",
        status: "published",
        published_at: null,
    });
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [createPost] = useCreatePostMutation();
    const [updatePost] = useUpdatePostMutation();

    const [searchParams] = useSearchParams();
    const [openModelEdit, setOpenModelEdit] = useState(false);
    const [errorModel, seErrorModel] = useState(null);

    const titleEditorRef = useRef(null);
    const contentEditorRef = useRef(null);

    const navigate = useNavigate();

    const [post, setPost] = useState(null);

    const id = searchParams.get("id"); // lấy ra id cần edit

    const { data } = useGetPostByIdQuery(id, {
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    });

    useEffect(() => {
        if (id) {
            setPost(data?.data);
        }
    }, [id, data]);

    useEffect(() => {
        if (post) {
            setFormEdit(() => ({
                title: post?.title || "",
                content: post?.content || "",
                metaTitle: post?.meta_title || "",
                metaContent: post?.meta_description || "",
                thumbnail: post?.thumbnail || "",
                tags: post?.tags || [],
                visibility: post?.visibility || "published",
                status: post?.status || "published",
                published_at: post?.published_at || null,
            }));
        }
    }, [post]);

    const isContentEmpty = (value) => {
        if (!value) return true;
        return value.replace(/<[^>]*>/g, "").trim() === "";
    };

    const getPlainText = (htmlString = "") => {
        if (!htmlString) return "";
        return htmlString.replace(/<[^>]*>/g, "");
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

    const handleCancelModel = () => {
        setOpenModelEdit(false);
    };

    const handleChangeModelEdit = (type, value) => {
        if (type === "metaTitle") {
            let newValue = value;
            if (newValue.length > 100) {
                newValue = newValue.slice(0, 100);
            }
            setFormEdit((prev) => ({
                ...prev,
                metaTitle: newValue,
            }));
            return;
        }

        if (type === "metaContent") {
            let newValue = value;
            if (newValue.length > 160) {
                newValue = newValue.slice(0, 160);
            }
            setFormEdit((prev) => ({
                ...prev,
                metaContent: newValue,
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

        const exitTag = formEdit.tags.find((tag) => tag.name === newTag);

        if (exitTag) return seErrorModel("Bạn đã thêm thẻ này");
        if (formEdit.tags.length >= 5) return;

        setFormEdit((prev) => {
            return {
                ...prev,
                tags: [
                    ...prev.tags,
                    {
                        name: newTag,
                    },
                ],
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

    // Xử lý xuất bản hoặc lên lịch xuất bản
    const handlePublishPost = async () => {
        console.log(formEdit);

        const formData = new FormData();
        formData.append("title", formEdit.title);
        formData.append("content", formEdit.content);
        formData.append("metaTitle", formEdit.metaTitle);
        formData.append("metaContent", formEdit.metaContent);

        if (thumbnailFile) formData.append("thumbnail", thumbnailFile);
        if (formEdit.tags.length > 0)
            formData.append("tags", JSON.stringify(formEdit.tags));
        if (formEdit.visibility === "schedule") {
            formData.append("published_at", `${new Date()}`);
            formData.append("status", "schedule");
            formData.append("visibility", "schedule");
        } else {
            formData.append("status", "published");
            formData.append("published_at", null);
            formData.append("visibility", "published");
        }

        try {
            if (id) {
                await updatePost({ id, formData }).unwrap();
            } else {
                await createPost(formData).unwrap();
            }
            toast.success(
                id
                    ? "Cập nhật bài viết thành công!"
                    : "Tạo bài viết thành công!"
            );
            setTimeout(() => {
                navigate("/me/posts");
            }, 1500);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSaveDraft = async () => {
        if (!validateAll()) {
            return;
        }

        const formData = new FormData();
        formData.append("title", formEdit.title);
        formData.append("content", formEdit.content);
        formData.append("metaTitle", formEdit.metaTitle);
        formData.append("metaContent", formEdit.metaContent);

        if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

        formData.append("published_at", null);
        formData.append("status", "draft");
        formData.append("visibility", "draft");

        try {
            if (id) {
                await updatePost({ id, formData }).unwrap();
            } else {
                await createPost(formData).unwrap();
            }
            toast.success("Lưu nháp thành công!");
            setTimeout(() => {
                navigate("/me/posts");
            }, 1500);
        } catch (err) {
            toast.error("Lỗi khi lưu nháp bài viết", err);
        }
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
                <Model notOverlayCancel onCancel={handleCancelModel}>
                    <div className={styles.model}>
                        <h3 className={styles.title}>Xuất bản bài viết</h3>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Ảnh đại diện</label>
                            <div className={styles.wrap}>
                                <UploadImg
                                    thumbnail={formEdit.thumbnail || null}
                                    onFileChange={setThumbnailFile}
                                />
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
                                            {tag.name}
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

                        {!id && (
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Thời gian xuất bản
                                </label>

                                <div className={styles.publishOptions}>
                                    <label className={styles.radioOption}>
                                        <input
                                            type="radio"
                                            name="visibility"
                                            value="published"
                                            checked={
                                                formEdit.visibility ===
                                                    "published" && true
                                            }
                                            onChange={() => {
                                                setFormEdit((prev) => {
                                                    return {
                                                        ...prev,
                                                        visibility: "published",
                                                    };
                                                });
                                            }}
                                        />
                                        <span>Xuất bản ngay</span>
                                    </label>

                                    <label className={styles.radioOption}>
                                        <input
                                            type="radio"
                                            name="visibility"
                                            value="schedule"
                                            onChange={() => {
                                                setFormEdit((prev) => {
                                                    return {
                                                        ...prev,
                                                        visibility: "schedule",
                                                    };
                                                });
                                            }}
                                            checked={
                                                formEdit.visibility ===
                                                    "schedule" && true
                                            }
                                        />
                                        <span>Lên lịch xuất bản</span>
                                    </label>
                                </div>

                                {formEdit.visibility === "schedule" && (
                                    <div className={styles.scheduleInputs}>
                                        <div className={styles.dateTimeRow}>
                                            <div className={styles.dateInput}>
                                                <label
                                                    className={styles.subLabel}
                                                >
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
                                                <label
                                                    className={styles.subLabel}
                                                >
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
                        )}

                        <div className={styles.note}>
                            <strong>Lưu ý: </strong>
                            Chỉnh sửa tại đây không ảnh hưởng đến nội dung bài
                            viết, chỉ thay đổi cách hiển thị bài viết trên các
                            công cụ tìm kiếm như Google.
                        </div>

                        <div className={styles.actions}>
                            <Button
                                onClick={handleCancelModel}
                                className={`${styles.wrap}`}
                            >
                                <div className={styles.inner}>
                                    <div className={styles.title}>HUỶ</div>
                                </div>
                            </Button>
                            <Button
                                className={`${styles.wrap} ${styles.primary}`}
                                onClick={handlePublishPost}
                            >
                                <div className={styles.inner}>
                                    <div className={styles.title}>
                                        {" "}
                                        {id
                                            ? "Sửa bài viết"
                                            : formEdit.visibility ===
                                              "published"
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
