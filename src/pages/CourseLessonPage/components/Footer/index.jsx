import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronLeft,
    faChevronRight,
    faArrowRight,
    faBars,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Footer.module.scss";
import Button from "@/components/Button";
import { useState } from "react";

function Footer({ onPrev, onNext, disabledNext, toggleSideBar, openSideBar }) {
    const handleOpenSideBar = () => {
        toggleSideBar();
    };
    return (
        <div className={styles.wrapper}>
            <div className={styles.btnGroup}>
                <Button
                    type="button"
                    onClick={onPrev}
                    className={`${styles.btn} ${styles.rounded}`}
                >
                    <span className={styles.inner}>
                        <FontAwesomeIcon
                            icon={faChevronLeft}
                            className={`${styles.icon} ${styles.leftIcon}`}
                        />
                        <span className={styles.title}>BÀI TRƯỚC</span>
                    </span>
                </Button>

                <Button
                    type="button"
                    onClick={onNext}
                    className={`${styles.btn} ${styles.primary} ${
                        styles.rounded
                    } ${disabledNext ? styles.disabled : ""}`}
                    disabled // theem logic owr daay
                >
                    <span className={styles.inner}>
                        <span className={styles.title}>BÀI TIẾP THEO</span>
                        <FontAwesomeIcon
                            icon={faChevronRight}
                            className={`${styles.icon} ${styles.rightIcon}`}
                        />
                    </span>
                </Button>
            </div>

            <div className={styles.toggleWrap}>
                <h3 className={styles.trackTitle}>
                    4. Các bài thực hành cần nhiều 🧠
                </h3>
                <button
                    onClick={handleOpenSideBar}
                    className={styles.toggleBtn}
                >
                    <FontAwesomeIcon
                        icon={!openSideBar ? faBars : faArrowRight}
                    />
                </button>
            </div>
        </div>
    );
}

export default Footer;
