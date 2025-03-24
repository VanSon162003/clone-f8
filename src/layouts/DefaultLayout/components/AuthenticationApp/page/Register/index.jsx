import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Main from "../../components/Main";

import styles from "./Register.module.scss";
import { data } from "react-router-dom";

function Register() {
    const accessType = localStorage.getItem("access") ?? "";

    const [regisForm, setRegisForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    return (
        <>
            <div className={styles.magic}></div>
            <div className={styles.wrapperContainer}>
                <div className={styles.wrapper}>
                    <Header accessType={accessType} back={true} />
                    <Main
                        form={regisForm}
                        setForm={setRegisForm}
                        type="register"
                        accessType={accessType}
                    />
                </div>
            </div>
        </>
    );
}

export default Register;
