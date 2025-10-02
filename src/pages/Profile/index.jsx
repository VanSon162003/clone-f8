import Avatar from "@/components/Avatar";
import styles from "./Profile.module.scss";
import ParentCard from "@/components/ParentCard";
import { useSelector } from "react-redux";
import Button from "@/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBook,
    faUserClock,
    faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { timeAgo } from "@/utils/timeAgo";
import ActivityHeatmap from "@/components/ActivityHeatmap";
import useApi from "@/hook/useApi";
import CourseList from "@/components/CourseList";
function Profile() {
    const user = useSelector((state) => state.auth.currentUser);
    const courseFree = useApi("/free");

    return (
        <>
            <ParentCard>
                <div className="row">
                    <div className="col col-3 col-xl-4 col-lg-12">
                        <div className={styles.aside}>
                            <Avatar
                                avatar={"/src/assets/imgs/user.jpg"}
                                fontSize={"24px"}
                                flexCenter
                            />

                            <div
                                className={styles.name}
                            >{`${user?.lastName} ${user?.firstName}`}</div>
                            <div className={styles.username}>
                                <Button to={`/profile/@${user?.username}`}>
                                    @{user?.username}
                                </Button>
                            </div>

                            <div className={styles.starsWrapper}>
                                <div className={styles.stats}>
                                    <span className={styles.leftIcon}>
                                        <FontAwesomeIcon icon={faUserGroup} />
                                    </span>
                                    <span className={styles.value}>
                                        <strong>0</strong> người theo dõi{" "}
                                        <span className={styles.dot}>·</span>{" "}
                                        <strong>0</strong> đang theo dõi
                                    </span>
                                </div>
                                <div className={styles.joinedAt}>
                                    <span className={styles.leftIcon}>
                                        <FontAwesomeIcon icon={faUserClock} />
                                    </span>
                                    <span className={styles.value}>
                                        Tham gia{" "}
                                        <a href="https://fullstack.edu.vn/">
                                            <strong>F8</strong>
                                        </a>{" "}
                                        {timeAgo(user?.createdAt)}
                                    </span>
                                </div>
                                <ul className={styles.socialLinks}></ul>
                            </div>
                        </div>
                    </div>
                    <div className="col col-9 col-xl-8 col-lg-12">
                        <div className={styles.wrapper}>
                            <ActivityHeatmap />

                            <div className={styles.tabHeading}>
                                <Button
                                    to="#"
                                    className={`${styles.tab} ${styles.active}`}
                                >
                                    <FontAwesomeIcon icon={faBook} />
                                    Khoá học đăng ký (7)
                                </Button>
                            </div>
                            <div className={styles.content}>
                                <CourseList
                                    courseList={courseFree}
                                    courseType={"free"}
                                    courseEnrolled
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </ParentCard>
        </>
    );
}

export default Profile;
