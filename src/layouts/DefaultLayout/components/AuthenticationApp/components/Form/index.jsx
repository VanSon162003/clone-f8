import React, { useRef, useState } from "react";
import styles from "./Form.module.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "@/hook/useAuth";
import useQuery from "@/hook/useQuery";
import { setToken } from "@/utils/httpRequest";

function Form({ setForm, form, type = "" }) {
    const btnSubmit = useRef(null);
    const [data, errs, setErrs, fetchAuth] = useAuth();

    const { param } = useQuery();

    const handleChangInput = (e) => {
        setForm((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            };
        });

        setErrs({});
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (type === "register") {
            fetchAuth("register", form);
        } else {
            fetchAuth("login", form);
        }
    };

    if (data.access_token) {
        setToken(data.access_token);
        window.top.location.href = `http://localhost:5173${
            param.get("continue") ? param.get("continue") : ""
        }`;
    }

    if (type === "register") {
        if (
            form.firstName !== "" &&
            form.lastName !== "" &&
            form.email !== "" &&
            form.passWord !== "" &&
            form.password_confirmation !== ""
        ) {
            if (btnSubmit.current) {
                btnSubmit.current.classList.remove(styles.disabled);
            }
        } else {
            if (btnSubmit.current) {
                btnSubmit.current.classList.add(styles.disabled);
            }
        }
    } else {
        if (form.email !== "" && form.passWord !== "") {
            if (btnSubmit.current) {
                btnSubmit.current.classList.remove(styles.disabled);
            }
        } else {
            if (btnSubmit.current) {
                btnSubmit.current.classList.add(styles.disabled);
            }
        }
    }

    return type === "register" ? (
        <form action="" onSubmit={handleSubmit}>
            <div className={styles.wrapper_juilt}>
                <div className={styles.wrapper}>
                    <div className={styles.labelGroup}>
                        <label htmlFor="FirstName">Tên</label>
                    </div>
                </div>

                <div className={styles.inputWrap}>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="Tên"
                        maxLength={20}
                        value={form.firstName}
                        onChange={handleChangInput}
                        id="firstName"
                    />
                </div>
            </div>

            <div className={styles.wrapper_juilt}>
                <div className={styles.wrapper}>
                    <div className={styles.labelGroup}>
                        <label htmlFor="LastName">Tên đệm</label>
                    </div>
                </div>

                <div className={styles.inputWrap}>
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Tên đệm"
                        maxLength={20}
                        value={form.lastName}
                        onChange={handleChangInput}
                        id="lastName"
                    />
                </div>
            </div>

            <div className={styles.wrapper_juilt}>
                <div className={styles.wrapper}>
                    <div className={styles.labelGroup}>
                        <label htmlFor="email">email</label>
                    </div>
                </div>

                <div className={styles.inputWrap}>
                    <input
                        type="text"
                        name="email"
                        placeholder="email"
                        maxLength={50}
                        value={form.email}
                        onChange={handleChangInput}
                        id="email"
                    />
                </div>
            </div>

            <div className={styles.wrapper_juilt}>
                <div className={styles.wrapper}>
                    <div className={styles.labelGroup}>
                        <label htmlFor="password">Mật khẩu</label>
                    </div>
                </div>

                <div className={styles.inputWrap}>
                    <input
                        type="password"
                        name="password"
                        placeholder="Mật khẩu"
                        maxLength={20}
                        value={form.password}
                        onChange={handleChangInput}
                        id="password"
                    />
                </div>
            </div>

            <div className={styles.wrapper_juilt}>
                <div className={styles.wrapper}>
                    <div className={styles.labelGroup}>
                        <label htmlFor="password_confirmation">
                            Nhập lại mật khẩu
                        </label>
                    </div>
                </div>

                <div className={styles.inputWrap}>
                    <input
                        type="password"
                        name="password_confirmation"
                        placeholder="Nhập lại mật khẩu"
                        maxLength={20}
                        value={form.password_confirmation}
                        onChange={handleChangInput}
                        id="password_confirmation"
                    />
                </div>
            </div>

            {errs.message && <p className={styles.message}>{errs.message}</p>}

            <button
                ref={btnSubmit}
                className={`${styles.wrapperBtn} ${styles.btnPrimary} ${styles.rounded} ${styles.disabled}`}
            >
                Đăng ký
            </button>
        </form>
    ) : (
        <form action="" onSubmit={handleSubmit}>
            <div className={styles.wrapper_juilt}>
                <div className={styles.wrapper}>
                    <div className={styles.labelGroup}>
                        <label htmlFor="email">email</label>
                    </div>
                </div>

                <div className={styles.inputWrap}>
                    <input
                        type="text"
                        name="email"
                        placeholder="email"
                        maxLength={50}
                        value={form.email}
                        onChange={handleChangInput}
                        id="email"
                    />
                </div>
            </div>

            <div className={styles.wrapper_juilt}>
                <div className={styles.wrapper}>
                    <div className={styles.labelGroup}>
                        <label htmlFor="password">Mật khẩu</label>
                    </div>
                </div>

                <div className={styles.inputWrap}>
                    <input
                        type="password"
                        name="password"
                        placeholder="Mật khẩu"
                        maxLength={20}
                        value={form.password}
                        onChange={handleChangInput}
                        id="password"
                    />
                </div>
            </div>

            {errs.message && <p className={styles.message}>{errs.message}</p>}

            <button
                ref={btnSubmit}
                className={`${styles.wrapperBtn} ${styles.btnPrimary} ${styles.rounded} ${styles.disabled}`}
            >
                {type === "register" ? "đăng ký" : "đăng nhập"}
            </button>
        </form>
    );
}

export default Form;
