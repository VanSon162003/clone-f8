import { Link } from "react-router-dom";

import logo from "@/assets/imgs/logo-f8.png/";
import styles from "./Setting.module.scss";
import Button from "@/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShield, faUser } from "@fortawesome/free-solid-svg-icons";
import Profile from "./components/Profile";

function Setting() {
    return (
        <>
            <div className={styles.magic}></div>
            <div className={`container ${styles.container}`}>
                <div className={`row ${styles.row}`}>
                    <div className="col col-4">
                        <aside className={styles.wrapper}>
                            <div className={styles.content}>
                                <header>
                                    <Link to="/" target="_top">
                                        <img
                                            className={styles.logo}
                                            src={logo}
                                            alt="f8"
                                        />
                                    </Link>

                                    <h2 className={styles.heading}>
                                        Cài đặt tài khoản
                                    </h2>
                                    <p className={styles.desc}>
                                        Quản lý cài đặt tài khoản của bạn như
                                        thông tin cá nhân, cài đặt bảo mật, quản
                                        lý thông báo, v.v.
                                    </p>
                                </header>

                                <nav className={styles.nav}>
                                    <Button
                                        className={`${styles.link} ${styles.active}`}
                                    >
                                        <div className={styles.linkInner}>
                                            <FontAwesomeIcon
                                                className={`svg-inline--fa ${styles.iconBtn}`}
                                                icon={faUser}
                                            />
                                            Thông tin cá nhân
                                        </div>
                                    </Button>
                                    <Button className={`${styles.link}`}>
                                        <div className={styles.linkInner}>
                                            <FontAwesomeIcon
                                                className={`svg-inline--fa ${styles.iconBtn}`}
                                                icon={faShield}
                                            />{" "}
                                            Mật khẩu và bảo mật
                                        </div>
                                    </Button>
                                </nav>
                            </div>
                        </aside>
                    </div>

                    <div className="col col-7">
                        <Profile />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Setting;
