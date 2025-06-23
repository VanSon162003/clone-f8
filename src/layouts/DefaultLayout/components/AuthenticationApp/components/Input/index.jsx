import userImg from "@/assets/imgs/user.jpg";

import styles from "./Input.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function Input({
    labelName = "",
    placeholder = "",
    name = "",
    register = (name) => ({}),
    message = {},
    type = "text",
    setUrl = () => {},
    setAvatar = () => {},
    url = "",
    user = {},
    textArea,
    ...remain
}) {
    const handleChangle = (e) => {
        const file = e.target.files[0];
        const urlFile = URL.createObjectURL(file);

        setAvatar(file);
        setUrl(urlFile);
    };

    return (
        <div className={styles.wrapper_juilt}>
            {type === "file" ? (
                <>
                    <input
                        type={type}
                        accept="image/*"
                        id="avatar"
                        hidden
                        onChange={handleChangle}
                    />
                    <label className={styles.labelWrap} htmlFor="avatar">
                        <img src={user?.image ? user?.image : userImg} alt="" />
                    </label>

                    <label className={styles.addNew} htmlFor="avatar">
                        <FontAwesomeIcon icon={faPlus} />
                        Tải ảnh mới lên
                    </label>
                </>
            ) : type === "review" ? (
                <>
                    <div
                        className={styles.wrapper}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            marginTop: " 20px",
                        }}
                    >
                        <img
                            width={250}
                            height={250}
                            style={{ borderRadius: "50%" }}
                            src={url}
                            alt=""
                        />
                    </div>
                </>
            ) : (
                <>
                    <div className={styles.wrapper}>
                        <div className={styles.labelGroup}>
                            <label htmlFor={name}>{labelName}</label>
                        </div>
                    </div>

                    {textArea ? (
                        <textarea
                            className={`${styles.textArea} ${
                                message[name] ? styles.invalid : ""
                            }`}
                            type={type}
                            {...register(name)}
                            placeholder={placeholder ? placeholder : labelName}
                            id={name}
                            {...remain}
                        ></textarea>
                    ) : (
                        <div
                            className={`${styles.inputWrap} ${
                                message[name] ? styles.invalid : ""
                            }`}
                        >
                            <input
                                type={type}
                                {...register(name)}
                                placeholder={
                                    placeholder ? placeholder : labelName
                                }
                                id={name}
                                {...remain}
                            />

                            {message[name] && (
                                <span
                                    className={`${styles.errorIcon} ${styles.iconContainer}`}
                                >
                                    <svg
                                        className={styles.icon}
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                    >
                                        <path
                                            d="M0 0h16v16H0V0z"
                                            fill="none"
                                        ></path>
                                        <path
                                            d="M15.2 13.1L8.6 1.6c-.2-.4-.9-.4-1.2 0L.8 13.1c-.1.2-.1.5 0 .7.1.2.3.3.6.3h13.3c.2 0 .5-.1.6-.3.1-.2.1-.5-.1-.7zM8.7 12H7.3v-1.3h1.3V12zm0-2.7H7.3v-4h1.3v4z"
                                            fill="currentColor"
                                        ></path>
                                    </svg>
                                </span>
                            )}
                        </div>
                    )}
                </>
            )}

            {message && (
                <div className={styles.message}>{message[name]?.message}</div>
            )}
        </div>
    );
}

export default Input;
