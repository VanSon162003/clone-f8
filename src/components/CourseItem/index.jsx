import React from "react";

import { Link } from "react-router-dom";

import proIcon from "@/assets/icons/pro-icon.svg";
import pro from "@/assets/icons/pro.svg";

import styles from "./CourseItem.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCirclePlay,
    faClock,
    faComment,
    faEye,
    faPlay,
    faThumbsUp,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import Avatar from "../Avatar";
import formatNumberVN from "@/utils/formatNumberVN";
import { useRedirectIfRegistered } from "@/hook/useRedirectIfRegistered";

function CourseItem({ item = {}, courseType, courseEnrolled = false }) {
    const formatCurrencyVND = (value) => {
        const number = Math.round(parseFloat(value) / 1000) * 1000;
        return new Intl.NumberFormat("vi-VN").format(number) + "đ";
    };

    const check = useRedirectIfRegistered(item);

    const path = check
        ? `/learning/${item.slug}`
        : courseType === "video"
        ? item.video_id
        : courseType === "pro" || courseType === "free"
        ? `/courses/${item.slug}`
        : `/blog/${item.slug}`;

    return (
        <div
            className={`${
                courseEnrolled
                    ? "col-4 col-xl-6 col-lg-4 col-md-6"
                    : "col col-md-6"
            }`}
            style={{ marginTop: "36px" }}
            key={item.id}
        >
            <div className={`${styles.wrapper} ${styles.courseItem}`}>
                <Link
                    to={path}
                    className={styles.link}
                    target={courseType === "video" ? "_blank" : "_self"}
                >
                    <img
                        src={item?.thumbnail}
                        alt={item?.title}
                        className={styles.thumb}
                    />

                    {courseType === "video" && (
                        <div className={styles.videoInfo}>
                            <div className={styles.playWrap}>
                                <FontAwesomeIcon
                                    icon={faPlay}
                                    className={styles.playIcon}
                                />
                            </div>

                            <div className={styles.duration}>
                                <span>{item.duration}</span>
                            </div>
                        </div>
                    )}
                </Link>

                <div className={styles.content}>
                    <h3 className={styles.title}>
                        <Link
                            to={path}
                            target={courseType === "video" ? "_blank" : "_self"}
                        >
                            {item.title}
                        </Link>
                    </h3>

                    {(courseType === "pro" || courseType === "free") && (
                        <div className={styles.price}>
                            {/* thay đổi khi khác type */}

                            {courseType === "pro" && (
                                <span className={styles.oldPrice}>
                                    {formatCurrencyVND(item.old_price)}
                                </span>
                            )}
                            <span className={styles.mainPrice}>
                                {item.is_pro
                                    ? formatCurrencyVND(item.price)
                                    : "Miễn phí"}
                            </span>
                        </div>
                    )}

                    {/* thay đổi khi khác type */}

                    {courseType === "pro" || courseType === "free" ? (
                        <div className={styles.moreInfo}>
                            <div className={styles.infoItem}>
                                {courseType === "pro" ? (
                                    <>
                                        <div className={styles.avatar}>
                                            <img
                                                src={item.creator.avatar}
                                                alt={item.creator.full_name}
                                                title={`người hướng dẫn: ${item.creator.full_name}`}
                                            />
                                        </div>
                                        <span>{item.creator.full_name}</span>
                                    </>
                                ) : (
                                    <div className={styles.infoItem}>
                                        <FontAwesomeIcon icon={faUser} />
                                        <span>
                                            {formatNumberVN(item.total_view)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div
                                className={styles.infoItem}
                                title="số lượng video: 591"
                            >
                                <FontAwesomeIcon icon={faCirclePlay} />

                                <span>{item.total_lesson}</span>
                            </div>

                            <div
                                className={styles.infoItem}
                                title="Tổng thời lượng video: 116h50p"
                            >
                                <FontAwesomeIcon icon={faClock} />
                                <span>{item.total_duration}</span>
                            </div>
                        </div>
                    ) : courseType === "article" ? (
                        <Link to={`/@${item.author?.username || 'unknown'}`} className={styles.author}>
                            <Avatar
                                avatar={item.author?.avatar || "/src/assets/imgs/user.jpg"}
                                authorPro={item.authorPro}
                                pro={pro}
                                authorName={item.author?.full_name || 'Unknown Author'}
                                admin={item.admin}
                            />

                            <span>·</span>
                            <span>{item.views_count || 0} lượt xem</span>
                        </Link>
                    ) : (
                        <div className={styles.status}>
                            <div>
                                <FontAwesomeIcon icon={faEye} />

                                <span>{formatNumberVN(item.views_count)}</span>
                            </div>

                            <div>
                                <FontAwesomeIcon icon={faThumbsUp} />

                                <span>{formatNumberVN(item.likes_count)}</span>
                            </div>

                            <div>
                                <FontAwesomeIcon icon={faComment} />
                                <span>
                                    {formatNumberVN(item.comments_count)}
                                </span>
                            </div>
                        </div>
                    )}

                    {courseType === "pro" && (
                        <div className={styles.proIcon}>
                            <img src={proIcon} alt="pro-icon" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CourseItem;
