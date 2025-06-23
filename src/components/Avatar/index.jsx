import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Avatar.module.scss";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

function Avatar({ admin, authorName, avatar, pro, authorPro }) {
    return (
        <>
            <div>
                <div className={`${styles.avatar} ${authorPro && styles.pro}`}>
                    <img src={avatar} alt={authorName} />

                    {authorPro && (
                        <img src={pro} alt="pro" className={styles.crown} />
                    )}
                </div>
            </div>

            <div>
                <span className={styles.useName}>{authorName}</span>

                {admin && (
                    <FontAwesomeIcon
                        className={styles.iconLike}
                        icon={faCircleCheck}
                    />
                )}
            </div>
        </>
    );
}

export default Avatar;
