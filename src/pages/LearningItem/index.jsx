import { useLocation, useParams } from "react-router-dom";

import styles from "./LearningItem.module.scss";
import useApi from "@/hook/useApi";
import LearningCourseItem from "./components/LearningCourseItem";

import Banner from "@/components/Banner";
import LearningCourseSection from "./components/LearningCourseSection";

function LearningItem() {
    const params = useParams();
    console.log(params);

    const frontend = useApi("/frontend");
    const backend = useApi("/backend");

    console.log(backend);

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
                                <LearningCourseSection
                                    header={"1. Tìm hiểu về ngành IT"}
                                    desc={
                                        "Để theo ngành IT - Phần mềm cần rèn luyện những kỹ năng nào? Bạn đã có sẵn tố chất phù hợp với ngành chưa? Cùng thăm quan các công ty IT và tìm hiểu về văn hóa, tác phong làm việc của ngành này nhé các bạn."
                                    }
                                >
                                    <LearningCourseItem
                                        courseItem={frontend[0]}
                                    />
                                </LearningCourseSection>

                                <LearningCourseSection
                                    header={"2. HTML và CSS"}
                                    desc={`Để học web Front-end chúng ta luôn bắt đầu với ngôn ngữ HTML và CSS, đây là 2 ngôn ngữ có mặt trong mọi website trên internet. Trong khóa học này F8 sẽ chia sẻ từ những kiến thức cơ bản nhất. Sau khóa học này bạn sẽ tự làm được 2 giao diện websites là The Band và Shopee.

`}
                                >
                                    <LearningCourseItem
                                        courseItem={frontend[1]}
                                    />

                                    {params.nameCourse ===
                                    "front-end-development" ? (
                                        <LearningCourseItem
                                            courseItem={frontend[2]}
                                        />
                                    ) : (
                                        ""
                                    )}
                                </LearningCourseSection>

                                <LearningCourseSection
                                    header={"3. JavaScript"}
                                    desc={`Với HTML, CSS bạn mới chỉ xây dựng được các websites tĩnh, chỉ bao gồm phần giao diện và gần như chưa có xử lý tương tác gì. Để thêm nhiều chức năng phong phú và tăng tính tương tác cho website bạn cần học Javascript.

`}
                                >
                                    <LearningCourseItem
                                        courseItem={frontend[3]}
                                    />

                                    <LearningCourseItem
                                        courseItem={frontend[4]}
                                    />
                                </LearningCourseSection>

                                <LearningCourseSection
                                    header={"4. Sử dụng Ubuntu/Linux"}
                                    desc={
                                        "Cách làm việc với hệ điều hành Ubuntu/Linux qua Windows Terminal & WSL. Khi đi làm, nhiều trường hợp bạn cần nắm vững các dòng lệnh cơ bản của Ubuntu/Linux."
                                    }
                                >
                                    <LearningCourseItem
                                        courseItem={frontend[5]}
                                    />
                                </LearningCourseSection>

                                {params.nameCourse ===
                                "front-end-development" ? (
                                    <LearningCourseSection
                                        header={"5. Libraries and Frameworks"}
                                        desc={
                                            "Một websites hay ứng dụng hiện đại rất phức tạp, chỉ sử dụng HTML, CSS, Javascript theo cách code thuần (tự code từ đầu tới cuối) sẽ rất khó khăn. Vì vậy các Libraries, Frameworks ra đời nhằm đơn giản hóa, tiết kiệm chi phí và thời gian để hoàn thành một sản phẩm website hoặc ứng dụng mobile."
                                        }
                                    >
                                        <LearningCourseItem
                                            courseItem={frontend[6]}
                                        />
                                    </LearningCourseSection>
                                ) : (
                                    <LearningCourseSection
                                        header={"5. Libraries and Frameworks"}
                                        desc={
                                            "Một ứng dụng Back-end hiện đại có thể rất phức tạp, việc sử dụng code thuần (tự tay code từ đầu) không phải là một lựa chọn tốt. Vì vậy các Libraries và Frameworks ra đời nhằm đơn giản hóa, tiết kiệm thời gian và tiền bạc để nhanh chóng tạo ra được sản phẩm cuối cùng."
                                        }
                                    >
                                        <LearningCourseItem
                                            courseItem={backend[5]}
                                        />
                                    </LearningCourseSection>
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
