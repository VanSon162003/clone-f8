import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ParentCard from "@/components/ParentCard";
import CourseItem from "@/components/CourseItem";
import PostItem from "@/components/PostItem";
import styles from "./SearchResults.module.scss";
import { useSearchQuery } from "@/services/searchService";
import LoadingCenter from "@/components/Loading/LoadingCenter";

function SearchResults() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("q");
    const [activeTab, setActiveTab] = useState("courses"); // "courses" or "posts"

    const [courses, setCourses] = useState([]);
    const [posts, setPosts] = useState([]);

    const { data: searchResults, isFetching } = useSearchQuery(
        { q: searchQuery },
        {
            skip: !searchQuery || searchQuery.trim().length < 2,
            refetchOnFocus: true,
            refetchOnMountOrArgChange: true,
            refetchOnReconnect: true,
        }
    );

    useEffect(() => {
        if (searchResults) {
            setCourses(searchResults?.data?.courses || []);
            setPosts(searchResults?.data?.posts || []);
        }
    }, [searchResults]);

    console.log(courses);

    if (isFetching) {
        return <LoadingCenter />;
    }

    return (
        <ParentCard>
            <div className={styles.container}>
                <h1 className={styles.title}>
                    Kết quả tìm kiếm cho: &ldquo;{searchQuery}&rdquo;
                </h1>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${
                            activeTab === "courses" ? styles.active : ""
                        }`}
                        onClick={() => setActiveTab("courses")}
                    >
                        Khóa học ({courses.length})
                    </button>
                    <button
                        className={`${styles.tab} ${
                            activeTab === "posts" ? styles.active : ""
                        }`}
                        onClick={() => setActiveTab("posts")}
                    >
                        Bài viết ({posts.length})
                    </button>
                </div>

                <div className={styles.results}>
                    {activeTab === "courses" ? (
                        <div className="row">
                            {courses.length > 0 ? (
                                courses.map((course) => (
                                    <div
                                        key={course.id}
                                        className="col col-3 col-lg-6"
                                    >
                                        <CourseItem
                                            item={course}
                                            courseType={
                                                course.is_pro ? "pro" : "free"
                                            }
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className={styles.noResults}>
                                    Không tìm thấy khóa học nào phù hợp.
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={styles.postsList}>
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <PostItem
                                        type="options"
                                        key={post.id}
                                        post={post}
                                    />
                                ))
                            ) : (
                                <div className={styles.noResults}>
                                    Không tìm thấy bài viết nào phù hợp.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </ParentCard>
    );
}

export default SearchResults;
