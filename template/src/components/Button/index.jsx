import React from "react";
import styles from "./Button.module.scss";

function Button({ title, type }) {
    const classType =
        type === "primary"
            ? "primary"
            : type === "secondary"
            ? "secondary"
            : "text";

    return <button className={styles[classType]}>{title}</button>;
}

export default Button;
