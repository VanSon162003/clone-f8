import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Avatar from "@/components/Avatar";
import styles from "./Profile.module.scss";
import ParentCard from "@/components/ParentCard";

import Button from "@/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBook,
    faUserClock,
    faUserGroup,
    faGlobe,
    faUserCheck,
    faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import {
    faFacebookSquare,
    faLinkedin,
    faYoutube,
    faTiktok,
    faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { timeAgo } from "@/utils/timeAgo";
import CourseList from "@/components/CourseList";
import authService from "@/services/authService";
import useCurrentUser from "@/hook/useCurrentUser";
function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const { username } = useParams();
    const { user: currentUser } = useCurrentUser();

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const data = await authService.getProfile(username);
                setProfile(data.data);
            } catch (err) {
                console.error("Failed to load profile:", err);
                setProfile(null);
            } finally {
                setLoading(false);
            }
        })();
    }, [username]);

    useEffect(() => {
        if (!profile || !currentUser) return;
        setIsFollowing(
            Array.isArray(profile.followers) &&
                profile.followers.some((f) => f.id === currentUser.id)
        );
    }, [profile, currentUser]);

    const handleFollowToggle = async () => {
        if (!profile) return;
        console.log(isFollowing);

        try {
            if (isFollowing) {
                console.log(123);

                await authService.unfollowUser(profile.username);
            } else {
                await authService.followUser(profile.username);
            }

            // refresh profile to get updated follower counts
            const res = await authService.getProfile(username);
            setProfile(res.data);
        } catch (err) {
            console.error("Follow toggle error:", err);
        }
    };

    return (
        <>
            <ParentCard>
                <div className="row">
                    <div className="col col-3 col-xl-4 col-lg-12">
                        <div className={styles.aside}>
                            <Avatar
                                avatar={
                                    profile?.avatar ||
                                    "/src/assets/imgs/user.jpg"
                                }
                                fontSize={"24px"}
                                flexCenter
                            />

                            <div className={styles.name}>{`${
                                profile?.last_name || ""
                            } ${profile?.frist_name || ""}`}</div>
                            <div className={styles.username}>
                                <Button to={`/profile/@${profile?.username}`}>
                                    @{profile?.username}
                                </Button>
                            </div>

                            <div className={styles.starsWrapper}>
                                <div className={styles.stats}>
                                    <span className={styles.leftIcon}>
                                        <FontAwesomeIcon icon={faUserGroup} />
                                    </span>
                                    <span className={styles.value}>
                                        <strong>
                                            {profile?.enrolledCourses?.length ||
                                                0}
                                        </strong>{" "}
                                        khóa học đã đăng ký{" "}
                                        <span className={styles.dot}>·</span>{" "}
                                        <strong>
                                            {profile?.activities?.length || 0}
                                        </strong>{" "}
                                        hoạt động gần đây
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
                                        {timeAgo(profile?.createdAt)}
                                    </span>
                                </div>
                                {/* Follow button: only show when viewing another user's profile */}
                                {currentUser &&
                                    profile &&
                                    profile.id !== currentUser.id && (
                                        <div className={styles.followBtnWrap}>
                                            <Button
                                                onClick={handleFollowToggle}
                                                className={`${styles.followBtn} ${styles.following}`}
                                            >
                                                <FontAwesomeIcon
                                                    icon={
                                                        isFollowing
                                                            ? faUserCheck
                                                            : faUserPlus
                                                    }
                                                />
                                                {isFollowing
                                                    ? "Bỏ theo dõi"
                                                    : "Theo dõi"}
                                            </Button>
                                        </div>
                                    )}

                                <ul className={styles.socialLinks}>
                                    {profile?.website_url && (
                                        <li>
                                            <a
                                                href={profile.website_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faGlobe}
                                                />
                                                <span>
                                                    {profile.website_url}
                                                </span>
                                            </a>
                                        </li>
                                    )}
                                    {profile?.github_url && (
                                        <li>
                                            <a
                                                href={profile.github_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faGithub}
                                                />
                                                <span>
                                                    {profile.github_url}
                                                </span>
                                            </a>
                                        </li>
                                    )}
                                    {profile?.facebook_url && (
                                        <li>
                                            <a
                                                href={profile.facebook_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faFacebookSquare}
                                                />
                                                <span>
                                                    {profile.facebook_url}
                                                </span>
                                            </a>
                                        </li>
                                    )}
                                    {profile?.linkedkin_url && (
                                        <li>
                                            <a
                                                href={profile.linkedkin_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faLinkedin}
                                                />
                                                <span>
                                                    {profile.linkedkin_url}
                                                </span>
                                            </a>
                                        </li>
                                    )}
                                    {profile?.youtube_url && (
                                        <li>
                                            <a
                                                href={profile.youtube_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faYoutube}
                                                />
                                                <span>
                                                    {profile.youtube_url}
                                                </span>
                                            </a>
                                        </li>
                                    )}
                                    {profile?.tiktok_url && (
                                        <li>
                                            <a
                                                href={profile.tiktok_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTiktok}
                                                />
                                                <span>
                                                    {profile.tiktok_url}
                                                </span>
                                            </a>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col col-9 col-xl-8 col-lg-12">
                        {loading ? (
                            <div>Loading...</div>
                        ) : !profile ? (
                            <div>User not found</div>
                        ) : (
                            <div className={styles.wrapper}>
                                <div className={styles.activities}>
                                    <h3>Hoạt động gần đây</h3>
                                    {profile.activities?.length > 0 ? (
                                        <div className={styles.activityList}>
                                            {profile.activities.map(
                                                (activity) => (
                                                    <div
                                                        key={activity.id}
                                                        className={
                                                            styles.activityItem
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                styles.activityType
                                                            }
                                                        >
                                                            {
                                                                activity.activity_type
                                                            }
                                                        </div>
                                                        <div
                                                            className={
                                                                styles.activityContent
                                                            }
                                                        >
                                                            {activity.content}
                                                        </div>
                                                        <div
                                                            className={
                                                                styles.activityTime
                                                            }
                                                        >
                                                            {timeAgo(
                                                                activity.createdAt
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <div>Chưa có hoạt động nào</div>
                                    )}
                                </div>

                                <div className={styles.tabHeading}>
                                    <Button
                                        to="#"
                                        className={`${styles.tab} ${styles.active}`}
                                    >
                                        <FontAwesomeIcon icon={faBook} />
                                        Khoá học đăng ký (
                                        {profile.courses?.length || 0})
                                    </Button>
                                </div>
                                <div className={styles.content}>
                                    {profile.courses?.length > 0 ? (
                                        <CourseList
                                            courseList={profile.courses}
                                            courseType={"free"}
                                            courseEnrolled
                                        />
                                    ) : (
                                        <div>Chưa đăng ký khoá học nào</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </ParentCard>
        </>
    );
}

export default Profile;
