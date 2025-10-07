import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./CommentSidebar.module.scss";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Avatar from "../Avatar";
import { useEffect, useState } from "react";
import ScrollLock from "../ScrollLock";
import CommentItem from "../CommentItem";
import Editor from "../Editor";

function CommentSidebar({ open = false, onCancel }) {
    const [isOpen, setIsOpen] = useState(open);
    const [isOpenCommentEditor, setIsOpenCommentEditor] = useState(false);
    const [openTippyId, setOpenTippyId] = useState(null);
    const [comments, setComments] = useState([
        {
            id: 8,
            content: "oke chưa",
            reactionCount: 8,
            parent: null,
            createdAt: "2025-08-23 15:58:00",
            updatedAt: "2025-08-23 15:58:00",
            initialActed: [
                { id: 1, count: 2, icon: "👍", label: "Thích" },
                { id: 2, count: 2, icon: "❤️", label: "Yêu thích" },
                { id: 3, count: 4, icon: "😂", label: "Haha" },
            ],
            userReaction: { id: 1, icon: "👍", label: "Thích" },
            user: {
                id: 8,
                fullname: "van son",
                username: "sonvan",
                avatar: "/src/assets/imgs/user.jpg",
            },
            replies: [
                {
                    id: 1,
                    content: "oke chưa hh",
                    reactionCount: 3,
                    parent: 8,

                    initialActed: [
                        { id: 1, count: 1, icon: "👍", label: "Thích" },
                        { id: 2, count: 2, icon: "❤️", label: "Yêu thích" },
                    ],
                    userReaction: null,
                    createdAt: "2025-08-23 15:58:00",
                    updatedAt: "2025-08-23 15:58:00",
                    user: {
                        id: 1,
                        fullname: "van son reply",
                        username: "sonvan",
                        avatar: "/src/assets/imgs/user.jpg",
                    },
                },
            ],
        },
        {
            id: 2,
            content: "oke chưa???",
            createdAt: "2025-08-23 15:58:00",
            updatedAt: "2025-08-23 15:58:00",
            reactionCount: 0,
            initialActed: [],
            userReaction: null,
            parent: null,
            user: {
                id: 1,
                fullname: "van son",
                username: "sonvan",
                avatar: "/src/assets/imgs/user.jpg",
            },
            replies: [],
        },
    ]);

    console.log(open);

    useEffect(() => {
        setIsOpen(open);
    }, [open]);

    useEffect(() => {
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
        setIsOpenCommentEditor(true);
    };

    const handleCloseComment = () => {
        setIsOpenCommentEditor(false);
    };

    const handleAddComment = (value) => {
        const newComment = {
            id: Math.floor(Math.random() * 900),
            content: value,
            reactionCount: 0,
            parent: null,

            createdAt: "2025-08-23 15:58:00",
            updatedAt: "2025-08-23 15:58:00",
            initialActed: [],
            userReaction: null,
            user: {
                id: 8,
                fullname: "van son adđ",
                username: "sonvan",
                avatar: "/src/assets/imgs/user.jpg",
            },
            replies: [],
        };

        setComments((prev) => [newComment, ...prev]);
        handleCloseComment();
    };

    const handleEditComment = (newContent, id) => {
        setComments((prev) => {
            return prev.map((comment) => {
                if (comment.id === id) {
                    return {
                        ...comment,
                        content: newContent,
                    };
                }
                return comment;
            });
        });
    };

    const addReplyRecursive = (comments, parentId, newReply) => {
        return comments.map((comment) => {
            if (parentId === null || comment.id === parentId) {
                return {
                    ...comment,
                    replies: [newReply, ...(comment.replies || [])],
                };
            }

            return comment;
        });
    };

    const findCommentById = (comments, id) => {
        const findCommentById = comments.find((comment) => {
            if (comment.replies && comment.replies.length > 0) {
                return comment.replies.find((reply) => {
                    const check = reply?.parent === id || reply?.id === id;
                    return check;
                });
            }

            return comment?.id === id;
        });

        return findCommentById;
    };

    const handleReupComment = (content, id) => {
        const findComment = findCommentById(comments, id);
        console.log(findComment);

        const parentId = findComment?.id;

        const currentUser = {
            id: Math.floor(Math.random() * 900),
            content,
            reactionCount: 0,
            initialActed: [],
            userReaction: null,
            parent: parentId,
            createdAt: "2025-08-23 15:58:00",
            updatedAt: "2025-08-23 15:58:00",
            user: {
                id: 8,
                fullname: "van son reply",
                username: "sonvan",
                avatar: "/src/assets/imgs/user.jpg",
            },
            replies: [],
        };

        setComments((prev) => addReplyRecursive(prev, parentId, currentUser));
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
                                            avatar={"/src/assets/imgs/user.jpg"}
                                        />
                                    </div>
                                    <div
                                        className={styles.comment}
                                        onClick={handleOpenComment}
                                    >
                                        <div
                                            onClick={(e) => e.stopPropagation()} // chặn nổi bọt từ con
                                        >
                                            {isOpenCommentEditor ? (
                                                <Editor
                                                    onCancel={
                                                        handleCloseComment
                                                    }
                                                    onSubmit={handleAddComment}
                                                />
                                            ) : (
                                                <div
                                                    className={
                                                        styles.commentPlaceholder
                                                    }
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
                                        {comments.length > 0 && (
                                            <span
                                                className={`${styles.note} d-md-none`}
                                            >
                                                Nếu thấy bình luận spam, các bạn
                                                bấm report giúp admin nhé
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        {comments.length > 0 ? (
                                            <>
                                                <div
                                                    className={
                                                        styles.commentList
                                                    }
                                                >
                                                    {comments.map((comment) => {
                                                        return (
                                                            <CommentItem
                                                                key={comment.id}
                                                                id={comment.id}
                                                                isOpen={
                                                                    openTippyId ===
                                                                    comment.id
                                                                }
                                                                onToggle={() =>
                                                                    setOpenTippyId(
                                                                        openTippyId ===
                                                                            comment.id
                                                                            ? null
                                                                            : comment.id
                                                                    )
                                                                }
                                                                username={
                                                                    comment.user
                                                                        .username
                                                                }
                                                                avatar={
                                                                    comment.user
                                                                        .avatar
                                                                }
                                                                fullname={
                                                                    comment.user
                                                                        .fullname
                                                                }
                                                                replies={
                                                                    comment.replies
                                                                }
                                                                content={
                                                                    comment.content
                                                                }
                                                                reactionCount={
                                                                    comment.reactionCount
                                                                }
                                                                initialActed={
                                                                    comment.initialActed
                                                                }
                                                                userReaction={
                                                                    comment.userReaction
                                                                }
                                                                createdAt={
                                                                    comment.createdAt
                                                                }
                                                                openTippyId={
                                                                    openTippyId
                                                                }
                                                                setOpenTippyId={
                                                                    setOpenTippyId
                                                                }
                                                                handleEditComment={
                                                                    handleEditComment
                                                                }
                                                                handleReupComment={
                                                                    handleReupComment
                                                                }
                                                                user={
                                                                    comment.user
                                                                }
                                                            />
                                                        );
                                                    })}
                                                </div>

                                                <p
                                                    className={
                                                        styles.endMessage
                                                    }
                                                >
                                                    <svg
                                                        className="svg-inline--fa"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 512 512"
                                                    >
                                                        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path>
                                                    </svg>
                                                    Đã tải hết bình luận
                                                </p>
                                            </>
                                        ) : (
                                            <div className={styles.body}>
                                                <img
                                                    className={styles.img}
                                                    src="/src/assets/icons/noComment.svg"
                                                    alt=""
                                                />
                                                <p className={styles.message}>
                                                    Chưa có bình luận nào
                                                </p>
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

export default CommentSidebar;
