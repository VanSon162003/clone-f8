import React, { useState, useEffect, useRef } from "react";
import Button from "@/components/Button";
import styles from "./Actions.module.scss";
import AccessForm from "../AccessForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

import userImg from "@/assets/imgs/user.jpg";
import proIcon from "@/assets/icons/pro-icon.svg";

function Actions() {
    const [isAccess, setIsAccess] = useState(false);
    const [showSetting, setShowSetting] = useState(false);
    const settingRef = useRef(null);

    const saveAccessType = (type) => {
        localStorage.setItem("access", type);
    };

    const handleClickButton = (type) => {
        setIsAccess(true);
        saveAccessType(type);
    };
    const token = localStorage.getItem("token");

    const handleLogout = async () => {
        if (!token) {
            console.warn("Không tìm thấy token, không thể đăng xuất.");
            return;
        }

        try {
            const res = await fetch(
                "https://api01.f8team.dev/api/auth/logout",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText);
            }

            localStorage.removeItem("token");
            window.top.location.href = "http://localhost:5173/";
        } catch (error) {
            console.error("Đăng xuất thất bại:", error.message);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (settingRef.current && !settingRef.current.contains(e.target)) {
                setShowSetting(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return token ? (
        <div className={styles.actions}>
            <div>
                <button className={styles.myLearn}>Khoá học của tôi</button>
            </div>

            <div>
                <div className={styles.actionBtn}>
                    <FontAwesomeIcon icon={faBell} />
                </div>
            </div>

            <div ref={settingRef}>
                <div
                    className={styles.avatarWrap}
                    onClick={() => setShowSetting(!showSetting)}
                >
                    <div className={styles.avatar}>
                        <img src={userImg} alt="user" />
                        <img className={styles.crown} src={proIcon} alt="" />
                    </div>
                </div>
                {showSetting && (
                    <div className={styles.tippy}>
                        <ul
                            className={`${styles.wrapSetting} ${styles.wrapAnmt}`}
                        >
                            <a href="#" className={styles.user}>
                                <div className={styles.avaSetting}>
                                    <div className={styles.avatar}>
                                        <img src={userImg} alt="user" />
                                        <img
                                            className={styles.crown}
                                            src={proIcon}
                                            alt=""
                                        />
                                    </div>
                                </div>

                                <div className={styles.info}>
                                    <div className={styles.name}>Sơn văn</div>
                                    <div className={styles.useName}>
                                        @sonvan
                                    </div>
                                </div>
                            </a>

                            <hr />

                            <ul className={styles.list}>
                                <li>
                                    <a href="#">Trang cá nhân</a>
                                </li>
                            </ul>

                            <hr />
                            <ul className={styles.list}>
                                <li>
                                    <a href="#">Viết blog</a>
                                </li>

                                <li>
                                    <a href="#">Bài viết của tôi</a>
                                </li>

                                <li>
                                    <a href="#">Bài viết đã lưu</a>
                                </li>
                            </ul>
                            <hr />

                            <ul className={styles.list}>
                                <li>
                                    <a href="#">Cài đặt</a>
                                </li>

                                <li onClick={handleLogout}>
                                    <a href="#">Đăng xuất</a>
                                </li>
                            </ul>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    ) : (
        <div className={styles.actions}>
            <Button
                title={"Đăng ký"}
                type={"text"}
                onClick={() => handleClickButton("register")}
            />
            <Button
                title={"Đăng nhập"}
                type={"primary"}
                onClick={() => handleClickButton("login")}
            />

            {isAccess && <AccessForm setIsAccess={setIsAccess} />}
        </div>
    );
}

export default Actions;
