import React from "react";

import bannerHTML from "@/assets/imgs/banner_html.png";
import bannerYoutube from "@/assets/imgs/banner_youtube.png";
import Button from "../Button";

import styles from "./Banner.module.scss";

function Banner({ blog = false }) {
    return (
        <>
            {blog && (
                <aside className={styles.wrapper}>
                    <h3>Xem các bài viết theo chủ đề</h3>

                    <ul className={styles.topPic}>
                        <li>
                            <a href="#">Front-end / Mobile apps</a>
                        </li>
                        <li>
                            <a href="#">Back-end / Devops</a>
                        </li>
                        <li>
                            <a href="#">UI / UX / Design</a>
                        </li>
                        <li>
                            <a href="#">Others</a>
                        </li>
                    </ul>
                </aside>
            )}

            <div className={styles.wrap}>
                <div className={styles.content}>
                    <Button
                        to="/landing/scss"
                        target="_blank"
                        className={styles.banner}
                    >
                        <img src={bannerHTML} alt="" />
                    </Button>

                    <Button
                        href="https://www.youtube.com/c/F8VNOfficial"
                        target="_blank"
                        className={styles.banner}
                    >
                        <img src={bannerYoutube} alt="" />
                    </Button>
                </div>
            </div>
        </>
    );
}

export default Banner;
