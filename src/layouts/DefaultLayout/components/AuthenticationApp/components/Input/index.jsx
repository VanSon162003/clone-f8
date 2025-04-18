import userImg from "@/assets/imgs/user.jpg";

import styles from "./Input.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function Input({
    labelName = "",
    name = "",
    register = (name) => ({}),
    message = {},
    type = "text",
    setUrl = () => {},
    setAvatar = () => {},
    url = "",
    user = {},
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
                        {/* <canvas
                            width={375}
                            height={375}
                            style={{
                                width: "100%",
                                height: "100%",
                                cursor: "grab",
                                touchAction: "none",
                            }}
                        /> */}
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

                    <div className={styles.inputWrap}>
                        <input
                            type={type}
                            {...register(name)}
                            placeholder={labelName}
                            id={name}
                            {...remain}
                        />
                    </div>
                </>
            )}

            {message && (
                <div className={styles.message}>{message[name]?.message}</div>
            )}
        </div>
    );
}

export default Input;
