import React, { useMemo } from "react";

import styles from "./Roadmap.module.scss";
import Button from "@/components/Button";
import CtaItem from "../CtaItem";
import { useDispatch } from "react-redux";
import { setHeaderBack } from "@/features/auth/headerSlice";
import { useListLearningPathsQuery } from "@/services/learningPathsService";

function Roadmap({ type }) {
    const { data: lpRes } = useListLearningPathsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });
    const learningPaths = lpRes?.data || [];

    // Chọn learning-path phù hợp theo slug quy ước
    const selected = useMemo(() => {
        if (!learningPaths.length) return null;
        const targetSlug =
            type === "frontEnd"
                ? "front-end-development"
                : "back-end-development";
        return (
            learningPaths.find((lp) => lp.slug === targetSlug) ||
            learningPaths.find((lp) =>
                type === "frontEnd" ? lp.slug?.includes("front") : lp.slug?.includes("back")
            ) || null
        );
    }, [learningPaths, type]);

    const link = selected ? `/learning-paths/${selected.slug}` : "#";

    const imgs = selected?.thumbnail ||
        (type === "frontEnd"
            ? "https://files.fullstack.edu.vn/f8-prod/learning-paths/2/63b4642136f3e.png"
            : "https://files.fullstack.edu.vn/f8-prod/learning-paths/3/63b4641535b16.png");

    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch(setHeaderBack(true));
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.body}>
                <div className={styles.info}>
                    <h2 className={styles.title}>
                        <Button onClick={handleClick} to={link}>
                            {selected?.title || (type === "frontEnd" ? "Lộ trình học Front-end" : "Lộ trình học Back-end")}
                        </Button>
                    </h2>

                    <p className={styles.desc}>
                        {selected?.description || (type === "frontEnd"
                            ? "Lập trình viên Front-end là người xây dựng ra giao diện websites. Trong phần này F8 sẽ chia sẻ cho bạn lộ trình để trở thành lập trình viên Front-end nhé. "
                            : "Trái với Front-end thì lập trình viên Back-end là người làm việc với dữ liệu, công việc thường nặng tính logic hơn. Chúng ta sẽ cùng tìm hiểu thêm về lộ trình học Back-end nhé.")}
                    </p>
                </div>
                <div className={styles.thumb}>
                    <Button
                        onClick={handleClick}
                        to={link}
                        className={styles.thumbRound}
                    >
                        <img src={imgs} alt={selected?.title || type} />
                    </Button>
                </div>
            </div>

            {/* CTA có thể lấy từ server nếu cần trong tương lai */}

            <div>
                <Button
                    onClick={handleClick}
                    to={link}
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
