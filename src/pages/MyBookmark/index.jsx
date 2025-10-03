import styles from "./MyBookmark.module.scss";
import ParentCard from "@/components/ParentCard";
import Banner from "@/components/Banner";
import Button from "@/components/Button";
import { useState } from "react";
import PostItem from "@/components/PostItem";

const myBookmark = {
    data: [
        {
            id: 1,
            title: "oke hê",
            slug: "oke hê",
            createdAt: "2025-10-01T06:23:38.000000Z",
            updatedAt: "2025-10-01T06:23:38.000000Z",
            readAt: "2p",
            bookmarkAt: "2025-10-01T06:23:38.000000Z",
            publishAt: null,
        },
        {
            id: 2,

            title: "oke hê 2",
            slug: "oke hê",
            createdAt: "2025-10-01T06:23:38.000000Z",
            updatedAt: "2025-10-01T06:23:38.000000Z",
            readAt: "2p",
            bookmarkAt: "2025-10-01T06:23:38.000000Z",
            publishAt: null,
        },
        {
            id: 4,

            title: "oke hê 3",
            slug: "oke hê",
            createdAt: "2025-10-01T06:23:38.000000Z",
            updatedAt: "2025-10-01T06:23:38.000000Z",
            readAt: "2p",
            bookmarkAt: "2025-10-01T06:23:38.000000Z",
            publishAt: null,
        },
        {
            id: 5,

            title: "oke hê 4",
            slug: "oke hê",
            createdAt: "2025-10-01T06:23:38.000000Z",
            updatedAt: "2025-10-01T06:23:38.000000Z",
            readAt: "2p",
            bookmarkAt: "2025-10-01T06:23:38.000000Z",
            publishAt: null,
        },
        {
            id: 6,

            title: "oke hê 5",
            slug: "oke hê",
            createdAt: "2025-10-01T06:23:38.000000Z",
            updatedAt: "2025-10-01T06:23:38.000000Z",
            readAt: "2p",
            bookmarkAt: "2025-10-01T06:23:38.000000Z",
            publishAt: null,
        },
        {
            id: 7,

            title: "oke hê 6",
            slug: "oke hê",
            createdAt: "2025-10-01T06:23:38.000000Z",
            updatedAt: "2025-10-01T06:23:38.000000Z",
            readAt: "2p",
            bookmarkAt: "2025-10-01T06:23:38.000000Z",
            publishAt: null,
        },
    ],
};
function MyBookmark() {
    const [posts, setPosts] = useState(myBookmark);

    const handleRemove = (id) => {
        setPosts((prev) => {
            return {
                ...prev,
                data: prev.data.filter((post) => post.id !== id),
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
                                            className={styles.active}
                                            to="/me/posts/published"
                                        >
                                            Bài viết {`(${posts.data.length})`}
                                        </Button>
                                    </li>
                                </ul>
                                <div className={styles.divider}></div>
                            </div>
                            <div className={styles.postLists}>
                                {posts.data.map((post) => (
                                    <PostItem
                                        removePost={handleRemove}
                                        key={post.id}
                                        post={post}
                                        type="myBookmark"
                                    />
                                ))}
                            </div>
                            {posts.data.length <= 0 && (
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
