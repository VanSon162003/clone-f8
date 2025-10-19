import { Link } from "react-router-dom";
import styles from "./Tippy.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { logoutCurrentUser } from "@/features/auth/authSlice";

import userImg from "@/assets/imgs/user.jpg";
import proIcon from "@/assets/icons/pro-icon.svg";
import { useEffect, useRef, useState } from "react";
import useApi from "@/hook/useApi";
import CourseListDetail from "../CourseListDetail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter } from "@fortawesome/free-brands-svg-icons";
import {
    faEnvelope,
    faFlag,
    faLink,
    faClock,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../Button";
import { useAuth0 } from "@auth0/auth0-react";
import isHttps from "@/utils/isHttps";
import notificationService from "@/services/notificationService";
import socketClient from "@/utils/websocket";

function Tippy({
    user = {},
    type = "",
    className,
    ref,
    onEdit,
    onRemove,
    onShare,
    showNotification = false,
    isShow = false,
    handleReadNotifications,
}) {
    const { logout } = useAuth0();
    const dispatch = useDispatch();

    const [notifications, setNotifications] = useState([]);
    const [hasReadNotifications, setHasReadNotifications] = useState([]);

    const token = localStorage.getItem("token");

    const tippyInset = type === "options" ? "40px 0px auto auto" : "";

    const timeAgo = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now - date;

        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (seconds < 60) return `${seconds} giây trước`;
        if (minutes < 60) return `${minutes} phút trước`;
        if (hours < 24) return `${hours} giờ trước`;
        if (days < 30) return `${days} ngày trước`;
        if (months < 12) return `${months} tháng trước`;
        return `${years} năm trước`;
    };

    const currentUser = useSelector((state) => state.auth.currentUser);

    useEffect(() => {
        if (type === "course" && currentUser) {
            setNotifications(currentUser.notifications || []);

            const readNotis = currentUser.notifications.filter(
                (noti) => noti.UserNotification.read_at
            );

            const idsNotis = readNotis.map((noti) => noti.id);

            setHasReadNotifications(idsNotis);
        }
    }, [type, currentUser]);

    useEffect(() => {
        if (!currentUser) return;
        const chanel = socketClient.subscribe("joinNotificationRoom");

        chanel.bind("notification", (data) => {
            const userId = data.userId;

            if (currentUser.id === userId)
                setNotifications((prev) => [data, ...prev]);
        });

        return () => {
            socketClient.unsubscribe("joinNotificationRoom");
        };
    }, [currentUser]);

    const wrap =
        type === "profile"
            ? styles.wrapSetting
            : type === "notification"
            ? styles.wrapperNotification
            : type === "options"
            ? styles.wrapperOptions
            : type === "myPost" || type === "myBookmark"
            ? styles.wrapperMyPost
            : styles.wrapperCourseList;

    const tippyTransform =
        type === "profile"
            ? "translate3d(-28px, 59.2px, 0px)"
            : type === "notification"
            ? "translate3d(-123.2px, 60px, 0px)"
            : type === "options"
            ? "translate3d(0px)"
            : type === "myPost" || type === "myBookmark"
            ? "translate3d(-16.8px, 32px, 0px)"
            : "translate3d(0, 46.8px, 0px)";

    const handleLogout = async () => {
        if (!token) {
            console.warn("Không tìm thấy token, không thể đăng xuất.");
            return;
        }

        dispatch(logoutCurrentUser());
        logout();

        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
    };

    const courses = useApi("/pro");

    const handleReadNoti = async (id) => {
        try {
            await notificationService.readNotification({ id });

            setHasReadNotifications((prev) => {
                if (prev.includes(id)) {
                    return prev;
                }
                return [...prev, id];
            });

            handleReadNotifications(id);
        } catch (error) {
            console.log(error);
        }
    };

    const handleReadAll = async () => {
        try {
            // Lấy tất cả các id thông báo chưa đọc
            const notiIds = notifications
                .filter((n) => !hasReadNotifications.includes(n.id))
                .map((n) => n.id);

            if (notiIds.length === 0) return;

            // Gọi API backend để đánh dấu tất cả đã đọc
            await notificationService.readNotification({ ids: notiIds });

            // Cập nhật UI: thêm tất cả id đã đọc vào state
            setHasReadNotifications((prev) => [
                ...new Set([...prev, ...notiIds]),
            ]);

            handleReadNotifications("all");
        } catch (error) {
            console.error("Lỗi khi đánh dấu đã đọc tất cả:", error);
        }
    };

    return (
        <div
            ref={ref}
            className={`${styles.tippy} ${className} ${isShow && styles.hidden}
            ${showNotification ? styles.active : ""}`}
            style={{
                "--main-transForm": tippyTransform,
                "--tippy-inset": tippyInset,
            }}
        >
            <ul
                className={`${wrap} ${styles.wrapAnmt} ${
                    type === "options" && styles.options
                }`}
            >
                {type === "profile" ? (
                    <>
                        <Button
                            to={`/profile/@${user?.username}`}
                            className={styles.user}
                        >
                            <div className={styles.avaSetting}>
                                <div className={styles.avatar}>
                                    <img
                                        src={
                                            user.avatar
                                                ? isHttps(user.avatar)
                                                    ? user.avatar
                                                    : `${
                                                          import.meta.env
                                                              .VITE_BASE_URL
                                                      }${user.avatar}`
                                                : userImg ||
                                                  "src/assets/imgs/user.jpg"
                                        }
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
                                    {user?.full_name}
                                </div>
                                <div className={styles.useName}>
                                    @{user?.username}
                                </div>
                            </div>
                        </Button>

                        <hr />

                        <ul className={styles.list}>
                            <li>
                                <Button to={`/profile/@${user?.username}`}>
                                    Trang cá nhân
                                </Button>
                            </li>
                        </ul>

                        <hr />
                        <ul className={styles.list}>
                            <li>
                                <Button to="/new-post">Viết blog</Button>
                            </li>

                            <li>
                                <Button to="/me/posts">Bài viết của tôi</Button>
                            </li>

                            <li>
                                <Button to="/me/bookmark">
                                    Bài viết đã lưu
                                </Button>
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
                                <Button to="/">Đăng xuất</Button>
                            </li>
                        </ul>
                    </>
                ) : type === "notification" ? (
                    <>
                        <div className={styles.header}>
                            <h6 className={styles.heading}>Khóa học của tôi</h6>
                            <a href="#" className={styles.viewAllBtn}>
                                Xem tất cả
                            </a>
                        </div>

                        <div className={styles.content}>
                            {courses.map((course) => {
                                return (
                                    <CourseListDetail
                                        key={course.id}
                                        course={course}
                                    />
                                );
                            })}
                        </div>
                    </>
                ) : type === "options" ? (
                    <>
                        <li onClick={onShare}>
                            <FontAwesomeIcon icon={faLink} />
                            <span>Chia sẻ bài viết</span>
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faFlag} />
                            <span>Báo cáo bài viết</span>
                        </li>
                    </>
                ) : type === "myPost" ? (
                    <>
                        <li onClick={() => onEdit()}>Chỉnh sửa</li>
                        <li onClick={() => onRemove()}>Xóa</li>
                    </>
                ) : type === "myBookmark" ? (
                    <>
                        <li onClick={() => onRemove()}>Xóa khỏi mục đã lưu</li>
                    </>
                ) : (
                    <>
                        <div className={styles.header}>
                            <h6 className={styles.heading}>Thông báo</h6>
                            <a
                                onClick={handleReadAll}
                                href="#"
                                className={styles.viewAllBtn}
                            >
                                Đánh dấu đã đọc
                            </a>
                        </div>
                        <div className={styles.content}>
                            {notifications.length === 0 && (
                                <div className={styles.noNotification}>
                                    Không có thông báo mới
                                </div>
                            )}
                            {notifications.map((notification) => {
                                return (
                                    <Link
                                        to={notification?.to}
                                        key={notification?.id}
                                        className={`${styles.notificationItem} `}
                                        onClick={() =>
                                            handleReadNoti(notification?.id)
                                        }
                                    >
                                        <div
                                            className={`${
                                                styles.notificationContent
                                            } ${
                                                !hasReadNotifications.includes(
                                                    notification?.id
                                                )
                                                    ? styles.active
                                                    : ""
                                            }`}
                                        >
                                            <div
                                                className={
                                                    styles.notificationTitle
                                                }
                                            >
                                                {notification?.title}
                                            </div>

                                            <div
                                                className={
                                                    styles.notificationTime
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon={faClock}
                                                />
                                                {timeAgo(
                                                    notification?.createdAt
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </>
                )}
            </ul>
        </div>
    );
}

export default Tippy;
