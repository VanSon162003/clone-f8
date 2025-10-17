import styles from "./MyPost.module.scss";
import ParentCard from "@/components/ParentCard";
import Banner from "@/components/Banner";
import Button from "@/components/Button";
import { useLocation } from "react-router-dom";
import PostItem from "@/components/PostItem";
import { useEffect, useState } from "react";
import { useGetPostsMeQuery, useDeletePostMutation } from "@/services/postsService";
import { toast } from "react-toastify";

function MyPost() {
    const location = useLocation();
    const isPublished = location.pathname.includes("published");

    const [posts, setPosts] = useState(null);
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data } = useGetPostsMeQuery(
        { page, limit },
        {
            refetchOnFocus: true,
            refetchOnMountOrArgChange: true,
            refetchOnReconnect: true,
        }
    );

    useEffect(() => {
        if (data) {
            setPosts(() => {
                return {
                    drafts: data.data.posts.filter(
                        (post) => post.visibility === "draft"
                    ),
                    published: data.data.posts.filter(
                        (post) => post.visibility === "published"
                    ),
                };
            });
        }
    }, [data]);

    console.log(posts);

    const [deletePost] = useDeletePostMutation();

    const handleRemove = async (id) => {
        if (!posts) return;
        const name = isPublished ? "published" : "drafts";
        try {
            await deletePost(id).unwrap();
            setPosts((prev) => ({
                ...prev,
                [name]: prev[name].filter((post) => post.id !== id),
            }));
            toast.success("Xóa bài viết thành công");
        } catch (error) {
            console.error(error);
            toast.error("Xóa bài viết thất bại");
        }
    };
    return (
        <ParentCard>
            <div className={styles.top}>
                <h1 className={styles.heading}>Bài viết nổi bật</h1>
            </div>

            <div className={styles.body}>
                <div className={"row"}>
                    <div className="col col-8 col-xxl-8 col-lg-12">
                        <div>
                            <div className={styles.wrapper}>
                                <ul className={styles.tabs}>
                                    <li>
                                        <Button
                                            className={
                                                !isPublished && styles.active
                                            }
                                            to="/me/posts/"
                                        >
                                            Bản nháp{" "}
                                            {posts?.drafts.length > 0 &&
                                                `(${posts?.drafts.length})`}
                                        </Button>
                                    </li>
                                    <li>
                                        <Button
                                            className={
                                                isPublished && styles.active
                                            }
                                            to="/me/posts/published"
                                        >
                                            Đã xuất bản{" "}
                                            {posts?.published.length > 0 &&
                                                `(${posts?.published.length})`}
                                        </Button>
                                    </li>
                                </ul>
                                <div className={styles.divider}></div>
                            </div>
                            <div className={styles.postLists}>
                                {isPublished
                                    ? posts?.published.map((post) => {
                                          return (
                                              <PostItem
                                                  removePost={handleRemove}
                                                  key={post.id}
                                                  post={post}
                                                  isPublished={isPublished}
                                              />
                                          );
                                      })
                                    : posts?.drafts?.map((post) => {
                                          return (
                                              <PostItem
                                                  removePost={handleRemove}
                                                  key={post.id}
                                                  post={post}
                                              />
                                          );
                                      })}
                            </div>

                            {isPublished
                                ? posts?.published.length <= 0 && (
                                      <div className={styles.noResult}>
                                          <p>Chưa có bản nháp nào.</p>
                                          <p>
                                              Bạn có thể{" "}
                                              <a href="/new-post">
                                                  viết bài mới
                                              </a>{" "}
                                              hoặc{" "}
                                              <a href="/blog">đọc bài viết</a>{" "}
                                              khác trên F8 nhé.
                                          </p>
                                      </div>
                                  )
                                : posts?.drafts.length <= 0 && (
                                      <div className={styles.noResult}>
                                          <p>Chưa có bản nháp nào.</p>
                                          <p>
                                              Bạn có thể{" "}
                                              <a href="/new-post">
                                                  viết bài mới
                                              </a>{" "}
                                              hoặc{" "}
                                              <a href="/blog">đọc bài viết</a>{" "}
                                              khác trên F8 nhé.
                                          </p>
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

export default MyPost;
