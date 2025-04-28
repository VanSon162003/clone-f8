import { Link } from "react-router-dom";
import logo from "@/assets/imgs/logo-f8.png";
import dmca from "@/assets/imgs/hmc.png";

import styles from "./Footer.module.scss";
import Button from "@/components/Button";
import {
    faSquareFacebook,
    faSquareYoutube,
    faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import { useDispatch } from "react-redux";
import { setHeaderBack, setSlideBack } from "@/features/auth/headerSlice";

function Footer() {
    const dispatch = useDispatch();

    const handleClick = (type = "") => {
        if (type === "about") dispatch(setSlideBack(true));
        else dispatch(setSlideBack(false));

        dispatch(setHeaderBack(true));
    };

    return (
        <footer className={styles.wrapper}>
            <div className="container-fluid">
                <div className="row gy-xl-6">
                    <div className="col col-3">
                        <div className={styles.columnTop}>
                            <Link to={"/"}>
                                <img
                                    src={logo}
                                    alt="logo"
                                    className={styles.logo}
                                />
                            </Link>
                            <h2 className={styles.slogan}>
                                Học lập trình để đi làm
                            </h2>
                        </div>

                        <p className={styles.contactList}>
                            <b>Điện thoại: </b>
                            <a href="tel:08 1919 8989">08 1919 8989</a>
                            <br />
                            <b>Email: </b>
                            <a href="mailto:contact@fullstack.edu.vn">
                                contact@fullstack.edu.vn
                            </a>
                            <br />
                            <b>Địa chỉ: </b>
                            Số 1, ngõ 41, Trần Duy Hưng, Cầu Giấy, Hà Nội
                        </p>

                        <a
                            target="_blank"
                            href="https://www.dmca.com/Protection/Status.aspx?id=1b325c69-aeb7-4e32-8784-a0009613323a&refurl=https%3a%2f%2ffullstack.edu.vn%2f&rlo=true"
                        >
                            <img
                                className={styles.dmca}
                                src={dmca}
                                alt="dmca"
                            />
                        </a>
                    </div>
                    <div className="col col-2">
                        <h2 className={styles.heading}>Về F8</h2>
                        <ul className={styles.list}>
                            <li>
                                <Button
                                    onClick={() => handleClick("about")}
                                    to={"/about-us"}
                                >
                                    Giới thiệu
                                </Button>
                            </li>

                            <li>
                                <Button
                                    onClick={handleClick}
                                    to={"/contact-us"}
                                >
                                    Liên hệ
                                </Button>
                            </li>

                            <li>
                                <Button onClick={handleClick} to={"/terms"}>
                                    Điều khoản
                                </Button>
                            </li>

                            <li>
                                <Button onClick={handleClick} to={"/privacy"}>
                                    Bảo mật
                                </Button>
                            </li>
                        </ul>
                    </div>

                    <div className="col col-2">
                        <h2 className={styles.heading}>Sản Phẩm</h2>
                        <ul className={styles.list}>
                            <li>
                                <a
                                    target="_blank"
                                    href="https://nester.fullstack.edu.vn/"
                                >
                                    Game Nester
                                </a>
                            </li>

                            <li>
                                <a
                                    target="_blank"
                                    href="https://css-selectors-cheatsheet.fullstack.edu.vn/"
                                >
                                    Game Css Diner
                                </a>
                            </li>

                            <li>
                                <a
                                    target="_blank"
                                    href="https://css-selectors-cheatsheet.fullstack.edu.vn/"
                                >
                                    Game Css Selector
                                </a>
                            </li>

                            <li>
                                <a
                                    target="_blank"
                                    href="https://froggy.fullstack.edu.vn/"
                                >
                                    Game Froggy
                                </a>
                            </li>
                            <li>
                                <a
                                    target="_blank"
                                    href="https://froggy-pro.fullstack.edu.vn/"
                                >
                                    Game Froggy Pro
                                </a>
                            </li>

                            <li>
                                <a
                                    target="_blank"
                                    href="https://css-scoops.fullstack.edu.vn/"
                                >
                                    Game Scoops
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="col col-2">
                        <h2 className={styles.heading}>Công Cụ</h2>
                        <ul className={styles.list}>
                            <li>
                                <a
                                    target="_blank"
                                    href="https://cv.fullstack.edu.vn/"
                                >
                                    Tạo CV xin việc
                                </a>
                            </li>

                            <li>
                                <a
                                    target="_blank"
                                    href="https://fullstack.edu.vn/shorten-urls"
                                >
                                    Rút gọn liên kết
                                </a>
                            </li>

                            <li>
                                <a
                                    target="_blank"
                                    href="https://clippy.fullstack.edu.vn/"
                                >
                                    Clip-path maker
                                </a>
                            </li>

                            <li>
                                <a
                                    target="_blank"
                                    href="https://snippet-generator.fullstack.edu.vn/"
                                >
                                    Snipper generator
                                </a>
                            </li>
                            <li>
                                <a
                                    target="_blank"
                                    href="https://grid.fullstack.edu.vn/"
                                >
                                    Css Grid generator
                                </a>
                            </li>

                            <li>
                                <a
                                    target="_blank"
                                    href="https://botayra.fullstack.edu.vn/"
                                >
                                    Cảnh báo sờ tay lên mặt
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="col col-3">
                        <h2 className={styles.heading}>
                            CÔNG TY CỔ PHẦN CÔNG NGHỆ GIÁO DỤC F8
                        </h2>
                        <ul className={styles.list}>
                            <li>
                                <b>Mã số thuế: </b>0109922901
                            </li>
                            <li>
                                <b>Ngày thành lập: </b>04/03/2022
                            </li>

                            <li>
                                <b>Lĩnh vực hoạt động: </b>Giáo dục, công nghệ -
                                lập trình. Chúng tôi tập trung xây dựng và phát
                                triển các sản phẩm mang lại giá trị cho cộng
                                đồng lập trình viên Việt Nam.
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="row">
                    <div className="col col-12">
                        <div className={styles.columnBottom}>
                            <p className={styles.copyRight}>
                                © 2018 - 2025 F8. Nền tảng học lập trình hàng
                                đầu Việt Nam
                            </p>

                            <div className={styles.social}>
                                <Button
                                    className={`${styles.socialItem} ${styles.youtube}`}
                                    target="_blank"
                                    href="https://www.youtube.com/@F8VNOfficial"
                                    title="YouTube"
                                    icon={faSquareYoutube}
                                />

                                <Button
                                    className={`${styles.socialItem} ${styles.facebook}`}
                                    target="_blank"
                                    href="https://www.facebook.com/sondnf8"
                                    title="F8 trên Facebook"
                                    icon={faSquareFacebook}
                                />

                                <Button
                                    className={`${styles.socialItem} ${styles.tiktok}`}
                                    target="_blank"
                                    href="https://www.tiktok.com/"
                                    title="F8 trên Tiktok"
                                    icon={faTiktok}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
