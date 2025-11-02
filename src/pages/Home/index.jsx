import styles from "./Home.module.scss";
import Section from "@/components/Section";
import CustomSlideshow from "@/components/SlideShow";
import {
    useGetAllCoursesQuery,
    useGetAllCoursesVideoQuery,
} from "@/services/coursesService";
import { useGetPopularPostsQuery } from "@/services/postsService";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Home() {
    const [coursePro, setCoursePro] = useState([]);
    const [courseFree, setCourseFree] = useState([]);
    const [courseArticle, setCourseArticle] = useState([]);
    const [courseVideo, setCourseVideo] = useState([]);

    const currentUser = useSelector((state) => state.auth.currentUser);

    const { data: responseData, isSuccess } = useGetAllCoursesQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    const popularPosts = useGetPopularPostsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    const videoData = useGetAllCoursesVideoQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    useEffect(() => {
        const data = responseData?.data || [];

        if (isSuccess) {
            setCoursePro(data.filter((course) => course.is_pro));
            setCourseFree(data.filter((course) => !course.is_pro));
        }

        if (popularPosts.isSuccess && popularPosts.data?.data?.posts) {
            const postPublish = popularPosts.data.data.posts.filter((post) => {
                if (post?.is_approved) {
                    return true;
                } else {
                    if (post?.user_id === currentUser?.id) return true;
                    return false;
                }
            });

            setCourseArticle(postPublish);
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
                    {coursePro?.length > 0 && (
                        <Section
                            courseType="pro"
                            courseList={coursePro}
                            heading={"Khoá học Pro"}
                        />
                    )}

                    {courseFree?.length > 0 && (
                        <Section
                            courseType="free"
                            courseList={courseFree}
                            heading={"Khoá học Free"}
                            path={"/learning-paths"}
                            titleViewAll="Xem lộ trình"
                        />
                    )}

                    {courseArticle?.length > 0 && (
                        <Section
                            courseType="article"
                            courseList={courseArticle}
                            heading={"Bài viết nổi bật"}
                            path={"/blog"}
                            titleViewAll="Xem tất cả"
                        />
                    )}

                    {courseVideo?.length > 0 && (
                        <Section
                            courseType="video"
                            courseList={courseVideo}
                            heading={"Videos nổi bật"}
                            path={
                                "https://www.youtube.com/c/F8VNOfficial/videos"
                            }
                            titleViewAll="Xem tất cả"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
