import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useRef, useState } from "react";
import { faBookmark, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import styles from "./Actions.module.scss";
import Tippy from "../Tippy";

function Actions() {
    const [isBookmark, setIsBookmark] = useState(false);
    const [isOptions, setIsOptions] = useState(false);

    const childOptions = useRef(null);

    useEffect(() => {
        function getParentWithClass(element, className) {
            while (element) {
                if (
                    element.classList &&
                    element.classList.contains(className)
                ) {
                    return element;
                }
                element = element.parentElement;
            }
            return undefined;
        }

        const handleSideOptions = (e) => {
            if (getParentWithClass(e.target, "option-area")) return;
            setIsOptions(false);
        };

        const handleEsc = (e) => {
            if (e.key === "Escape") setIsOptions(false);
        };

        document.addEventListener("click", handleSideOptions);
        document.addEventListener("keydown", handleEsc);

        return () => {
            document.removeEventListener("click", handleSideOptions);
            document.removeEventListener("keydown", handleEsc);
        };
    }, []);

    const handleBookmark = () => {
        setIsBookmark((prev) => !prev);
    };

    const handleOption = () => {
        setIsOptions((prev) => !prev);
    };

    return (
        <div className={styles.actions}>
            <div
                onClick={handleBookmark}
                className={`${styles.toggleBtn} ${styles.optionsBtn}`}
            >
                <FontAwesomeIcon
                    className={`${isBookmark && styles.active}`}
                    icon={isBookmark ? faBookmark : faBookmarkRegular}
                />
            </div>

            <div
                ref={childOptions}
                onClick={handleOption}
                className={`${styles.toggleBtn} ${styles.optionsBtn} option-area`}
            >
                <FontAwesomeIcon icon={faEllipsis} />
            </div>

            {isOptions && <Tippy className="option-area" type="options" />}
        </div>
    );
}

export default Actions;
