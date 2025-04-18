import Button from "@/components/Button";
import {} from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import styles from "./SettingApp.module.scss";

function SettingApp() {
    return (
        <>
            <div className={styles.wrapperContainer}>
                <Button
                    to="/"
                    icon={faXmark}
                    className={`d-flex-center ${styles.close}`}
                />
                <iframe className={styles.wrapper} src="/Setting"></iframe>
            </div>
        </>
    );
}

export default SettingApp;
