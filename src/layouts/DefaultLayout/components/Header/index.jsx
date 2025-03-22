import config from "@/config";
import React from "react";
import { Link, NavLink } from "react-router-dom";

import logo from "@/assets/imgs/logo-f8.png";
import searchIcon from "@/assets/icons/search.svg";

import styles from "../Header/Header.module.scss";
import SearchForm from "../SearchForm";
import Actions from "../Actions";

function Header() {
    return (
        <header id="header" className={styles.wrapper}>
            <div className={styles.logo}>
                <Link to={"/"}>
                    <img src={logo} alt="logo" className={styles.img} />
                </Link>
                <Link to={"/"} className={styles.title}>
                    Học Lập Trình Để Đi Làm
                </Link>
            </div>

            <SearchForm />

            <Actions />
        </header>
    );
}

export default Header;
