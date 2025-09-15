import { Link } from "react-router-dom";
import styles from "./Tippy.module.scss";
import { useDispatch } from "react-redux";
import { logoutCurrentUser } from "@/features/auth/authSlice";

import userImg from "@/assets/imgs/user.jpg";
import proIcon from "@/assets/icons/pro-icon.svg";
import { useRef } from "react";
import useApi from "@/hook/useApi";
import CourseListDetail from "../CourseListDetail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faFlag, faLink } from "@fortawesome/free-solid-svg-icons";

function Tippy({ user = {}, type = "", className }) {
    const dispatch = useDispatch();

    const token = localStorage.getItem("token");

    const tippyInset = type === "options" ? "40px 0px auto auto" : "";

    console.log(type);

    const wrap =
        type === "profile"
            ? styles.wrapSetting
            : type === "notification"
            ? styles.wrapperNotification
            : type === "options"
            ? styles.wrapperOptions
            : styles.wrapperCourseList;

    const tippyTransform =
        type === "profile"
            ? "translate3d(-28px, 59.2px, 0px)"
            : type === "notification"
            ? "translate3d(-123.2px, 60px, 0px)"
            : type === "options"
            ? "translate3d(0px)"
            : "translate3d(0, 46.8px, 0px)";

    // const arrType = useRef(["profile, notification, courseList"]);

    const handleLogout = async () => {
        if (!token) {
            console.warn("Không tìm thấy token, không thể đăng xuất.");
            return;
        }

        dispatch(logoutCurrentUser());
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
    };

    const courses = useApi("/pro");

    return (
        <div
            className={`${styles.tippy} ${className}`}
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
                                <a href={`/@${user?.username}`}>
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
                        <li>
                            <FontAwesomeIcon icon={faFacebook} />
                            <span>Chia sẻ lên Facebook</span>
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faTwitter} />
                            <span>Chia sẻ lên Twitter</span>
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faEnvelope} />
                            <span>Chia sẻ lên Email</span>
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faLink} />
                            <span>Sao chép liên kết</span>
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faFlag} />
                            <span>Báo cáo bài viết</span>
                        </li>
                    </>
                ) : (
                    <>
                        <div className={styles.header}>
                            <h6 className={styles.heading}>Thông báo</h6>
                            <a href="#" className={styles.viewAllBtn}>
                                Đánh dấu đã đọc
                            </a>
                        </div>
                        <div className={styles.content}></div>
                    </>
                )}
            </ul>
        </div>
    );
}

export default Tippy;
