import { useState } from "react";
import Banner from "@/components/Banner";
import { useSearchParams } from "react-router-dom";
import BlogItem from "./components/BlogItem";
import { useGetAllPostsQuery } from "@/services/postsService";

import styles from "./Blog.module.scss";
import ParentCard from "@/components/ParentCard";
import { useSelector } from "react-redux";

function Blog() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useState(
        () => parseInt(searchParams.get("page")) || 1
    );

    const currentUser = useSelector((state) => state.auth.currentUser);

    const {
        data: postsData,
        isLoading,
        error,
    } = useGetAllPostsQuery(
        {
            page: currentPage,
            limit: 10,
            status: "published",
        },
        {
            refetchOnMountOrArgChange: true,
            refetchOnFocus: true,
            refetchOnReconnect: true,
        }
    );

    const posts = postsData?.data?.posts || [];
    const pagination = postsData?.data?.pagination || {};

    const postPublish = posts.filter((post) => {
        if (post?.is_approved) {
            return true;
        } else {
            if (post?.user_id === currentUser?.id) return true;
            return false;
        }
    });

    return (
        <ParentCard>
            <div className={styles.top}>
                <h1 className={styles.heading}>Bài viết nổi bật</h1>
                <div className={`${styles.desc} ${styles.warp}`}>
                    <p>
                        Tổng hợp các bài viết chia sẻ về kinh nghiệm tự học lập
                        trình online và các kỹ thuật lập trình web.
                    </p>
                </div>
            </div>

            <div className={styles.body}>
                <div className={"row"}>
                    <div className="col col-9 col-xxl-8 col-lg-12">
                        <div className={styles.leftLayout}>
                            {isLoading ? (
                                <div>Đang tải...</div>
                            ) : error ? (
                                <div>Có lỗi xảy ra: {error.message}</div>
                            ) : (
                                <>
                                    <BlogItem posts={postPublish} />

                                    {/* Pagination */}
                                    {pagination.totalPages > 1 && (
                                        <div className={styles.pagination}>
                                            <button
                                                onClick={() => {
                                                    const newPage =
                                                        currentPage - 1;
                                                    setCurrentPage(newPage);
                                                    setSearchParams({
                                                        page: newPage,
                                                    });
                                                }}
                                                disabled={
                                                    !pagination.hasPrevPage
                                                }
                                                className={styles.paginationBtn}
                                            >
                                                Trước
                                            </button>

                                            <span className={styles.pageInfo}>
                                                Trang {pagination.currentPage} /{" "}
                                                {pagination.totalPages}
                                            </span>

                                            <button
                                                onClick={() => {
                                                    const newPage =
                                                        currentPage + 1;
                                                    setCurrentPage(newPage);
                                                    setSearchParams({
                                                        page: newPage,
                                                    });
                                                }}
                                                disabled={
                                                    !pagination.hasNextPage
                                                }
                                                className={styles.paginationBtn}
                                            >
                                                Sau
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="col col-3 col-xxl-4 col-lg-12">
                        <Banner blog />
                    </div>
                </div>
            </div>
        </ParentCard>
    );
}

export default Blog;
