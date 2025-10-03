import Button from "@/components/Button";
import styles from "./PostItem.module.scss";
import { timeAgo } from "@/utils/timeAgo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import Tippy from "@/components/Tippy";
import { useNavigate } from "react-router-dom";

function PostItem({ post = {}, removePost, isPublished = false }) {
    const [openTippy, setOpenTippy] = useState(false);
    const actionMore = useRef();
    const tippyRef = useRef();

    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                !actionMore.current?.contains(e.target) &&
                !tippyRef.current?.contains(e.target)
            ) {
                setOpenTippy(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleEdit = () => {
        navigate(`/post/edit?id=${post?.id}`);
    };
    const handleRemove = () => {
        removePost(post.id);
    };

    return (
        <div className={styles.wrapper}>
            <h3 title={post?.title}>
                <Button
                    to={
                        isPublished
                            ? `/blog/${post.slug}`
                            : `/post/edit?id=${post?.id}`
                    }
                >
                    <span>{post?.title}</span>
                </Button>
            </h3>

            <div className={styles.author}>
                <Button
                    to={
                        isPublished
                            ? `/blog/${post.slug}`
                            : `/post/edit?id=${post?.id}`
                    }
                >
                    Chỉnh sửa {timeAgo(post.createdAt)}
                </Button>

                <div className={styles.dot}>·</div>
                <span>{post.readAt} đọc</span>
            </div>

            <span
                ref={actionMore}
                onClick={() => setOpenTippy((prev) => !prev)}
                className={styles.more}
                aria-expanded={openTippy}
            >
                <FontAwesomeIcon icon={faEllipsis} />
            </span>

            {openTippy && (
                <Tippy
                    onEdit={handleEdit}
                    onRemove={handleRemove}
                    type="myPost"
                    ref={tippyRef}
                />
            )}
        </div>
    );
}

export default PostItem;
