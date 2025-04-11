import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

import styles from "./Accordion.module.scss";
import React, { useEffect, useRef, useState } from "react";

function Accordion({
    defaultIndex = 0,
    children,
    collapseOthers = true,
    onChange = () => {},
    className = "",
}) {
    const [currentAccordion, setCurrentAccordion] = useState(defaultIndex);
    const [activeIndex, setActiveIndex] = useState(
        collapseOthers ? defaultIndex : []
    );

    const [focused, setFocused] = useState(defaultIndex);

    const accordions = React.Children.toArray(children);
    const prevAcc = useRef(defaultIndex);

    useEffect(() => {
        if (collapseOthers) {
            if (prevAcc.current !== currentAccordion) {
                onChange(currentAccordion);
                prevAcc.current = currentAccordion;
            }
        } else {
            activeIndex.length !== 0 && onChange(activeIndex);
        }
    }, [currentAccordion, activeIndex, collapseOthers, onChange]);

    useEffect(() => {
        const eventKeyDown = (e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                setFocused((prev) =>
                    prev < accordions.length - 1 ? prev + 1 : 0
                );
            }
            if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                setFocused((prev) =>
                    prev > 0 ? prev - 1 : accordions.length - 1
                );
            }
            if (e.key === "Enter" || e.key === " ") {
                if (collapseOthers) setCurrentAccordion(focused);
                else
                    setActiveIndex((prev) =>
                        prev.includes(focused)
                            ? prev.filter((i) => i !== focused)
                            : [...prev, focused]
                    );
            }
        };
        document.addEventListener("keydown", eventKeyDown);
        return () => document.removeEventListener("keydown", eventKeyDown);
    }, [currentAccordion, focused, collapseOthers, accordions.length]);

    const toggleAccordion = (index) => {
        if (collapseOthers) {
            setCurrentAccordion(index === currentAccordion ? null : index);
        } else {
            setActiveIndex((prev) =>
                prev.includes(index)
                    ? prev.filter((i) => i !== index)
                    : [...prev, index]
            );
        }
    };

    const isActive = (index) =>
        collapseOthers
            ? currentAccordion === index
            : activeIndex.includes(index);

    return (
        <div className={`${styles.wrapper} ${className}`}>
            {accordions.map((accordion, i) => (
                <div key={i} className={styles.wrap}>
                    <div
                        className={`${styles.header} ${
                            isActive(i) ? styles.active : ""
                        }  ${focused === i ? styles.focused : ""}`}
                        onClick={() => {
                            toggleAccordion(i);
                            setFocused(i);
                        }}
                    >
                        <button>{accordion.props?.header}</button>
                        <FontAwesomeIcon
                            className={`${styles.icon} ${
                                isActive(i) ? styles.rotate : ""
                            }`}
                            icon={faChevronRight}
                        />
                    </div>

                    {isActive(i) && (
                        <div className={styles.content}>
                            {accordion.props?.children}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Accordion;
