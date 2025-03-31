import React from "react";

import styles from "./Input.module.scss";

function Input({
    labelName = "",
    name = "",
    register = () => ({}),
    message = {},
    type = "text",
    ...remain
}) {
    return (
        <div className={styles.wrapper_juilt}>
            <div className={styles.wrapper}>
                <div className={styles.labelGroup}>
                    <label htmlFor={name}>{labelName}</label>
                </div>
            </div>

            <div className={styles.inputWrap}>
                <input
                    type={type}
                    {...register(name)}
                    placeholder={labelName}
                    id={name}
                    {...remain}
                />
            </div>

            {message && (
                <div className={styles.message}>{message[name]?.message}</div>
            )}
        </div>
    );
}

export default Input;
