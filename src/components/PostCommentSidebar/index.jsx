import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./PostCommentSidebar.module.scss";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Avatar from "../Avatar";
import React, { useState } from "react";
import ScrollLock from "../ScrollLock";
import { useSelector } from "react-redux";
import { timeAgo } from "@/utils/timeAgo";

function PostCommentSidebar({
    open = false,
    onCancel = () => {},
    comments = [],
    isLoading = false,
    onSubmitComment,
    newComment = "",
    setNewComment,
}) {
    const [isOpen, setIsOpen] = useState(open);
    const [isOpenCommentEditor, setIsOpenCommentEditor] = useState(false);
    const currentUser = useSelector((state) => state.auth.currentUser);

    React.useEffect(() => {
        setIsOpen(open);
    }, [open]);

    React.useEffect(() => {
        const handleCommentSideBar = (e) => {
            if (e.key === "Escape") {
                setIsOpen(false);
                onCancel();
            }
        };

        document.addEventListener("keydown", handleCommentSideBar);

        return () => {
            document.removeEventListener("keydown", handleCommentSideBar);
        };
    }, []);

    const handleCommentSideBar = () => {
        setIsOpen(!isOpen);
        onCancel();
    };

    const handleOpenComment = () => {
        if (!currentUser) {
            alert("Vui lòng đăng nhập để bình luận");
            return;
        }
        setIsOpenCommentEditor(true);
    };

    const handleCloseComment = () => {
        setIsOpenCommentEditor(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmitComment) {
            onSubmitComment(e);
        }
        handleCloseComment();
    };

    return (
        <>
            {isOpen && <ScrollLock />}
            <div className={`${styles.wrapper} ${isOpen && styles.open}`}>
                <div
                    className={styles.overlay}
                    onClick={handleCommentSideBar}
                ></div>
                <div className={`${styles.container} ${isOpen && styles.open}`}>
                    <div
                        className={styles.btnClose}
                        onClick={handleCommentSideBar}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </div>

                    <div className={styles.body}>
                        <div className={styles.commentApp}>
                            <div
                                className="container-fluid"
                                style={{ padding: "16px" }}
                            >
                                <div className={styles.top}>
                                    <div className={styles.user}>
                                        <Avatar
                                            fontSize={"4.445px"}
                                            avatar={currentUser?.avatar}
                                        />
                                    </div>
                                    <div
                                        className={styles.comment}
                                        onClick={handleOpenComment}
                                    >
                                        <div
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {isOpenCommentEditor ? (
                                                <form onSubmit={handleSubmit}>
                                                    <textarea
                                                        value={newComment}
                                                        onChange={(e) => setNewComment(e.target.value)}
                                                        placeholder="Nhập bình luận của bạn..."
                                                        className={styles.commentInput}
                                                        rows={3}
                                                    />
                                                    <div className={styles.commentActions}>
                                                        <button
                                                            type="button"
                                                            onClick={handleCloseComment}
                                                            className={styles.cancelBtn}
                                                        >
                                                            Hủy
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className={styles.submitBtn}
                                                            disabled={!newComment.trim()}
                                                        >
                                                            Bình luận
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <div
                                                    className={styles.commentPlaceholder}
                                                    onClick={handleOpenComment}
                                                >
                                                    Nhập bình luận mới của bạn
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.content}>
                                    <div className={styles.header}>
                                        <h2 className={styles.title}>
                                            {comments.length} bình luận
                                        </h2>
                                    </div>

                                    <div>
                                        {isLoading ? (
                                            <div className={styles.loading}>
                                                Đang tải bình luận...
                                            </div>
                                        ) : comments.length > 0 ? (
                                            <div className={styles.commentList}>
                                                {comments.map((comment) => (
                                                    <div key={comment.id} className={styles.commentItem}>
                                                        <div className={styles.commentHeader}>
                                                            <Avatar
                                                                fontSize={"3px"}
                                                                avatar={comment.user?.avatar || "/src/assets/imgs/user.jpg"}
                                                            />
                                                            <div className={styles.commentInfo}>
                                                                <span className={styles.authorName}>
                                                                    {comment.user?.full_name || 'Unknown'}
                                                                </span>
                                                                <span className={styles.commentTime}>
                                                                    {timeAgo(comment.created_at)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className={styles.commentContent}>
                                                            {comment.content}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className={styles.noComments}>
                                                <p>Chưa có bình luận nào</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PostCommentSidebar;
