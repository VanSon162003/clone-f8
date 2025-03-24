import React from "react";
import styles from "./Button.module.scss";

function Button({ title, type, onClick }) {
    const classType =
        type === "primary"
            ? "primary"
            : type === "secondary"
            ? "secondary"
            : "text";

    return (
        <button onClick={onClick} className={styles[classType]}>
            {" "}
            {title}
        </button>
    );
}

export default Button;
