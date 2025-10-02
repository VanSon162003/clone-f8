import React from "react";
import styles from "./Model.module.scss";
import Button from "../Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
function Model({ children }) {
    return (
        <div className={styles.model}>
            <div className={styles.overlay}></div>
            <div className={styles.content}>
                <Button className={styles.close}>
                    <FontAwesomeIcon icon={faClose} />
                </Button>
                {children}
            </div>
        </div>
    );
}

export default Model;
