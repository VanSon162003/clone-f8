import { Link } from "react-router-dom";

import styles from "../Header/Header.module.scss";
import SearchForm from "../SearchForm";
import Actions from "../Actions";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/Button";

function Header() {
    const back = useSelector((state) => state.header.back);

    const handleBack = () => {
        window.history.back();
    };
    return (
        <header id="header" className={styles.wrapper}>
            <div className={styles.logo}>
                <Link to={"/"}>
                    <img
                        src={`${
                            import.meta.env.VITE_BASE_URL
                        }uploads/imgs/logo`}
                        alt="logo"
                        className={styles.img}
                    />
                </Link>
                {back ? (
                    <Button onClick={handleBack} className={styles.back}>
                        <span className={styles.subTitle}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                            <span>quay lại</span>
                        </span>
                    </Button>
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
