import React, { useRef } from "react";
import styles from "./Actions.module.scss";
import Button from "@/components/Button";
function Actions() {
    return (
        <div className={`${styles.actions} d-flex-center`}>
            <Button title={"Đăng ký"} type={"text"} />
            <Button title={"Đăng nhập"} type={"primary"} />
        </div>
    );
}

export default Actions;
