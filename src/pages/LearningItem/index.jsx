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
                        <h1 className={styles.heading}>{lp.title}</h1>
                        <div className={`${styles.desc} ${styles.warp}`}>
                            <p>{lp.description}</p>
                        </div>
                    </div>

                    <div className={styles.body}>
                        <section className={styles.row}>
                            <section className={`${styles.col} ${styles.col8}`}>
                                {courses.length > 0 ? (
                                    courses.map((c, index) => (
                                        <LearningCourseSection
                                            key={c.id}
                                            header={`${index + 1}. ${c.title}`}
                                            desc={c.description}
                                        >
                                            <LearningCourseItem
                                                courseItem={c}
                                            />
                                        </LearningCourseSection>
                                    ))
                                ) : (
                                    <p>
                                        Không có khóa học nào trong learning
                                        path này.
                                    </p>
                                )}
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
