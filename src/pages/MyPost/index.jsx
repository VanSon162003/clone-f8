import styles from "./MyPost.module.scss";
import ParentCard from "@/components/ParentCard";
import Banner from "@/components/Banner";
import Button from "@/components/Button";
import { useLocation } from "react-router-dom";
import PostItem from "./components/PostItem";
import { useState } from "react";

const myPost = {
    drafts: {
        data: [
            {
                id: 1,
                title: "oke hê",
                createdAt: "2025-10-01T06:23:38.000000Z",
                updatedAt: "2025-10-01T06:23:38.000000Z",
                readAt: "2p",
                publishAt: null,
            },
            {
                id: 2,

                title: "oke hê 2",
                createdAt: "2025-10-01T06:23:38.000000Z",
                updatedAt: "2025-10-01T06:23:38.000000Z",
                readAt: "2p",
                publishAt: null,
            },
            {
                id: 4,

                title: "oke hê 3",
                createdAt: "2025-10-01T06:23:38.000000Z",
                updatedAt: "2025-10-01T06:23:38.000000Z",
                readAt: "2p",
                publishAt: null,
            },
            {
                id: 5,

                title: "oke hê 4",
                createdAt: "2025-10-01T06:23:38.000000Z",
                updatedAt: "2025-10-01T06:23:38.000000Z",
                readAt: "2p",
                publishAt: null,
            },
            {
                id: 6,

                title: "oke hê 5",
                createdAt: "2025-10-01T06:23:38.000000Z",
                updatedAt: "2025-10-01T06:23:38.000000Z",
                readAt: "2p",
                publishAt: null,
            },
            {
                id: 7,

                title: "oke hê 6",
                createdAt: "2025-10-01T06:23:38.000000Z",
                updatedAt: "2025-10-01T06:23:38.000000Z",
                readAt: "2p",
                publishAt: null,
            },
        ],
        currentPage: 1,
        lastPage: 1,
        perPage: 200,
        total: 0,
    },
    published: {
        data: [
            {
                id: 8,

                title: "oke hê 9",
                slug: "tite",
                createdAt: "2025-10-01T06:23:38.000000Z",
                updatedAt: "2025-10-01T06:23:38.000000Z",
                readAt: "2p",
                publishAt: "2025-10-01T06:23:38.000000Z",
            },
        ],

        currentPage: 1,
        lastPage: 1,
        perPage: 200,
        total: 0,
    },
};
function MyPost() {
    const location = useLocation();
    const isPublished = location.pathname.includes("published");

    const [posts, setPosts] = useState(myPost);

    const handleRemove = (id) => {
        const name = isPublished ? "published" : "drafts";
        setPosts((prev) => {
            return {
                ...prev,
                [name]: {
                    ...prev[name],
                    data: prev[name].data.filter((post) => post.id !== id),
                },
            };
        });
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
                                            {posts.drafts.data.length > 0 &&
                                                `(${posts.drafts.data.length})`}
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
                                            {posts.published.data.length > 0 &&
                                                `(${posts.published.data.length})`}
                                        </Button>
                                    </li>
                                </ul>
                                <div className={styles.divider}></div>
                            </div>
                            <div className={styles.postLists}>
                                {isPublished
                                    ? posts.published.data.map((post) => {
                                          return (
                                              <PostItem
                                                  removePost={handleRemove}
                                                  key={post.id}
                                                  post={post}
                                                  isPublished={isPublished}
                                              />
                                          );
                                      })
                                    : posts.drafts.data.map((post) => {
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
                                ? posts.published.data.length <= 0 && (
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
                                : posts.drafts.data.length <= 0 && (
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
