import React from "react";

import styles from "./Roadmap.module.scss";
import Button from "@/components/Button";
import CtaItem from "../CtaItem";
import useApi from "@/hook/useApi";

function Roadmap({ type }) {
    const frontend = useApi("/frontend");
    const backend = useApi("/backend");

    const cta = type === "frontEnd" ? frontend : backend;
    const imgs =
        type === "frontEnd"
            ? "https://files.fullstack.edu.vn/f8-prod/learning-paths/2/63b4642136f3e.png"
            : "https://files.fullstack.edu.vn/f8-prod/learning-paths/3/63b4641535b16.png";

    return (
        <div className={styles.wrapper}>
            <div className={styles.body}>
                <div className={styles.info}>
                    <h2 className={styles.title}>
                        {type === "frontEnd" ? (
                            <Button to={`/learningItem/front-end-development`}>
                                Lộ trình học Front-end
                            </Button>
                        ) : (
                            <Button to={`/learningItem/back-end-development`}>
                                Lộ trình học Back-end
                            </Button>
                        )}
                    </h2>

                    <p className={styles.desc}>
                        {type === "frontEnd"
                            ? "Lập trình viên Front-end là người xây dựng ra giao diện websites. Trong phần này F8 sẽ chia sẻ cho bạn lộ trình để trở thành lập trình viên Front-end nhé. "
                            : "Trái với Front-end thì lập trình viên Back-end là người làm việc với dữ liệu, công việc thường nặng tính logic hơn. Chúng ta sẽ cùng tìm hiểu thêm về lộ trình học Back-end nhé."}
                    </p>
                </div>
                <div className={styles.thumb}>
                    <Button
                        to={
                            type === "frontEnd"
                                ? "/learning-paths/front-end-development"
                                : "/learning-paths/back-end-development"
                        }
                        className={styles.thumbRound}
                    >
                        <img src={imgs} alt={type} />
                    </Button>
                </div>
            </div>

            <div className={styles.cta}>
                {cta &&
                    cta.map((item, i) => (
                        <CtaItem key={i} to={item.tp} src={item.src} />
                    ))}
            </div>

            <div>
                <Button
                    to={
                        type === "frontEnd"
                            ? "/learning-paths/front-end-development"
                            : "/learning-paths/back-end-development"
                    }
                    rounded
                    primary
                    size="medium"
                    className={`${styles.wrapBtn}`}
                >
                    <span className={styles.inner}>XEM CHI TIẾT</span>
                </Button>
            </div>
        </div>
    );
}

export default Roadmap;
