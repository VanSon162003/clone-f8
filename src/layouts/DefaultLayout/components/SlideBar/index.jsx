import React, { useEffect, useState } from "react";
import styles from "./SlideBar.module.scss";
import { NavLink, useLocation } from "react-router-dom";
import Button from "@/components/Button";
import {
    faComment,
    faComments,
    faHouse,
    faNewspaper,
    faRoad,
} from "@fortawesome/free-solid-svg-icons";
import useCurrentUser from "@/hook/useCurrentUser";
import { useSelector } from "react-redux";

function SlideBar() {
    const location = useLocation();

    const [active, setActive] = useState(location.pathname);

    const { user } = useCurrentUser();

    const handleClickSlideBar = (e) => {
        function getParent(element, selector) {
            while (element.parentElement) {
                if (element.parentElement.matches(selector)) {
                    return element.parentElement;
                }
                element = element.parentElement;
            }
            return null;
        }

        let linkTag = e.target.closest("a") || getParent(e.target, "a");

        if (linkTag) {
            setActive(linkTag.getAttribute("href"));
        }
    };

    const handleClickComment = (e) => {
        e.preventDefault();
    };

    const slideBack = useSelector((state) => state.header.slideBack);

    console.log(slideBack);

    return (
        <div className={`${styles.slide} ${slideBack ? styles.hidden : ""}`}>
            <div className={styles.wrapper}>
                <ul className={styles.list} onClick={handleClickSlideBar}>
                    <li>
                        <Button
                            className={`${styles.itemBtn} ${
                                active === "/" ? styles.active : ""
                            }`}
                            to="/"
                            icon={faHouse}
                        >
                            <span>Trang chủ</span>
                        </Button>
                    </li>

                    <li>
                        <Button
                            className={`${styles.itemBtn} ${
                                active === "/learning-paths"
                                    ? styles.active
                                    : ""
                            }`}
                            to="/learning-paths"
                            icon={faRoad}
                        >
                            <span>Lộ trình</span>
                        </Button>
                    </li>

                    <li>
                        <Button
                            className={`${styles.itemBtn} ${
                                active === "/blog" ? styles.active : ""
                            }`}
                            to="/blog"
                            icon={faNewspaper}
                        >
                            <span>Bài viết</span>
                        </Button>
                    </li>

                    {user && (
                        <li>
                            <Button
                                className={`${styles.itemBtn} ${
                                    active === "/comment" ? styles.active : ""
                                }`}
                                icon={faComments}
                                onClick={handleClickComment}
                            >
                                <span>Hỏi đáp</span>
                            </Button>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default SlideBar;
