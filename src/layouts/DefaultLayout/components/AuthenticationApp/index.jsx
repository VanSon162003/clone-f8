import { useState } from "react";

import styles from "./AuthenticationApp.module.scss";
import Header from "./components/Header";
import Main from "./components/Main";

function AuthenticationApp() {
    const accessType = localStorage.getItem("access") ?? "";

    const [swapAccessType, setSwapAccessType] = useState(accessType);

    return (
        <>
            <div className={styles.magic}></div>
            <div className={styles.wrapperContainer}>
                <div className={styles.wrapper}>
                    <Header swapAccessType={swapAccessType} />
                    <Main
                        swapAccessType={swapAccessType}
                        setSwapAccessType={setSwapAccessType}
                    />
                </div>
            </div>
        </>
    );
}

export default AuthenticationApp;
