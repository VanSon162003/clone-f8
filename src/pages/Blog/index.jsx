import { useEffect, useState } from "react";
import Banner from "@/components/Banner";
import blogService from "@/services/blogService";
import { useSearchParams } from "react-router-dom";
import BlogItem from "./components/BlogItem";

import styles from "./Blog.module.scss";
import ParentCard from "@/components/ParentCard";

function Blog() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [blogs, setBlogs] = useState([]);

    const [currentPage, setCurrentPage] = useState(
        () => searchParams.get("page") || 1
    );

    useEffect(() => {
        (async () => {
            const data = await blogService.getBlogs(currentPage, 10);

            setBlogs(data.data.items);
        })();
    }, [currentPage]);

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
                            <BlogItem />
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
