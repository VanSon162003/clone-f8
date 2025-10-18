import styles from "./MyBookmark.module.scss";
import ParentCard from "@/components/ParentCard";
import Banner from "@/components/Banner";
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import {
    useGetUserBookmarksQuery,
    useToggleBookmarkMutation,
} from "@/services/bookmarksService";
import PostItem from "@/components/PostItem";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";

function MyBookmark() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [posts, setPosts] = useState([]);
    const [pagination, setPagination] = useState({});
    const limit = 10;
    const currentPage = parseInt(searchParams.get("page")) || 1;
    const { data, isLoading } = useGetUserBookmarksQuery(
        { page: currentPage, limit },
        {
            refetchOnFocus: true,
            refetchOnMountOrArgChange: true,
        }
    );

    useEffect(() => {
        if (data) {
            setPosts(data.data.bookmarks);
            setPagination(data.data.pagination);
        }
    }, [data]);

    const [toggleBookmark] = useToggleBookmarkMutation();

    const handleRemove = async (id) => {
        try {
            await toggleBookmark({ postId: id }).unwrap();
            setPosts((prev) => prev.filter((post) => post.id !== id));
            setPagination((prev) => ({
                ...prev,
                totalItems: (prev.totalItems || 0) - 1,
            }));
            toast.success("Đã xóa khỏi mục đã lưu", { autoClose: 3000 });
        } catch (error) {
            toast.error("Có lỗi xảy ra khi xóa bookmark", { autoClose: 3000 });
        }

        // Optionally call API to remove bookmark, then refetch
    };
    return (
        <ParentCard>
            <div className={styles.top}>
                <h1 className={styles.heading}>Bài viết đã lưu</h1>
            </div>
            <div className={styles.body}>
                <div className={"row"}>
                    <div className="col col-8 col-xxl-8 col-lg-12">
                        <div>
                            <div className={styles.wrapper}>
                                <ul className={styles.tabs}>
                                    <li>
                                        <Button
                                            className={styles.active}
                                            to="/me/posts/published"
                                        >
                                            Bài viết{" "}
                                            {`(${pagination.totalItems || 0})`}
                                        </Button>
                                    </li>
                                </ul>
                                <div className={styles.divider}></div>
                            </div>
                            <div className={styles.postLists}>
                                {isLoading ? (
                                    <div>Đang tải...</div>
                                ) : posts.length > 0 ? (
                                    posts.map((post) => (
                                        <PostItem
                                            removePost={handleRemove}
                                            key={post.id}
                                            post={post}
                                            type="myBookmark"
                                        />
                                    ))
                                ) : (
                                    <div className={styles.noResult}>
                                        <p>Chưa có bài viết nào. </p>
                                        <p>
                                            Bấm vào đây để{" "}
                                            <a href="/blog">
                                                xem các bài viết nổi bật.
                                            </a>
                                        </p>
                                    </div>
                                )}
                            </div>
                            {pagination.totalPages > 1 && (
                                <div className={styles.pagination}>
                                    <Button
                                        className={`${styles.btnPagination} ${
                                            currentPage <= 1 && styles.disabled
                                        }`}
                                        onClick={() =>
                                            setSearchParams({
                                                page: (
                                                    currentPage - 1
                                                ).toString(),
                                            })
                                        }
                                        disabled={currentPage <= 1}
                                    >
                                        Trước
                                    </Button>
                                    <span>
                                        {currentPage} / {pagination.totalPages}
                                    </span>
                                    <Button
                                        className={`${styles.btnPagination} ${
                                            currentPage >=
                                                pagination.totalPages &&
                                            styles.disabled
                                        }`}
                                        onClick={() =>
                                            setSearchParams({
                                                page: (
                                                    currentPage + 1
                                                ).toString(),
                                            })
                                        }
                                        disabled={
                                            currentPage >= pagination.totalPages
                                        }
                                    >
                                        Sau
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col col-4 col-xxl-4 col-lg-12">
                        <Banner />
                    </div>
                </div>
            </div>
        </ParentCard>
    );
}

export default MyBookmark;
