import { useLocation } from "react-router-dom";

import styles from "./LearningItem.module.scss";
import useApi from "@/hook/useApi";
import LearningCourseItem from "./LearningCourseItem";

import Banner from "@/components/Banner";

function LearningItem() {
    const location = useLocation();

    const coursePro = useApi("/pro");
    const courseFree = useApi("/free");
    const courseFull = [...courseFree, ...coursePro];

    return (
        <div className={styles.parent}>
            <div className="container-fluid">
                <div className={styles.container}>
                    <div className={styles.top}>
                        <h1 className={styles.heading}>Lộ trình học</h1>
                        <div className={`${styles.desc} ${styles.warp}`}>
                            <p>
                                Hầu hết các websites hoặc ứng dụng di động đều
                                có 2 phần là Front-end và Back-end. Front-end là
                                phần giao diện người dùng nhìn thấy và có thể
                                tương tác, đó chính là các ứng dụng mobile hay
                                những website bạn đã từng sử dụng. Vì vậy, nhiệm
                                vụ của lập trình viên Front-end là xây dựng các
                                giao diện đẹp, dễ sử dụng và tối ưu trải nghiệm
                                người dùng.
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
                                Dưới đây là các khóa học F8 đã tạo ra dành cho
                                bất cứ ai theo đuổi sự nghiệp trở thành một lập
                                trình viên Front-end.
                            </p>

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
                                <LearningCourseItem />
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
