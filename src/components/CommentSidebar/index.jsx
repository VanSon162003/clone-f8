import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./CommentSidebar.module.scss";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Avatar from "../Avatar";
import { useEffect, useState } from "react";
import ScrollLock from "../ScrollLock";
import CommentItem from "../CommentItem";

function CommentSidebar({ open = false }) {
    const [isOpen, setIsOpen] = useState(open);
    const [openTippyId, setOpenTippyId] = useState(null);

    useEffect(() => {
        setIsOpen(open);
    }, [open]);

    useEffect(() => {
        const handleCommentSideBar = (e) => {
            if (e.key === "Escape") setIsOpen(false);
        };

        document.addEventListener("keydown", handleCommentSideBar);

        return () => {
            document.removeEventListener("keydown", handleCommentSideBar);
        };
    }, []);

    const comments = [
        {
            id: 1,
            content: "oke chưa",
            reactionCount: 8,
            createdAt: "2025-08-23 15:58:00",
            updatedAt: "2025-08-23 15:58:00",
            initialActed: [
                { id: 1, count: 2, icon: "👍", label: "Thích" },
                { id: 2, count: 2, icon: "❤️", label: "Yêu thích" },
                { id: 3, count: 4, icon: "😂", label: "Haha" },
            ],
            userReaction: { id: 1, icon: "👍", label: "Thích" },
            user: {
                id: 1,
                fullname: "van son",
                username: "sonvan",
                avatar: "/src/assets/imgs/user.jpg",
            },
            replies: [
                {
                    id: 8,
                    content: "oke chưa hh",
                    reactionCount: 3,
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
            content: "oke chưa",
            createdAt: "2025-08-23 15:58:00",
            updatedAt: "2025-08-23 15:58:00",
            reactionCount: 0,
            initialActed: [],
            userReaction: null,
            user: {
                id: 1,
                fullname: "van son",
                username: "sonvan",
                avatar: "/src/assets/imgs/user.jpg",
            },
        },
    ];

    const handleCommentSideBar = () => {
        setIsOpen(!isOpen);
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
                                    <div className={styles.comment}>
                                        <div
                                            className={
                                                styles.commentPlaceholder
                                            }
                                        >
                                            Nhập bình luận mới của bạn
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
                                            <div className={styles.commentList}>
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
                                                        />
                                                    );
                                                })}
                                            </div>
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
