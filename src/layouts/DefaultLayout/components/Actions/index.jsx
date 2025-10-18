import { useState, useEffect, useRef } from "react";
import Button from "@/components/Button";
import styles from "./Actions.module.scss";
import AccessForm from "../AccessForm";
import { faBell } from "@fortawesome/free-solid-svg-icons";

import userImg from "@/assets/imgs/user.jpg";
import proIcon from "@/assets/icons/pro-icon.svg";
import useCurrentUser from "@/hook/useCurrentUser";
import Tippy from "@/components/Tippy";
import isHttps from "@/utils/isHttps";

function Actions() {
    const [isAccess, setIsAccess] = useState(false);

    const [showSetting, setShowSetting] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [showCourseList, setShowCourseList] = useState(false);

    const settingRef = useRef(null);
    const showCourseListRef = useRef(null);
    const showNotificationRef = useRef(null);

    const saveAccessType = (type) => {
        localStorage.setItem("access", type);
    };

    const handleClickButton = (type) => {
        setIsAccess(true);
        saveAccessType(type);
    };

    // const token = localStorage.getItem("token");

    const { user, err } = useCurrentUser();

    useEffect(() => {
        if (err === "Unauthenticated") {
            localStorage.removeItem("token");
            window.top.location.href = "/";
        }
    }, [err]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (settingRef.current && !settingRef.current.contains(e.target)) {
                setShowSetting(false);
            }

            if (
                showCourseListRef.current &&
                !showCourseListRef.current.contains(e.target)
            ) {
                setShowCourseList(false);
            }

            if (
                showNotificationRef.current &&
                !showNotificationRef.current.contains(e.target)
            ) {
                setShowNotification(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const closeAllPopups = () => {
        setShowNotification(false);
        setShowCourseList(false);
        setShowSetting(false);
    };

    return user ? (
        <div className={styles.actions}>
            <div ref={showNotificationRef}>
                <button
                    onClick={() => {
                        const next = !showNotification;
                        closeAllPopups();
                        setShowNotification(next);
                    }}
                    className={styles.myLearn}
                >
                    Khoá học của tôi
                </button>
                {showNotification && <Tippy user={user} type="notification" />}
            </div>

            <div ref={showCourseListRef}>
                <div className={styles.actionBtn}>
                    <Button
                        onClick={() => {
                            const next = !showCourseList;
                            closeAllPopups();
                            setShowCourseList(next);
                        }}
                        icon={faBell}
                    />
                    {showCourseList && <Tippy user={user} type="course" />}
                </div>
            </div>

            <div ref={settingRef}>
                <div
                    className={styles.avatarWrap}
                    onClick={() => {
                        const next = !showSetting;
                        closeAllPopups();
                        setShowSetting(next);
                    }}
                >
                    <div className={styles.avatar}>
                        <img
                            src={
                                user.avatar
                                    ? isHttps(user.avatar)
                                        ? user.avatar
                                        : `${import.meta.env.VITE_BASE_URL}${
                                              user.avatar
                                          }`
                                    : "src/assets/imgs/user.jpg"
                            }
                            alt="user"
                        />
                        <img className={styles.crown} src={proIcon} alt="" />
                    </div>
                </div>
                {showSetting && <Tippy user={user} type="profile" />}
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
