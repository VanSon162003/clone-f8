import Button from "@/components/Button";
import styles from "./BlogItem.module.scss";
import Avatar from "@/components/Avatar";
import Actions from "@/components/Actions";
import { timeAgo } from "@/utils/timeAgo";

function BlogItem() {
    const mockUser = {
        id: 1,
        fullName: "Nguyễn Văn Sơn",
        avatar: "/src/assets/imgs/user.jpg",
        username: "son1",
    };

    const mockBlog = {
        id: 1,
        title: "TRẢI NGHIỆM HỌC THỬ REACT NATIVE, DEVOPS, C++ VÔ CÙNG CHẤT LƯỢNG CÙNG F8",
        description:
            "Để giúp học viên mới cảm nhận rõ ràng chất lượng giảng dạy, F8 đã xây dựng 3 lớp học thử: C++, React Native và DevOps với lộ trình rõ ràng.",
        tags: ["React Native"],
        thumbnail: "/src/assets/imgs/banner_html.png",
        slug: "/blog/ok-chua",
        readAt: "2p",
        createdAt: "2022-07-01T07:41:35.000000Z",
        updatedAt: "2022-07-01T07:41:35.000000Z",
    };

    const renderBlogItem = (index) => {
        return (
            <div key={index} className={styles.wrapper}>
                <div className={styles.header}>
                    <div className={styles.author}>
                        <Button href={`/@${mockUser.username}`}>
                            <Avatar
                                fontSize={"0.29rem"}
                                avatar={mockUser.avatar}
                            />
                        </Button>
                        <Button href={`/@${mockUser.username}`}>
                            <span>{mockUser.fullName}</span>
                        </Button>
                    </div>

                    <Actions />
                </div>

                <div className={styles.body}>
                    <div className={styles.info}>
                        <a href={mockBlog.slug}>
                            <h2 className={styles.title}>{mockBlog.title}</h2>
                        </a>
                        <p className={styles.desc}>{mockBlog.description}</p>
                        <div className={styles.metaInfo}>
                            {mockBlog.tags.map((tag, i) => (
                                <a className={styles.tag} key={i}>
                                    {tag}
                                </a>
                            ))}
                            <span>{timeAgo(mockBlog.createdAt)}</span>
                            <div className={styles.dot}>·</div>
                            {mockBlog.readAt}
                        </div>
                    </div>

                    <div className={`${styles.thumbnail} d-xl-none`}>
                        <a href={mockBlog.slug}>
                            <img src={mockBlog.thumbnail} alt="" />
                        </a>
                    </div>
                </div>
            </div>
        );
    };

    return <>{[0, 1].map((index) => renderBlogItem(index))}</>;
}

export default BlogItem;
