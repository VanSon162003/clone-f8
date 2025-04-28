import { Link } from "react-router-dom";

import logo from "@/assets/imgs/logo-f8.png";

import styles from "../Header/Header.module.scss";
import SearchForm from "../SearchForm";
import Actions from "../Actions";
import { useSelector } from "react-redux";

function Header() {
    const back = useSelector((state) => state.header.back);

    return (
        <header id="header" className={styles.wrapper}>
            <div className={styles.logo}>
                <Link to={"/"}>
                    <img src={logo} alt="logo" className={styles.img} />
                </Link>
                {back ? (
                    <Link to={"/"} className={styles.title}>
                        quay lại
                    </Link>
                ) : (
                    <Link to={"/"} className={styles.title}>
                        Học Lập Trình Để Đi Làm
                    </Link>
                )}
            </div>

            <SearchForm />

            <Actions />
        </header>
    );
}

export default Header;
