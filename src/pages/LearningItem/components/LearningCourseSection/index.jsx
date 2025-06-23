import React from "react";
import styles from "./LearningCourseSection.module.scss";
import Button from "@/components/Button";

function LearningCourseSection({ children, header, desc }) {
    const courses = React.Children.toArray(children);

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>{header}</h2>
            <p className={styles.desc}>{desc}</p>

            {courses.map((course, i) => {
                if (typeof course === "string") return;

                return (
                    <div key={i} className={styles.wrap}>
                        <div className={styles.inner}>
                            <div className={styles.thumb}>
                                <a href={course.props?.courseItem?.to}>
                                    <img
                                        src={course.props?.courseItem?.img}
                                        alt={course.props?.courseItem?.to}
                                    />
                                </a>
                            </div>

                            <div className={styles.info}>
                                <h2 className={styles.subTitle}>
                                    <a href={course.props?.courseItem?.to}>
                                        {course.props?.courseItem?.title}
                                    </a>
                                </h2>
                                <div className={styles.price}>
                                    {course.props?.courseItem?.oldPrice ? (
                                        <>
                                            <span className={styles.oldPrice}>
                                                {
                                                    course.props?.courseItem
                                                        ?.oldPrice
                                                }
                                            </span>
                                            <span className={styles.mainPrice}>
                                                {
                                                    course.props?.courseItem
                                                        ?.mainPrice
                                                }
                                            </span>
                                        </>
                                    ) : (
                                        <span className={styles.freeTitle}>
                                            {
                                                course.props?.courseItem
                                                    ?.mainPrice
                                            }
                                        </span>
                                    )}
                                </div>

                                <p className={styles.subDesc}>
                                    {course.props?.courseItem?.desc}
                                </p>

                                <Button
                                    href={course.props?.courseItem?.to}
                                    rounded
                                    primary
                                    size="medium"
                                    className={`${styles.wrapBtn}`}
                                >
                                    <span className={styles.inner}>
                                        XEM KHOÁ HỌC
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default LearningCourseSection;
