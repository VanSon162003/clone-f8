import { useState } from "react";
import Banner from "@/components/Banner";
import { useParams } from "react-router-dom";
import BlogItem from "../Blog/components/BlogItem";
import { useGetPostsByTagQuery } from "@/services/postsService";

import styles from "../Blog/Blog.module.scss";
import ParentCard from "@/components/ParentCard";

function BlogTag() {
    const { tagName } = useParams();
    const [currentPage, setCurrentPage] = useState(1);

    const { data: postsData, isLoading, error } = useGetPostsByTagQuery({
        tagName: tagName,
        page: currentPage,
        limit: 10
    });

    const posts = postsData?.data?.posts || [];
    const pagination = postsData?.data?.pagination || {};

    return (
        <ParentCard>
            <div className={styles.top}>
                <h1 className={styles.heading}>Bài viết với tag: {tagName}</h1>
                <div className={`${styles.desc} ${styles.warp}`}>
                    <p>
                        Tổng hợp các bài viết với tag "{tagName}" về kinh nghiệm tự học lập
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
                                    <BlogItem posts={posts} />
                                    
                                    {/* Pagination */}
                                    {pagination.totalPages > 1 && (
                                        <div className={styles.pagination}>
                                            <button
                                                onClick={() => setCurrentPage(currentPage - 1)}
                                                disabled={!pagination.hasPrevPage}
                                                className={styles.paginationBtn}
                                            >
                                                Trước
                                            </button>
                                            
                                            <span className={styles.pageInfo}>
                                                Trang {pagination.currentPage} / {pagination.totalPages}
                                            </span>
                                            
                                            <button
                                                onClick={() => setCurrentPage(currentPage + 1)}
                                                disabled={!pagination.hasNextPage}
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

export default BlogTag;
