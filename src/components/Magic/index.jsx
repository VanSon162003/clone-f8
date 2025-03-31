import React from "react";

import styles from "./Magic.module.scss";
function Magic({ position = "", zIndex = 0 }) {
    return (
        <div
            style={{ position: position, zIndex: zIndex }}
            className={styles.magic}
        ></div>
    );
}

export default Magic;
