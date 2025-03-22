import useApi from "@/hook/useApi";
import styles from "./Home.module.scss";
import Course from "@/components/Course";

function Home() {
    const coursePro = useApi("http://localhost:3000/pro");
    const courseFree = useApi("http://localhost:3000/free");
    const courseArticle = useApi("http://localhost:3000/article");
    const courseVideo = useApi("http://localhost:3000/video");
    return (
        <div className={styles.wrapper}>
            <Course
                courseType="pro"
                courseList={coursePro}
                heading={"Khoá học Pro"}
            />

            <Course
                courseType="free"
                courseList={courseFree}
                heading={"Khoá học Free"}
                path={"/learning-paths"}
                titleViewAll="Xem lộ trình"
            />

            <Course
                courseType="article"
                courseList={courseArticle}
                heading={"Bài viết nổi bật"}
                path={"/blog"}
                titleViewAll="Xem tất cả"
            />

            <Course
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
