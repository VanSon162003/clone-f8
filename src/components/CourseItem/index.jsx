import React from "react";

import { Link } from "react-router-dom";

import proIcon from "@/assets/icons/pro-icon.svg";
import pro from "@/assets/icons/pro.svg";

import styles from "./CourseItem.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleCheck,
    faCirclePlay,
    faClock,
    faComment,
    faEye,
    faPlay,
    faThumbsUp,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import Avatar from "../Avatar";

function CourseItem({ item, courseType }) {
    return (
        <div
            className="col col-md-6"
            style={{ marginTop: "36px" }}
            key={item.id}
        >
            <div className={`${styles.wrapper} ${styles.courseItem}`}>
                <Link
                    to={item.path}
                    className={styles.link}
                    target={courseType === "video" ? "_blank" : "_self"}
                >
                    <img
                        src={item.img}
                        alt={item.title}
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
                                <span>{item.time}</span>
                            </div>
                        </div>
                    )}
                </Link>

                <div className={styles.content}>
                    <h3 className={styles.title}>
                        <Link
                            to={item.path}
                            target={courseType === "video" ? "_blank" : "_self"}
                        >
                            {item.title}
                        </Link>
                    </h3>

                    {courseType === "pro" ||
                        (courseType === "free" && (
                            <div className={styles.price}>
                                {/* thay đổi khi khác type */}

                                {courseType === "pro" && (
                                    <span className={styles.oldPrice}>
                                        {item.oldPrice}
                                    </span>
                                )}
                                <span className={styles.mainPrice}>
                                    {item.mainPrice}
                                </span>
                            </div>
                        ))}

                    {/* thay đổi khi khác type */}

                    {courseType === "pro" || courseType === "free" ? (
                        <div className={styles.moreInfo}>
                            <div className={styles.infoItem}>
                                {courseType === "pro" ? (
                                    <>
                                        <div className={styles.avatar}>
                                            <img
                                                src={item.founderImg}
                                                alt={item.founderName}
                                                title="người hướng dẫn: Sơn Đặng"
                                            />
                                        </div>
                                        <span>{item.founderName}</span>
                                    </>
                                ) : (
                                    <div className={styles.infoItem}>
                                        <FontAwesomeIcon icon={faUser} />
                                        <span>{item.sumPeople}</span>
                                    </div>
                                )}
                            </div>

                            <div
                                className={styles.infoItem}
                                title="số lượng video: 591"
                            >
                                <FontAwesomeIcon icon={faCirclePlay} />

                                <span>{item.video}</span>
                            </div>

                            <div
                                className={styles.infoItem}
                                title="Tổng thời lượng video: 116h50p"
                            >
                                <FontAwesomeIcon icon={faClock} />
                                <span>{item.resultTime}</span>
                            </div>
                        </div>
                    ) : courseType === "article" ? (
                        <Link to={item.pathAuthor} className={styles.author}>
                            <Avatar
                                avatar={item.avatar}
                                authorPro={item.authorPro}
                                pro={pro}
                                authorName={item.authorName}
                                admin={item.admin}
                            />

                            {/* <div>
                                <div
                                    className={`${styles.avatar} ${
                                        item.authorPro && styles.pro
                                    }`}
                                >
                                    <img
                                        src={item.avatar}
                                        alt={item.authorName}
                                    />

                                    {item.authorPro && (
                                        <img
                                            src={pro}
                                            alt="pro"
                                            className={styles.crown}
                                        />
                                    )}
                                </div>
                            </div>

                            <div>
                                <span className={styles.useName}>
                                    {item.authorName}
                                </span>

                                {item.admin && (
                                    <FontAwesomeIcon
                                        className={styles.iconLike}
                                        icon={faCircleCheck}
                                    />
                                )}
                            </div> */}
                            <span>·</span>
                            {`${item.time} phút đọc`}
                        </Link>
                    ) : (
                        <div className={styles.status}>
                            <div>
                                <FontAwesomeIcon icon={faEye} />

                                <span>{item.view}</span>
                            </div>

                            <div>
                                <FontAwesomeIcon icon={faThumbsUp} />

                                <span>{item.like}</span>
                            </div>

                            <div>
                                <FontAwesomeIcon icon={faComment} />
                                <span>{item.comment}</span>
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
