import { useState } from "react";

import styles from "./AuthenticationApp.module.scss";
import Header from "./components/Header";
import Main from "./components/Main";

function AuthenticationApp() {
    const accessType = localStorage.getItem("access") ?? "";

    return (
        <>
            <div className={styles.magic}></div>
            <div className={styles.wrapperContainer}>
                <div className={styles.wrapper}>
                    <Header swapAccessType={accessType} />
                    <Main type={accessType} />
                </div>
            </div>
        </>
    );
}

export default AuthenticationApp;
