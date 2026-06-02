import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./CommentSidebar.module.scss";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Avatar from "../Avatar";
import React, { useEffect, useRef, useState } from "react";
import ScrollLock from "../ScrollLock";
import CommentItem from "../CommentItem";
import Editor from "../Editor";
import {
    useCreateCommentMutation,
    useDeleteCommentMutation,
    useEditCommentMutation,
    useGetAllByTypeQuery,
} from "@/services/commentsService";
import { useSelector } from "react-redux";
import isHttps from "@/utils/isHttps";
import socketClient from "@/utils/websocket";
import Button from "../Button";
import { toast } from "react-toastify";

import avatarDefault from "@/assets/imgs/user.jpg";
import noComment from "@/assets/icons/noComment.svg";

const countComments = (comments = []) =>
    comments.reduce(
        (total, comment) => total + 1 + (comment.replies?.length || 0),
        0
    );

const removeCommentById = (comments = [], id) => {
    let deletedCount = 0;

    const nextComments = comments.reduce((result, comment) => {
        if (comment.id === id) {
            deletedCount += 1 + (comment.replies?.length || 0);
            return result;
        }

        const replies = comment.replies || [];
        const nextReplies = replies.filter((reply) => {
            const shouldKeep = reply.id !== id;
            if (!shouldKeep) deletedCount += 1;
            return shouldKeep;
        });

        result.push({ ...comment, replies: nextReplies });
        return result;
    }, []);

    return { nextComments, deletedCount };
};

const buildLocalComment = ({ apiComment, content, currentUser, parentId = null }) => ({
    id: apiComment?.data?.id || apiComment?.id || Date.now(),
    parent_id: parentId,
    like_count: apiComment?.data?.like_count || apiComment?.like_count || 0,
    content: apiComment?.data?.content || apiComment?.content || content,
    deleted_at: null,
    created_at: apiComment?.data?.created_at || apiComment?.created_at || new Date().toISOString(),
    updated_at: apiComment?.data?.updated_at || apiComment?.updated_at || new Date().toISOString(),
    user: apiComment?.data?.user ||
        apiComment?.user || {
            id: currentUser.id,
            full_name: currentUser.full_name,
            username: currentUser.username,
            avatar: currentUser.avatar,
            commentReactions: [],
        },
    replies: apiComment?.data?.replies || apiComment?.replies || [],
    reactions: apiComment?.data?.reactions || apiComment?.reactions || [],
    currentUserReaction: apiComment?.data?.currentUserReaction || apiComment?.currentUserReaction || null,
});

