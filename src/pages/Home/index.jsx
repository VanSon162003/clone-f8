import useApi from "@/hook/useApi";
import styles from "./Home.module.scss";
import Section from "@/components/Section";

function Home() {
    const coursePro = useApi("/pro");
    const courseFree = useApi("/free");
    const courseArticle = useApi("/article");
    const courseVideo = useApi("/video");
    return (
        <div className={styles.wrapper}>
            <Section
                courseType="pro"
                courseList={coursePro}
                heading={"Khoá học Pro"}
            />

            <Section
                courseType="free"
                courseList={courseFree}
                heading={"Khoá học Free"}
                path={"/learning-paths"}
                titleViewAll="Xem lộ trình"
            />

            <Section
                courseType="article"
                courseList={courseArticle}
                heading={"Bài viết nổi bật"}
                path={"/blog"}
                titleViewAll="Xem tất cả"
            />

            <Section
                courseType="video"
                courseList={courseVideo}
                heading={"Videos nổi bật"}
                path={"https://www.youtube.com/c/F8VNOfficial/videos"}
                titleViewAll="Xem tất cả"
            />
        </div>
    );
}

export default Home;
