import { useEffect, useRef, useState } from "react";
import Avatar from "../Avatar";
import Button from "../Button";
import styles from "./CommentItem.module.scss";
import { timeAgo } from "@/utils/timeAgo";
import ReactionButton from "../ReactionButton";

function CommentItem({
    id,
    username = "",
    createdAt = "",
    fullname = "",
    avatar = "",
    content = "",
    isOpen,
    onToggle,
    replies = [],
    type = "comments",
    openTippyId,
    setOpenTippyId,
    reactionCount = 0,
    initialActed = [],
    userReaction = null,
}) {
    const [isOpenReplies, setIsOpenReplies] = useState(false);

    const [acted, setActed] = useState([]);
    const [currentUserReaction, setCurrentUserReaction] =
        useState(userReaction);
    const [totalReaction, setTotalReaction] = useState(reactionCount);

    const tippyRef = useRef(null);

    const reactions = [
        { id: 1, icon: "👍", label: "Thích" },
        { id: 2, icon: "❤️", label: "Yêu thích" },
        { id: 3, icon: "😂", label: "Haha" },
        { id: 4, icon: "😮", label: "Wow" },
        { id: 5, icon: "😢", label: "Buồn" },
        { id: 6, icon: "😡", label: "Phẫn nộ" },
    ];

    useEffect(() => {
        if (initialActed?.length) {
            const sorted = [...initialActed].sort((a, b) => b.count - a.count);
            setActed(sorted);
        }
        setTotalReaction(reactionCount);
        setCurrentUserReaction(userReaction);
    }, [initialActed, reactionCount, userReaction]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (tippyRef.current && !tippyRef.current.contains(e.target)) {
                if (isOpen) onToggle();
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [isOpen, onToggle]);

    const toggleReplies = () => {
        setIsOpenReplies(true);
    };

    const handleReactionChange = (newReaction) => {
        setCurrentUserReaction(newReaction);
        // api
        console.log("User reaction changed to:", newReaction);
    };

    const handleCountActedIds = ({
        react,
        isReact,
        isChange,
        previousReact,
    }) => {
        setActed((prevActed) => {
            let newActed = [...prevActed];

            if (isChange && previousReact) {
                const prevIndex = newActed.findIndex(
                    (item) => item.id === previousReact.id
                );
                if (prevIndex !== -1) {
                    if (newActed[prevIndex].count === 1) {
                        newActed = newActed.filter(
                            (item) => item.id !== previousReact.id
                        );
                    } else {
                        newActed[prevIndex] = {
                            ...newActed[prevIndex],
                            count: newActed[prevIndex].count - 1,
                        };
                    }
                }
            }

            const currentIndex = newActed.findIndex(
                (item) => item.id === react.id
            );

            if (isReact) {
                if (currentIndex === -1) {
                    newActed.push({ ...react, count: 1 });
                } else {
                    newActed[currentIndex] = {
                        ...newActed[currentIndex],
                        count: newActed[currentIndex].count + 1,
                    };
                }

                if (!isChange) {
                    setTotalReaction((prev) => prev + 1);
                }
            } else {
                if (currentIndex !== -1) {
                    if (newActed[currentIndex].count === 1) {
                        newActed = newActed.filter(
                            (item) => item.id !== react.id
                        );
                    } else {
                        newActed[currentIndex] = {
                            ...newActed[currentIndex],
                            count: newActed[currentIndex].count - 1,
                        };
                    }

                    if (!isChange) {
                        setTotalReaction((prev) => prev - 1);
                    }
                }
            }

            return newActed.sort((a, b) => b.count - a.count);
        });
    };

    return (
        <>
            <div
                className={`${styles.wrapper} ${
                    type === "replies" && styles.replyMode
                }`}
            >
                <div className={styles.header}>
                    <a href={`/@${username}`} className={styles.user}>
                        <Avatar fontSize={"4.445px"} avatar={avatar} />
                        <span className={styles.info}>
                            <span className={styles.useName}>{fullname}</span>
                            <span className={styles.createdAt}>
                                {timeAgo(createdAt)}
                            </span>
                        </span>
                    </a>
                </div>

                <div className={styles.body}>
                    <div className={styles.wrap}>
                        <p>{content}</p>
                    </div>
                </div>

                <div className={styles.reactionBar}>
                    <div className={styles.inner}>
                        <div className={styles.left}>
                            <span>
                                <ReactionButton
                                    onReact={handleReactionChange}
                                    reactions={reactions}
                                    handleCountActedIds={handleCountActedIds}
                                    userReaction={currentUserReaction}
                                />
                            </span>
                            <Button className={styles.interaction}>
                                Phản hồi
                            </Button>
                        </div>

                        <div className={styles.right} ref={tippyRef}>
                            {totalReaction > 0 && (
                                <div className={styles.reactionBtn}>
                                    <div className={styles.inner}>
                                        {acted.map((item) => {
                                            return (
                                                <div
                                                    key={item.id}
                                                    className={
                                                        styles.reactionIcon
                                                    }
                                                >
                                                    {item.icon}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <span className={styles.reactionCount}>
                                        {totalReaction}
                                    </span>
                                </div>
                            )}

                            <Button
                                className={styles.moreBtn}
                                onClick={onToggle}
                            >
                                <svg
                                    width="14"
                                    height="4"
                                    viewBox="0 0 14 4"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M3.75 2C3.75 2.96875 2.9375 3.75 2 3.75C1.03125 3.75 0.25 2.96875 0.25 2C0.25 1.0625 1.03125 0.25 2 0.25C2.9375 0.25 3.75 1.0625 3.75 2ZM8.75 2C8.75 2.96875 7.9375 3.75 7 3.75C6.03125 3.75 5.25 2.96875 5.25 2C5.25 1.0625 6.03125 0.25 7 0.25C7.9375 0.25 8.75 1.0625 8.75 2ZM10.25 2C10.25 1.0625 11.0312 0.25 12 0.25C12.9375 0.25 13.75 1.0625 13.75 2C13.75 2.96875 12.9375 3.75 12 3.75C11.0312 3.75 10.25 2.96875 10.25 2Z"
                                        fill="#54B8FF"
                                    />
                                </svg>
                            </Button>

                            {isOpen && (
                                <div className={styles.tippy}>
                                    <ul className={styles.optionsList}>
                                        <li>
                                            <Button className={styles.option}>
                                                Báo cáo vi phạm
                                            </Button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {replies.length > 0 &&
                (isOpenReplies ? (
                    <div className={styles.replies}>
                        {replies.map((reply) => {
                            return (
                                <CommentItem
                                    key={reply.id}
                                    id={reply.id}
                                    isOpen={openTippyId === reply.id}
                                    onToggle={() =>
                                        setOpenTippyId(
                                            openTippyId === reply.id
                                                ? null
                                                : reply.id
                                        )
                                    }
                                    username={reply.user.username}
                                    avatar={reply.user.avatar}
                                    fullname={reply.user.fullname}
                                    replies={reply.replies}
                                    content={reply.content}
                                    reactionCount={reply.reactionCount}
                                    initialActed={reply.initialActed}
                                    userReaction={reply.userReaction}
                                    createdAt={reply.createdAt}
                                    type="replies"
                                    openTippyId={openTippyId}
                                    setOpenTippyId={setOpenTippyId}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div>
                        <Button
                            onClick={toggleReplies}
                            className={styles.viewMore}
                        >
                            Xem {replies.length} câu trả lời
                        </Button>
                    </div>
                ))}
        </>
    );
}

export default CommentItem;
