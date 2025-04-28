import React from "react";

import bannerHTML from "@/assets/imgs/banner_html.png";
import bannerYoutube from "@/assets/imgs/banner_youtube.png";
import Button from "../Button";

import styles from "./Banner.module.scss";

function Banner() {
    return (
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
    );
}

export default Banner;
