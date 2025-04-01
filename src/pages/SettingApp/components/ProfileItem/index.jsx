import React from "react";

import styles from "./ProfileItem.module.scss";
import Button from "@/components/Button";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

function ProfileItem({ label = "", value = "" }) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <h4 className={styles.label}>{label}</h4>
                <span className={styles.value}>
                    {value ? value : "Chưa cập nhật"}
                </span>
            </div>

            <Button className={styles.rightBtn} icon={faChevronRight} />
        </div>
    );
}

export default ProfileItem;
