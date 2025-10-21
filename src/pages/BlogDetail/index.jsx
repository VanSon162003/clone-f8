import Button from "@/components/Button";
import styles from "./BlogDetail.module.scss";
import ParentCard from "@/components/ParentCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useState } from "react";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import Avatar from "@/components/Avatar";
import Actions from "@/components/Actions";
import BlogItem from "../Blog/components/BlogItem";
import Topics from "@/components/Topics";
import ShareModal from "@/components/ShareModal";
import { Link, useParams } from "react-router-dom";
import {
    useGetPostBySlugQuery,
    useGetAllPostsQuery,
} from "@/services/postsService";

import {
    useToggleLikeMutation,
    useCheckUserLikeQuery,
    useGetLikeCountQuery,
} from "@/services/likesService";
import {
    useToggleBookmarkMutation,
    useCheckUserBookmarkQuery,
} from "@/services/bookmarksService";
import { timeAgo } from "@/utils/timeAgo";
import CommentSidebar from "@/components/CommentSidebar";
import isHttps from "@/utils/isHttps";

function BlogDetail() {
    const { slug } = useParams();
    const [isOpen, setIsopen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [post, setPost] = useState([]);
    const [totalComment, setTotalComment] = useState(0);

    // Fetch post data
    const {
        data: postData,
        isLoading,
        error,
    } = useGetPostBySlugQuery(slug, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });
    // const postData = {};
    useEffect(() => {
        if (postData?.data) {
            setPost(postData.data);
            setTotalComment(postData.data.total_comment || 0);
        }
    }, [postData]);

    // Fetch like status and count
    const { data: likeStatus } = useCheckUserLikeQuery(
        { likeableType: "post", likeableId: post?.id },
        { skip: !post?.id }
    );
    const { data: likeCountData } = useGetLikeCountQuery(
        { likeableType: "post", likeableId: post?.id },
        { skip: !post?.id }
    );

    // Fetch bookmark status
    const { data: bookmarkStatus } = useCheckUserBookmarkQuery(
        { postId: post?.id },
        { skip: !post?.id }
    );

    // Mutations
    const [toggleLike] = useToggleLikeMutation();
    const [toggleBookmark] = useToggleBookmarkMutation();

    // Fetch related posts by same author
    const { data: relatedPostsData } = useGetAllPostsQuery(
        {
            page: 1,
            limit: 3,
            status: "published",
        },
        {
            refetchOnMountOrArgChange: true,
        }
    );

    const relatedPosts =
        relatedPostsData?.data?.posts?.filter(
            (p) => p.author?.id === post?.author?.id && p.id !== post?.id
        ) || [];

    const handleLike = async () => {
        if (!post?.id) return;
        try {
            await toggleLike({
                likeableType: "post",
                likeableId: post.id,
            }).unwrap();
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    const handleBookmark = async () => {
        if (!post?.id) return;
        try {
            await toggleBookmark({
                postId: post.id,
            }).unwrap();
        } catch (error) {
            console.error("Error toggling bookmark:", error);
        }
    };

    const handleCommentSideBar = () => {
        setIsopen(!isOpen);
    };

    if (isLoading) {
        return (
            <ParentCard>
                <div>Đang tải...</div>
            </ParentCard>
        );
    }

    if (error || !post) {
        return (
            <ParentCard>
                <div>Không tìm thấy bài viết hoặc có lỗi xảy ra.</div>
            </ParentCard>
        );
    }

    const author = post.author || {};

    return (
        <>
            <ParentCard>
                <div className="row">
                    <div className="col col-3  col-xxl-2 d-lg-none ">
                        <div className={styles.aside}>
                            <Button
                                href={`/profile/@${
                                    author.username || "unknown"
                                }`}
                            >
                                <h4 className={styles.username}>
                                    {author.username || "unknown"}
                                </h4>
                            </Button>
                            <p className={styles.userTitle}>
                                {author.title || "Tác giả"}
                            </p>
                            <hr />
                            <div className={styles.wrapper}>
                                <div
                                    onClick={handleLike}
                                    className={`${styles.bntReact} ${
                                        likeStatus?.data?.liked && styles.active
                                    }`}
                                >
                                    <FontAwesomeIcon
                                        icon={
                                            likeStatus?.data?.liked
                                                ? faHeartSolid
                                                : faHeart
                                        }
                                    />
                                    <span>
                                        {likeCountData?.data?.count || 0}
                                    </span>
                                </div>
                                <div
                                    className={styles.bntReact}
                                    onClick={handleCommentSideBar}
                                >
                                    <FontAwesomeIcon icon={faComment} />
                                    <span>{totalComment}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col col-6 col-xxl-8 col-lg-12">
                        <article>
                            <h1
                                className={styles.heading}
                                dangerouslySetInnerHTML={{
                                    __html: post.title,
                                }}
                            />
                            <div className={styles.header}>
                                <div className={styles.user}>
                                    <Avatar
                                        username={`/profile/@${
                                            author.username || "unknown"
                                        }`}
                                        blog={post}
                                        fontSize={"5.6px"}
                                        authorName={
                                            author.full_name || "Unknown Author"
                                        }
                                        avatar={
                                            isHttps(author?.avatar)
                                                ? author?.avatar
                                                : `${
                                                      import.meta.env
                                                          .VITE_BASE_URL
                                                  }${author?.avatar}` ||
                                                  `/src/assets/imgs/user.jpg`
                                        }
                                    />
                                </div>
                                <Actions
                                    onBookmark={handleBookmark}
                                    isBookmarked={
                                        bookmarkStatus?.data?.bookmarked
                                    }
                                    onShare={() => setIsShareModalOpen(true)}
                                    showShare={true}
                                />
                            </div>

                            <div className={styles.wrapperContent}>
                                <div className={styles.metaInfo}>
                                    <span>{timeAgo(post.created_at)}</span>
                                    <div className={styles.dot}>·</div>
                                    <span>
                                        {post.views_count || 0} lượt xem
                                    </span>
                                </div>

                                {post.thumbnail && (
                                    <div className={styles.thumbnail}>
                                        <img
                                            src={
                                                isHttps(post.thumbnail)
                                                    ? post.thumbnail
                                                    : `${
                                                          import.meta.env
                                                              .VITE_BASE_URL
                                                      }${post.thumbnail}`
                                            }
                                            alt={post.title.replace(
                                                /<[^>]+>/g,
                                                ""
                                            )}
                                        />
                                    </div>
                                )}

                                <div
                                    className={styles.content}
                                    dangerouslySetInnerHTML={{
                                        __html: post.content,
                                    }}
                                />
                            </div>
                        </article>

                        <div className={styles.bodyBottom}>
                            <div className={styles.wrapper}>
                                <div
                                    onClick={handleLike}
                                    className={`${styles.bntReact} ${
                                        likeStatus?.data?.liked && styles.active
                                    }`}
                                >
                                    <FontAwesomeIcon
                                        icon={
                                            likeStatus?.data?.liked
                                                ? faHeartSolid
                                                : faHeart
                                        }
                                    />
                                    <span>
                                        {likeCountData?.data?.count || 0}
                                    </span>
                                </div>
                                <div
                                    className={styles.bntReact}
                                    onClick={handleCommentSideBar}
                                >
                                    <FontAwesomeIcon icon={faComment} />
                                    <span>{totalComment}</span>
                                </div>
                            </div>

                            <div className={styles.tags}>
                                {post.tags?.map((tag, index) => (
                                    <a
                                        key={index}
                                        href={`/blog/tag/${tag.name}`}
                                        className={styles.tag}
                                    >
                                        {tag.name}
                                    </a>
                                ))}
                            </div>

                            <div className={styles.relatedPost}>
                                <h3 className={styles.relatedHeading}>
                                    Bài đăng cùng tác giả
                                </h3>
                                {relatedPosts.length > 0 ? (
                                    <ul className={styles.list}>
                                        {relatedPosts.map((relatedPost) => (
                                            <li key={relatedPost.id}>
                                                <Link
                                                    to={`/blog/${relatedPost.slug}`}
                                                    dangerouslySetInnerHTML={{
                                                        __html: relatedPost.title,
                                                    }}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className={styles.noResult}>
                                        Tác giả chưa có bài đăng nào khác.
                                    </p>
                                )}
                            </div>

                            <hr />

                            <BlogItem posts={relatedPosts} />

                            <Topics marginTop />
                        </div>
                    </div>
                </div>
            </ParentCard>

            <CommentSidebar
                open={isOpen}
                commentableId={post.id}
                commentableType={"post"}
                totalComment={totalComment}
                setTotalComment={setTotalComment}
            />

            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                post={post}
            />
        </>
    );
}

export default BlogDetail;
