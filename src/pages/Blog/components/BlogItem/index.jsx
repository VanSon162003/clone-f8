import Button from "@/components/Button";
import styles from "./BlogItem.module.scss";
import Avatar from "@/components/Avatar";
import Actions from "@/components/Actions";
import { timeAgo } from "@/utils/timeAgo";
import { Link } from "react-router-dom";
import {
    useGetUserBookmarksQuery,
    useToggleBookmarkMutation,
} from "@/services/bookmarksService";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

function BlogItem({ posts = [] }) {
    const [toggleBookmark] = useToggleBookmarkMutation();

    const { data } = useGetUserBookmarksQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const [userBookmarks, setUserBookmarks] = useState([]);

    useEffect(() => {
        if (data) {
            const userBookmarks = data?.data?.bookmarks?.map((item) => item.id);
            setUserBookmarks(userBookmarks);
        }
    }, [data]);

    const renderBlogItem = (post) => {
        const author = post.author || {};
        const tags = post.tags || [];

        const handleBookmark = async () => {
            if (!post?.id) return;
            try {
                await toggleBookmark({
                    postId: post.id,
                }).unwrap();

                if (userBookmarks.includes(post.id)) {
                    setUserBookmarks((prev) =>
                        prev.filter((id) => id !== post.id)
                    );
                } else {
                    setUserBookmarks((prev) => [...prev, post.id]);
                }
            } catch (error) {
                console.error("Error toggling bookmark:", error);
            }
        };

        return (
            <div key={post.id} className={styles.wrapper}>
                <div className={styles.header}>
                    <div className={styles.author}>
                        <Button
                            href={`/profile/@${author.username || "unknown"}`}
                        >
                            <Avatar
                                fontSize={"0.29rem"}
                                avatar={
                                    author.avatar || "/src/assets/imgs/user.jpg"
                                }
                            />
                        </Button>
                        <Button
                            href={`/profile/@${author.username || "unknown"}`}
                        >
                            <span>{author.full_name || "Unknown Author"}</span>
                        </Button>
                    </div>

                    <Actions
                        onBookmark={handleBookmark}
                        isBookmarked={userBookmarks.includes(post.id)}
                    />
                </div>

                <div className={styles.body}>
                    <div className={styles.info}>
                        <Link to={`/blog/${post.slug}`}>
                            <h2 className={styles.title}>{post.title}</h2>
                        </Link>
                        <p className={styles.desc}>
                            {post.description ||
                                (post.content
                                    ? post.content.substring(0, 200) + "..."
                                    : "")}
                        </p>
                        <div className={styles.metaInfo}>
                            {tags.map((tag, i) => (
                                <Link
                                    key={i}
                                    to={`/blog/tag/${tag.name}`}
                                    className={styles.tag}
                                >
                                    {tag.name}
                                </Link>
                            ))}
                            <span>{timeAgo(post.created_at)}</span>
                            <div className={styles.dot}>·</div>
                            <span>{post.views_count || 0} lượt xem</span>
                        </div>
                    </div>

                    {post.thumbnail && (
                        <div className={`${styles.thumbnail} d-xl-none`}>
                            <Link to={`/blog/${post.slug}`}>
                                <img src={post.thumbnail} alt={post.title} />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (posts.length === 0) {
        return <div>Không có bài viết nào.</div>;
    }

    return <>{posts.map((post) => renderBlogItem(post))}</>;
}

export default BlogItem;
