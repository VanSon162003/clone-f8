import { useParams } from "react-router-dom";
import { useMemo } from "react";

import styles from "./LearningItem.module.scss";
import { useGetLearningPathBySlugQuery } from "@/services/learningPathsService";
import LearningCourseItem from "./components/LearningCourseItem";

import Banner from "@/components/Banner";
import LearningCourseSection from "./components/LearningCourseSection";

function LearningItem() {
    const params = useParams();

    const slug = params.nameCourse;
    const {
        data: lpRes,
        isSuccess,
        isLoading,
        error,
    } = useGetLearningPathBySlugQuery(slug, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });
    const lp = lpRes?.data;
    const courses = useMemo(() => lp?.courses || [], [lp]);

    // Loading state
    if (isLoading) {
        return (
            <div className={styles.parent}>
                <div className="container-fluid">
                    <div className={styles.container}>
                        <div className={styles.top}>
                            <h1 className={styles.heading}>Đang tải...</h1>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className={styles.parent}>
                <div className="container-fluid">
                    <div className={styles.container}>
                        <div className={styles.top}>
                            <h1 className={styles.heading}>Có lỗi xảy ra</h1>
                            <p>
                                Không thể tải dữ liệu learning path. Vui lòng
                                thử lại sau.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // No data state
    if (!isSuccess || !lp || !courses.length) {
        return (
            <div className={styles.parent}>
                <div className="container-fluid">
                    <div className={styles.container}>
                        <div className={styles.top}>
                            <h1 className={styles.heading}>Không có dữ liệu</h1>
                            <p>
                                Learning path không tồn tại hoặc chưa có khóa
                                học nào.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.parent}>
            <div className="container-fluid">
                <div className={styles.container}>
                    <div className={styles.top}>
                        <h1 className={styles.heading}>Lộ trình học</h1>
                        <div className={`${styles.desc} ${styles.warp}`}>
                            {params.nameCourse === "front-end-development" ? (
                                <>
                                    <p>
                                        Hầu hết các websites hoặc ứng dụng di
                                        động đều có 2 phần là Front-end và
                                        Back-end. Front-end là phần giao diện
                                        người dùng nhìn thấy và có thể tương
                                        tác, đó chính là các ứng dụng mobile hay
                                        những website bạn đã từng sử dụng. Vì
                                        vậy, nhiệm vụ của lập trình viên
                                        Front-end là xây dựng các giao diện đẹp,
                                        dễ sử dụng và tối ưu trải nghiệm người
                                        dùng.
                                    </p>

                                    <p>
                                        Tại Việt Nam,{" "}
                                        <strong>
                                            {" "}
                                            <a href="https://bit.ly/3p40c2D">
                                                lương trung bình{" "}
                                            </a>
                                        </strong>
                                        cho lập trình viên front-end vào khoảng{" "}
                                        <strong>16.000.000đ</strong>/ tháng.
                                    </p>

                                    <p>
                                        Dưới đây là các khóa học F8 đã tạo ra
                                        dành cho bất cứ ai theo đuổi sự nghiệp
                                        trở thành một lập trình viên Front-end.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p>
                                        Back-end là phần xử lý logic nghiệp vụ,
                                        cơ sở dữ liệu, API và các chức năng mà
                                        người dùng không nhìn thấy được. Lập
                                        trình viên Back-end chịu trách nhiệm xây
                                        dựng server, database và các API để hỗ
                                        trợ cho Front-end.
                                    </p>

                                    <p>
                                        Tại Việt Nam,{" "}
                                        <strong>lương trung bình</strong>
                                        cho lập trình viên back-end vào khoảng{" "}
                                        <strong>18.000.000đ</strong>/ tháng.
                                    </p>

                                    <p>
                                        Dưới đây là các khóa học F8 đã tạo ra
                                        dành cho bất cứ ai theo đuổi sự nghiệp
                                        trở thành một lập trình viên Back-end.
                                    </p>
                                </>
                            )}

                            <blockquote>
                                <p>
                                    Các khóa học có thể chưa đầy đủ, F8 vẫn đang
                                    nỗ lực hoàn thiện trong thời gian sớm nhất.
                                </p>
                            </blockquote>
                        </div>
                    </div>

                    <div className={styles.body}>
                        <section className={styles.row}>
                            <section className={`${styles.col} ${styles.col8}`}>
                                <LearningCourseSection
                                    header={
                                        params.nameCourse ===
                                        "front-end-development"
                                            ? "Các khóa học Front-end Development"
                                            : "Các khóa học Back-end Development"
                                    }
                                    desc={
                                        params.nameCourse ===
                                        "front-end-development"
                                            ? "Các khóa học từ cơ bản đến nâng cao để trở thành một lập trình viên Front-end chuyên nghiệp. Từ HTML, CSS, JavaScript đến các framework hiện đại như React, Vue.js."
                                            : "Các khóa học từ cơ bản đến nâng cao để trở thành một lập trình viên Back-end chuyên nghiệp. Từ Node.js, Python, PHP đến các framework và database."
                                    }
                                >
                                    {courses.length > 0 ? (
                                        courses.map((c) => (
                                            <div key={c.id}>
                                                <LearningCourseItem
                                                    courseItem={c}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <p>
                                            Không có khóa học nào trong learning
                                            path này.
                                        </p>
                                    )}
                                </LearningCourseSection>
                            </section>

                            <section className={`${styles.col} ${styles.col4}`}>
                                <Banner />
                            </section>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LearningItem;
