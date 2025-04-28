import { useState, useEffect, useRef } from "react";
import Button from "@/components/Button";
import styles from "./Actions.module.scss";
import AccessForm from "../AccessForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

import userImg from "@/assets/imgs/user.jpg";
import proIcon from "@/assets/icons/pro-icon.svg";
import { Link } from "react-router-dom";
import useCurrentUser from "@/hook/useCurrentUser";
import { useDispatch } from "react-redux";
import { logoutCurrentUser } from "@/features/auth/authSlice";

function Actions() {
    const [isAccess, setIsAccess] = useState(false);
    const [showSetting, setShowSetting] = useState(false);

    const settingRef = useRef(null);

    const dispatch = useDispatch();

    const saveAccessType = (type) => {
        localStorage.setItem("access", type);
    };

    const handleClickButton = (type) => {
        setIsAccess(true);
        saveAccessType(type);
    };

    const token = localStorage.getItem("token");

    const { user, err } = useCurrentUser();

    useEffect(() => {
        if (err) {
            if (err === "Unauthenticated") {
                localStorage.removeItem("token");
                window.top.location.href = "http://localhost:5173/";
            }
        }
    }, [err]);

    const handleLogout = async () => {
        if (!token) {
            console.warn("Không tìm thấy token, không thể đăng xuất.");
            return;
        }

        dispatch(logoutCurrentUser());
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
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
    }, [token]);

    return user ? (
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
                        <img src={user ? user.image : userImg} alt="user" />
                        <img className={styles.crown} src={proIcon} alt="" />
                    </div>
                </div>
                {showSetting && (
                    <div className={styles.tippy}>
                        <ul
                            className={`${styles.wrapSetting} ${styles.wrapAnmt}`}
                        >
                            <a href={`#`} className={styles.user}>
                                <div className={styles.avaSetting}>
                                    <div className={styles.avatar}>
                                        <img
                                            src={user ? user.image : userImg}
                                            alt="user"
                                        />
                                        <img
                                            className={styles.crown}
                                            src={proIcon}
                                            alt=""
                                        />
                                    </div>
                                </div>

                                <div className={styles.info}>
                                    <div className={styles.name}>
                                        {user?.username}
                                    </div>
                                    <div className={styles.useName}>
                                        @{user?.username}
                                    </div>
                                </div>
                            </a>

                            <hr />

                            <ul className={styles.list}>
                                <li>
                                    <a href={`@${user?.username}`}>
                                        Trang cá nhân
                                    </a>
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
                                    <Link to={`/setting/p/${user?.username}`}>
                                        Cài đặt
                                    </Link>
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
            <Button text onClick={() => handleClickButton("register")}>
                Đăng ký
            </Button>
            <Button
                secondary
                size="small"
                rounded
                onClick={() => handleClickButton("login")}
            >
                Đăng nhập
            </Button>

            {isAccess && (
                <AccessForm isAccess={isAccess} setIsAccess={setIsAccess} />
            )}
        </div>
    );
}

export default Actions;
