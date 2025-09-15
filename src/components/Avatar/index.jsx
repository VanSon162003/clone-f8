import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Avatar.module.scss";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import Button from "../Button";

function Avatar({
    admin,
    authorName,
    avatar,
    pro,
    authorPro = false,
    fontSize,
    blog = false,
    username,
}) {
    return (
        <>
            {blog ? (
                <a href={username}>
                    <div
                        style={{
                            "--font-size": fontSize,
                        }}
                        className={`${styles.avatar} ${
                            authorPro && styles.pro
                        }`}
                    >
                        <img src={avatar} alt={authorName} />

                        {authorPro && (
                            <img src={pro} alt="pro" className={styles.crown} />
                        )}
                    </div>
                </a>
            ) : (
                <div>
                    <div
                        style={{
                            "--font-size": fontSize,
                        }}
                        className={`${styles.avatar} ${
                            authorPro && styles.pro
                        }`}
                    >
                        <img src={avatar} alt={authorName} />

                        {authorPro && (
                            <img src={pro} alt="pro" className={styles.crown} />
                        )}
                    </div>
                </div>
            )}

            {blog ? (
                <div className={styles.info}>
                    <Button href={username}>
                        <span className={styles.useName}>{authorName}</span>
                    </Button>

                    <p className={styles.time}>
                        19 giờ trước <span className={styles.dot}>·</span> 1
                        phút đọc
                    </p>
                    {admin && (
                        <FontAwesomeIcon
                            className={styles.iconLike}
                            icon={faCircleCheck}
                        />
                    )}
                </div>
            ) : (
                <div>
                    <Button href={username}>
                        <span className={styles.useName}>{authorName}</span>
                    </Button>
                    {admin && (
                        <FontAwesomeIcon
                            className={styles.iconLike}
                            icon={faCircleCheck}
                        />
                    )}
                </div>
            )}
        </>
    );
}

export default Avatar;
