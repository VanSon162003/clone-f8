import React, { useState } from "react";
import Header from "../../components/Header";
import Main from "../../components/Main";

import styles from "./Login.module.scss";

function Login() {
    const accessType = localStorage.getItem("access") ?? "";
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
    });
    return (
        <>
            <div className={styles.magic}></div>
            <div className={styles.wrapperContainer}>
                <div className={styles.wrapper}>
                    <Header accessType={accessType} back={true} />
                    <Main
                        type="login"
                        accessType={accessType}
                        form={loginForm}
                        setForm={setLoginForm}
                    />
                </div>
            </div>
        </>
    );
}

export default Login;
