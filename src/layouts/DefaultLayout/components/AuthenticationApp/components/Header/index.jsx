import React from "react";
import styles from "./Header.module.scss";
import { Link } from "react-router-dom";

import logo from "@/assets/imgs/logo-f8.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

function Header({ swapAccessType, back = false }) {
    return (
        <header className={styles.wrapper}>
            <Link to={"/"} target="_top">
                <img src={logo} alt="logo" className={styles.logo} />
            </Link>

            <h1 className={styles.heading}>
                {swapAccessType === "register"
                    ? "Đăng ký tài khoản F8"
                    : "Đăng nhập vào F8"}
            </h1>

            <p className={styles.warn}>
                Mỗi người nên sử dụng riêng một tài khoản, tài khoản nhiều người
                sử dụng chung sẽ bị khóa.
            </p>

            {back && (
                <Link to={"/authenticationApp"} className={styles.back}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                    {"Quay lại"}
                </Link>
            )}
        </header>
    );
}

export default Header;
