import React, { useState } from "react";
import styles from "./Main.module.scss";
import { Link } from "react-router-dom";

import logo from "@/assets/imgs/logo-f8.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";

import Google from "@/assets/icons/Google.svg";
import Facebook from "@/assets/icons/Facebook.svg";
import github from "@/assets/icons/github.svg";
import Form from "../Form";
function Main({ swapAccessType, setSwapAccessType, type = "" }) {
    return (
        <main className={styles.main}>
            {type === "register" ? (
                <div className={styles.content}>
                    <Form type={type} />
                </div>
            ) : type === "login" ? (
                <div className={styles.content}>
                    <Form type={type} />
                </div>
            ) : (
                <div className={styles.content}>
                    <Link
                        to={
                            swapAccessType === "register"
                                ? "/register"
                                : "/login"
                        }
                        className={styles.wrapper}
                    >
                        <FontAwesomeIcon
                            icon={faUser}
                            className={`${styles.icon} ${styles.iconUser}`}
                        />

                        <span className={styles.title}>
                            Sử dụng email / số điện thoại
                        </span>
                    </Link>

                    <div className={styles.frag}>
                        <Link
                            to={
                                swapAccessType === "register"
                                    ? "/register"
                                    : "/login"
                            }
                            className={styles.wrapper}
                        >
                            <img
                                className={styles.icon}
                                src={Google}
                                alt="google"
                            />
                            <span className={styles.title}>
                                {swapAccessType === "register"
                                    ? "Đăng ký với Google"
                                    : "Đăng nhập với Google"}
                            </span>
                        </Link>

                        <Link
                            to={
                                swapAccessType === "register"
                                    ? "/register"
                                    : "/login"
                            }
                            className={styles.wrapper}
                        >
                            <img
                                className={styles.icon}
                                src={Facebook}
                                alt="facebook"
                            />

                            <span className={styles.title}>
                                {swapAccessType === "register"
                                    ? "Đăng ký với Facebook"
                                    : "Đăng nhập với Facebook"}
                            </span>
                        </Link>

                        <Link
                            to={
                                swapAccessType === "register"
                                    ? "/register"
                                    : "/login"
                            }
                            className={styles.wrapper}
                        >
                            <img
                                className={styles.icon}
                                src={github}
                                alt="github"
                            />

                            <span className={styles.title}>
                                {swapAccessType === "register"
                                    ? "Đăng ký với Github"
                                    : "Đăng nhập với Github"}
                            </span>
                        </Link>
                    </div>
                </div>
            )}

            {type === "register" ? (
                <p className={styles.regisOrLogin}>
                    {"Bạn đã có tài khoản? "}
                    <Link to={"/login"}>Đăng nhập</Link>
                </p>
            ) : type === "login" ? (
                <p className={styles.regisOrLogin}>
                    {"Bạn chưa có tài khoản? "}
                    <Link to={"/register"}>Đăng ký</Link>
                </p>
            ) : (
                <p className={styles.regisOrLogin}>
                    {swapAccessType === "register" ? (
                        <>
                            {"Bạn đã có tài khoản? "}
                            <button
                                onClick={() => {
                                    setSwapAccessType("login");
                                }}
                            >
                                Đăng nhập
                            </button>
                        </>
                    ) : (
                        <>
                            {"Bạn chưa có tài khoản? "}
                            <button
                                onClick={() => {
                                    setSwapAccessType("register");
                                }}
                            >
                                Đăng ký
                            </button>
                        </>
                    )}
                </p>
            )}

            <Link to={"/forGotPassWord"} className={styles.forgotPassword}>
                Quên mật khẩu
            </Link>

            <p className={styles.attention}>
                {
                    "Việc bạn tiếp tục sử dụng trang web này đồng nghĩa bạn đồng ý với "
                }
                <a href="http://localhost:5173/">điều khoản sử dụng</a>
                {" của chúng tôi"}
            </p>
        </main>
    );
}

export default Main;
