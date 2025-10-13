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
import Button from "../Button";
import { useAuth0 } from "@auth0/auth0-react";

function Tippy({ user = {}, type = "", className, ref, onEdit, onRemove }) {
    const { logout } = useAuth0();
    const dispatch = useDispatch();

    const token = localStorage.getItem("token");

    const tippyInset = type === "options" ? "40px 0px auto auto" : "";

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

    return (
        <div
            ref={ref}
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
                        <Button
                            to={`/profile/@${user?.username}`}
                            className={styles.user}
                        >
                            <div className={styles.avaSetting}>
                                <div className={styles.avatar}>
                                    <img
                                        src={user ? user.avatar : userImg}
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
