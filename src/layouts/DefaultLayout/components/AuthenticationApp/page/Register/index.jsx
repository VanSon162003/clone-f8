import Header from "../../components/Header";
import Main from "../../components/Main";

import styles from "./Register.module.scss";

function Register() {
    const accessType = localStorage.getItem("access") ?? "";

    return (
        <>
            <div className={styles.magic}></div>
            <div className={styles.wrapperContainer}>
                <div className={styles.wrapper}>
                    <Header accessType={accessType} back={true} />
                    <Main type="register" accessType={accessType} />
                </div>
            </div>
        </>
    );
}

export default Register;