function CommentSidebar({
    open = false,
    onCancel = () => {},
    commentableType,
    commentableId,
    totalComment = 0,
    setTotalComment,
}) {
    const [isOpen, setIsOpen] = useState(open);
    const [isOpenCommentEditor, setIsOpenCommentEditor] = useState(false);
    const [openTippyId, setOpenTippyId] = useState(null);
    const [comments, setComments] = useState([]);

    const currentUser = useSelector((state) => state.auth.currentUser);

    const [totalCommentQuestion, setTotalCommentQuestion] = useState(0);

    // lấy 10 comment đầu mỗi khi chạm đáy lấy thêm 10 cái nữa

    const [hasMore, setHasMore] = useState(true);

    const [offset, setOffset] = useState(0);
    const limit = 5;

    const queryArgs = React.useMemo(
        () => ({
            type: commentableType,
            id: commentableId,
            limit,
            offset,
        }),
        [commentableType, commentableId, limit, offset]
    );

    const { data, isFetching } = useGetAllByTypeQuery(queryArgs, {
        skip: !open || !commentableType || !commentableId,
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    const observer = useRef();
    const lastComment = (node) => {
        if (isFetching || !hasMore) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setOffset((prev) => prev + limit);
            }
        });

        if (node) observer.current.observe(node);
    };

    const [createComment] = useCreateCommentMutation();
    const [editComment] = useEditCommentMutation();
    const [deleteComment] = useDeleteCommentMutation();

    useEffect(() => {
        const nextTotal = countComments(data?.data || []);

        if (commentableType === "question") {
            setTotalCommentQuestion(nextTotal);
        } else if (typeof setTotalComment === "function" && offset === 0) {
            setTotalComment(nextTotal);
        }
    }, [data, commentableType, offset, setTotalComment]);

    // socket comment post
    useEffect(() => {
        const chanel = socketClient.subscribe(`comment-post-${commentableId}`);

        chanel.bind("notification-new-comment-post", (data) => {
            if (currentUser.id === data.UserNotification.id) return;
            const newComment = {
                id: data.comment_id,
                parent_id: null,
                like_count: 0,
                content: data.content,

                deleted_at: null,
                created_at: Date.now(),
                updated_at: Date.now(),
                user: data.UserNotification,
                replies: [],
                reactions: [],
            };
            setComments((prev) => [newComment, ...prev]);
            setTotalComment((prev) => prev + 1);
        });

        return () => {
            socketClient.unsubscribe(`comment-post-${commentableId}`);
        };
    }, [commentableId, currentUser]);

    useEffect(() => {
        setComments([]);
        setOffset(0);
        setHasMore(true);
        setTotalCommentQuestion(0);
    }, [commentableId, commentableType]);

    // lấy ra comments
    useEffect(() => {
        if (data?.data) {
            setComments((prev) => {
                if (offset === 0) return data.data;

                const existingIds = new Set(prev.map((c) => c.id));
                const newOnes = data.data.filter(
                    (c) => !existingIds.has(c?.id)
                );
                return [...prev, ...newOnes];
            });
            if (data.data.length < limit) setHasMore(false);
        }
    }, [data, offset]);

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

    const handleAddComment = async (value) => {
        if (!currentUser)
            return toast.info("Vui lòng đăng nhập để thực hiện hành động này!");

        try {
            const apiComment = await createComment({
                content: value,
                type: commentableType,
                id: commentableId,
            }).unwrap();

            const newComment = buildLocalComment({
                apiComment,
                content: value,
                currentUser,
            });

            setComments((prev) => [newComment, ...prev]);
            setTotalComment((prev) => prev + 1);
            setTotalCommentQuestion((prev) => prev + 1);
            handleCloseComment();
        } catch (error) {
            console.log(error);
        }
    };

    const handleEditComment = async (newContent, id) => {
        if (!currentUser)
            return console.log("Cần đăng nhập trước khi sửa comment");

        try {
            await editComment({ id, content: newContent }).unwrap();

            setComments((prev) =>
                prev.map((comment) => {
                    if (comment.id === id) {
                        return {
                            ...comment,
                            content: newContent,
                        };
                    }

                    if (comment.replies && comment.replies.length > 0) {
                        const updatedReplies = comment.replies.map((reply) => {
                            if (reply.id === id) {
                                return {
                                    ...reply,
                                    content: newContent,
                                };
                            }
                            return reply;
                        });

                        return {
                            ...comment,
                            replies: updatedReplies,
                        };
                    }

                    return comment;
                })
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteComment = async (id) => {
        if (!currentUser)
            return console.log("Cần đăng nhập trước khi xoá comment");

        try {
            await deleteComment({ id }).unwrap();
            const { nextComments, deletedCount } = removeCommentById(
                comments,
                id
            );

            setComments(nextComments);
            setTotalComment((prev) => Math.max(0, prev - deletedCount));
            setTotalCommentQuestion((prev) => Math.max(0, prev - deletedCount));
        } catch (error) {
            console.error(error);
        }
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

    const handleReupComment = async (content, id) => {
        const findComment = findCommentById(comments, id);

        const parentId = findComment?.id || id;

        const apiComment = await createComment({
            content: content,
            type: commentableType,
            id: commentableId,
            parent_id: parentId,
        }).unwrap();

        const newComment = buildLocalComment({
            apiComment,
            content,
            currentUser,
            parentId,
        });

        setComments((prev) => addReplyRecursive(prev, parentId, newComment));
        setTotalComment((prev) => prev + 1);
        setTotalCommentQuestion((prev) => prev + 1);
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
                                {currentUser ? (
                                    <div className={styles.top}>
                                        <div className={styles.user}>
                                            <Avatar
                                                fontSize={"4.445px"}
                                                avatar={
                                                    currentUser?.avatar
                                                        ? isHttps(
                                                              currentUser?.avatar
                                                          )
                                                            ? currentUser?.avatar
                                                            : `${
                                                                  import.meta
                                                                      .env
                                                                      .VITE_BASE_URL
                                                              }${
                                                                  currentUser?.avatar
                                                              }`
                                                        : avatarDefault
                                                }
                                            />
                                        </div>
                                        <div
                                            className={styles.comment}
                                            onClick={handleOpenComment}
                                        >
                                            <div
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                } // chặn nổi bọt từ con
                                            >
                                                {isOpenCommentEditor ? (
                                                    <Editor
                                                        onCancel={
                                                            handleCloseComment
                                                        }
                                                        onSubmit={
                                                            handleAddComment
                                                        }
                                                    />
                                                ) : (
                                                    <div
                                                        className={
                                                            styles.commentPlaceholder
                                                        }
                                                        onClick={
                                                            handleOpenComment
                                                        }
                                                    >
                                                        Nhập bình luận mới của
                                                        bạn
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.noLogin}>
                                        <span>
                                            <Button to="/login">
                                                Đăng nhập
                                            </Button>{" "}
                                            để bình luận bài viết này ngay
                                        </span>
                                    </div>
                                )}

                                <div className={styles.content}>
                                    <div className={styles.header}>
                                        <h2 className={styles.title}>
                                            {commentableType === "question"
                                                ? totalCommentQuestion
                                                : totalComment}{" "}
                                            bình luận
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
                                                    {comments.map(
                                                        (comment, i) => {
                                                            const isLastComment =
                                                                i ===
                                                                comments.length -
                                                                    1;
                                                            return (
                                                                <CommentItem
                                                                    ref={
                                                                        isLastComment
                                                                            ? lastComment
                                                                            : null
                                                                    }
                                                                    key={
                                                                        comment.id
                                                                    }
                                                                    id={
                                                                        comment.id
                                                                    }
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
                                                                    comment={
                                                                        comment
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
                                                                    handleDeleteComment={
                                                                        handleDeleteComment
                                                                    }
                                                                    user={
                                                                        comment.user
                                                                    }
                                                                    currentUser={
                                                                        currentUser
                                                                    }
                                                                />
                                                            );
                                                        }
                                                    )}
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
                                                    src={noComment}
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
