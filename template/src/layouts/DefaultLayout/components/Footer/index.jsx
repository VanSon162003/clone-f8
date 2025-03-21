import config from "@/config";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "@/assets/imgs/logo-f8.png";
import dmca from "@/assets/imgs/hmc.png";

import styles from "./Footer.module.scss";

function Footer() {
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
                                <Link to={"/about-us"}>Giới thiệu</Link>
                            </li>

                            <li>
                                <Link to={"/contact-us"}>Liên hệ</Link>
                            </li>

                            <li>
                                <Link to={"/terms"}>Điều khoản</Link>
                            </li>

                            <li>
                                <Link to={"/privacy"}>Bảo mật</Link>
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
                                <a
                                    className={`${styles.socialItem}`}
                                    href="https://www.youtube.com/channel/YOUR_CHANNEL_ID"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="YouTube"
                                    title="YouTube"
                                    href="https://www.youtube.com/@F8VNOfficial"
                                >
                                    <svg
                                        className={styles.svgInline}
                                        aria-hidden="true"
                                        focusable="false"
                                        data-prefix="fab"
                                        data-icon="square-youtube"
                                        role="img"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 448 512"
                                    >
                                        <path
                                            fill="#eb2c3b"
                                            d="M282 256.2l-95.2-54.1V310.3L282 256.2zM384 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64zm14.4 136.1c7.6 28.6 7.6 88.2 7.6 88.2s0 59.6-7.6 88.1c-4.2 15.8-16.5 27.7-32.2 31.9C337.9 384 224 384 224 384s-113.9 0-142.2-7.6c-15.7-4.2-28-16.1-32.2-31.9C42 315.9 42 256.3 42 256.3s0-59.7 7.6-88.2c4.2-15.8 16.5-28.2 32.2-32.4C110.1 128 224 128 224 128s113.9 0 142.2 7.7c15.7 4.2 28 16.6 32.2 32.4z"
                                        ></path>
                                    </svg>
                                </a>

                                <a
                                    className={`${styles.socialItem}`}
                                    title="F8 trên Facebook"
                                    target="_blank"
                                    rel="noreferrer"
                                    href="https://www.facebook.com/sondnf8"
                                >
                                    <svg
                                        aria-hidden="true"
                                        focusable="false"
                                        data-prefix="fab"
                                        data-icon="square-facebook"
                                        role="img"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 448 512"
                                    >
                                        <path
                                            fill="#4867aa"
                                            d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64h98.2V334.2H109.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H255V480H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"
                                        ></path>
                                    </svg>
                                </a>

                                <a
                                    className={`${styles.socialItem}`}
                                    title="F8 trên Tiktok"
                                    target="_blank"
                                    rel="noreferrer"
                                    href="https://www.tiktok.com/"
                                >
                                    <svg
                                        aria-hidden="true"
                                        focusable="false"
                                        data-prefix="fab"
                                        data-icon="tiktok"
                                        role="img"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 448 512"
                                    >
                                        <path
                                            fill="#ccc"
                                            d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"
                                        ></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
