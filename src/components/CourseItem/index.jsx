import React from "react";
import { Link } from "react-router-dom";

import proIcon from "@/assets/icons/pro-icon.svg";
import pro from "@/assets/icons/pro.svg";
import styles from "./CourseItem.module.scss";

function CourseItem({ courseType, courseList }) {
    return (
        <div className="row row-cols-4 gy-6">
            {courseList.map((item) => (
                <div
                    className="col"
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
                                        <svg
                                            aria-hidden="true"
                                            focusable="false"
                                            data-prefix="fas"
                                            data-icon="play"
                                            className={`svg-inline--fa fa-play ${styles.playIcon}`}
                                            role="img"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 384 512"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
                                            ></path>
                                        </svg>
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
                                    target={
                                        courseType === "video"
                                            ? "_blank"
                                            : "_self"
                                    }
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
                                                <svg
                                                    aria-hidden="true"
                                                    focusable="false"
                                                    data-prefix="fas"
                                                    data-icon="users"
                                                    className="svg-inline--fa fa-users "
                                                    role="img"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 640 512"
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0H21.3C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3H405.3zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352H378.7C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7H154.7c-14.7 0-26.7-11.9-26.7-26.7z"
                                                    ></path>
                                                </svg>
                                                <span>{item.sumPeople}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        className={styles.infoItem}
                                        title="số lượng video: 591"
                                    >
                                        <svg
                                            aria-hidden="true"
                                            focusable="false"
                                            data-prefix="fas"
                                            data-icon="circle-play"
                                            className="svg-inline--fa fa-circle-play "
                                            role="img"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 512 512"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9V344c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z"
                                            ></path>
                                        </svg>

                                        <span>{item.video}</span>
                                    </div>

                                    <div
                                        className={styles.infoItem}
                                        title="Tổng thời lượng video: 116h50p"
                                    >
                                        <svg
                                            aria-hidden="true"
                                            focusable="false"
                                            data-prefix="fas"
                                            data-icon="clock"
                                            className="svg-inline--fa fa-clock "
                                            role="img"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 512 512"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"
                                            ></path>
                                        </svg>
                                        <span>{item.resultTime}</span>
                                    </div>
                                </div>
                            ) : courseType === "article" ? (
                                <Link
                                    to={item.pathAuthor}
                                    className={styles.author}
                                >
                                    <div>
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
                                            <svg
                                                aria-hidden="true"
                                                focusable="false"
                                                data-prefix="fas"
                                                data-icon="circle-check"
                                                className={`svg-inline--fa fa-circle-check _icon_1jdb1_1 ${styles.iconLike}`}
                                                role="img"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 512 512"
                                            >
                                                <path
                                                    fill="currentColor"
                                                    d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
                                                ></path>
                                            </svg>
                                        )}
                                    </div>
                                    <span>·</span>
                                    {`${item.time} phút đọc`}
                                </Link>
                            ) : (
                                <div className={styles.status}>
                                    <div>
                                        <svg
                                            aria-hidden="true"
                                            focusable="false"
                                            data-prefix="fas"
                                            data-icon="eye"
                                            className="svg-inline--fa fa-eye "
                                            role="img"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 576 512"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"
                                            ></path>
                                        </svg>
                                        <span>{item.view}</span>
                                    </div>

                                    <div>
                                        <svg
                                            aria-hidden="true"
                                            focusable="false"
                                            data-prefix="fas"
                                            data-icon="thumbs-up"
                                            className="svg-inline--fa fa-thumbs-up "
                                            role="img"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 512 512"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2H464c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48H294.5c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3V320 272 247.1c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192H96c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V224c0-17.7 14.3-32 32-32z"
                                            ></path>
                                        </svg>
                                        <span>{item.like}</span>
                                    </div>

                                    <div>
                                        <svg
                                            aria-hidden="true"
                                            focusable="false"
                                            data-prefix="fas"
                                            data-icon="comment"
                                            className="svg-inline--fa fa-comment "
                                            role="img"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 512 512"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"
                                            ></path>
                                        </svg>
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
            ))}
        </div>
    );
}

export default CourseItem;
