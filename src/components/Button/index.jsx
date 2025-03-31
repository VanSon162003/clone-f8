import clsx from "clsx";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

import styles from "./Button.module.scss";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
function Button({
    children,
    icon,
    className = "",
    primary,
    secondary,
    normal,
    text,
    size = "",
    rounded,
    isLoading = false,
    disabled = false,
    to = "",
    href = "",
    onClick,
    ...remaining
}) {
    let Component = "button";

    const passProp = {};

    if (to) {
        Component = Link;
        passProp.to = to;
    }

    if (href) {
        Component = "a";
        passProp.href = href;
    }

    const handleClick = () => {
        if (disabled || isLoading) return;

        onClick && onClick();
    };

    return (
        <Component
            {...passProp}
            {...remaining}
            onClick={handleClick}
            className={clsx(styles.wrapper, className, styles[size], {
                [styles.primary]: primary,
                [styles.secondary]: secondary,
                [styles.normal]: normal,
                [styles.text]: text,
                [styles.rounded]: rounded,
                [styles.disabled]: disabled || isLoading,
            })}
        >
            {isLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
                <>
                    {icon && <FontAwesomeIcon icon={icon} />}
                    {children}
                </>
            )}
        </Component>
    );
}

Button.propTypes = {
    children: PropTypes.node.isRequired,
    icon: PropTypes.object,
    className: PropTypes.string,
    primary: PropTypes.bool,
    secondary: PropTypes.bool,
    normal: PropTypes.bool,
    text: PropTypes.bool,
    size: PropTypes.oneOf(["small", "medium", "large"]),
    rounded: PropTypes.bool,
    isLoading: PropTypes.bool,
    disabled: PropTypes.bool,
    to: PropTypes.string,
    href: PropTypes.string,
    onClick: PropTypes.func,
    remaining: PropTypes.object,
};

export default Button;
