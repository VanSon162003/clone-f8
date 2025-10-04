import React, { useEffect, useRef } from "react";
import styles from "./Model.module.scss";
import Button from "../Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
function Model({ children, onCancel, notOverlayCancel = false }) {
    return (
        <div className={styles.model}>
            <div
                className={styles.overlay}
                onClick={() => !notOverlayCancel && onCancel()}
            ></div>
            <div
                onClick={(e) => e.stopPropagation()}
                className={styles.content}
            >
                <Button onClick={() => onCancel()} className={styles.close}>
                    <FontAwesomeIcon icon={faClose} />
                </Button>
                {children}
            </div>
        </div>
    );
}

export default Model;
