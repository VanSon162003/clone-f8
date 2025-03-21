import React, { useEffect, useState } from "react";
import styles from "./SlideBar.module.scss";
import { NavLink } from "react-router-dom";

function SlideBar() {
    const [active, setActive] = useState("/");

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

    return (
        <div className={styles.slide}>
            <div className={styles.wrapper}>
                <ul className={styles.list} onClick={handleClickSlideBar}>
                    <li>
                        <NavLink
                            className={`${styles.itemBtn} ${
                                active === "/" ? styles.active : ""
                            }`}
                            to="/"
                            aria-current="page"
                        >
                            <svg
                                aria-hidden="true"
                                focusable="false"
                                data-prefix="fas"
                                data-icon="house"
                                role="img"
                                xmlns="http://www.w3.org/2000/svg"
                                className="svg-inline--fa fa-newspaper "
                                viewBox="0 0 576 512"
                            >
                                <path
                                    fill="currentColor"
                                    d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
                                ></path>
                            </svg>
                            <span>Trang chủ</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            className={`${styles.itemBtn} ${
                                active === "/learning-paths"
                                    ? styles.active
                                    : ""
                            }`}
                            to="/learning-paths"
                        >
                            <svg
                                aria-hidden="true"
                                focusable="false"
                                data-prefix="fas"
                                data-icon="road"
                                role="img"
                                xmlns="http://www.w3.org/2000/svg"
                                className="svg-inline--fa fa-newspaper "
                                viewBox="0 0 576 512"
                            >
                                <path
                                    fill="currentColor"
                                    d="M256 32H181.2c-27.1 0-51.3 17.1-60.3 42.6L3.1 407.2C1.1 413 0 419.2 0 425.4C0 455.5 24.5 480 54.6 480H256V416c0-17.7 14.3-32 32-32s32 14.3 32 32v64H521.4c30.2 0 54.6-24.5 54.6-54.6c0-6.2-1.1-12.4-3.1-18.2L455.1 74.6C446 49.1 421.9 32 394.8 32H320V96c0 17.7-14.3 32-32 32s-32-14.3-32-32V32zm64 192v64c0 17.7-14.3 32-32 32s-32-14.3-32-32V224c0-17.7 14.3-32 32-32s32 14.3 32 32z"
                                ></path>
                            </svg>
                            <span>Lộ trình</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            className={`${styles.itemBtn} ${
                                active === "/blog" ? styles.active : ""
                            }`}
                            to="/blog"
                        >
                            <svg
                                aria-hidden="true"
                                focusable="false"
                                data-prefix="fas"
                                data-icon="newspaper"
                                className="svg-inline--fa fa-newspaper "
                                role="img"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                            >
                                <path
                                    fill="currentColor"
                                    d="M96 96c0-35.3 28.7-64 64-64H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H80c-44.2 0-80-35.8-80-80V128c0-17.7 14.3-32 32-32s32 14.3 32 32V400c0 8.8 7.2 16 16 16s16-7.2 16-16V96zm64 24v80c0 13.3 10.7 24 24 24H296c13.3 0 24-10.7 24-24V120c0-13.3-10.7-24-24-24H184c-13.3 0-24 10.7-24 24zm208-8c0 8.8 7.2 16 16 16h48c8.8 0 16-7.2 16-16s-7.2-16-16-16H384c-8.8 0-16 7.2-16 16zm0 96c0 8.8 7.2 16 16 16h48c8.8 0 16-7.2 16-16s-7.2-16-16-16H384c-8.8 0-16 7.2-16 16zM160 304c0 8.8 7.2 16 16 16H432c8.8 0 16-7.2 16-16s-7.2-16-16-16H176c-8.8 0-16 7.2-16 16zm0 96c0 8.8 7.2 16 16 16H432c8.8 0 16-7.2 16-16s-7.2-16-16-16H176c-8.8 0-16 7.2-16 16z"
                                ></path>
                            </svg>
                            <span>Bài viết</span>
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default SlideBar;
