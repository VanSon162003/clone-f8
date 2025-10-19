import styles from "./Home.module.scss";
import Section from "@/components/Section";
import CustomSlideshow from "@/components/SlideShow";
import {
    useGetAllCoursesQuery,
    useGetAllCoursesVideoQuery,
} from "@/services/coursesService";
import { useGetPopularPostsQuery } from "@/services/postsService";
import { useEffect, useState } from "react";

function Home() {
    const [coursePro, setCoursePro] = useState([]);
    const [courseFree, setCourseFree] = useState([]);
    const [courseArticle, setCourseArticle] = useState([]);
    const [courseVideo, setCourseVideo] = useState([]);

    const { data: responseData, isSuccess } = useGetAllCoursesQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const popularPosts = useGetPopularPostsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const videoData = useGetAllCoursesVideoQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    useEffect(() => {
        const data = responseData?.data || [];

        if (isSuccess) {
            setCoursePro(data.filter((course) => course.is_pro));
            setCourseFree(data.filter((course) => !course.is_pro));
        }

        if (popularPosts.isSuccess && popularPosts.data?.data?.posts) {
            setCourseArticle(popularPosts.data.data.posts);
        }

        if (videoData.isSuccess) {
            setCourseVideo(videoData.data.data);
        }
    }, [responseData, videoData, popularPosts, isSuccess]);

    return (
        <div className={styles.parent}>
            <div className="container-fluid">
                <div className="container ">
                    <CustomSlideshow />
                </div>
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
            </div>
        </div>
    );
}

export default Home;
