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

function Footer({
    onPrev,
    onNext,
    disabledNext,
    disabledPrev,
    toggleSideBar,
    openSideBar,
    track = {},
}) {
    const handleOpenSideBar = () => {
        toggleSideBar();
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.btnGroup}>
                <Button
                    type="button"
                    onClick={onPrev}
                    className={`${styles.btn} ${styles.rounded} ${
                        disabledPrev ? styles.disabled : ""
                    }`}
                    disabled={disabledPrev}
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
                    disabled={disabledNext}
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
                <h3 className={styles.trackTitle}>{track?.title}</h3>
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
