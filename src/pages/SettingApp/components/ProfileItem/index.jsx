import styles from "./ProfileItem.module.scss";
import Button from "@/components/Button";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import userImg from "@/assets/imgs/user.jpg";
import isHttps from "@/utils/isHttps";

const typeArr = [
    "username",
    "fullname",
    "about",

    "file",
    "changePassword",
    "verify",
    // social types (allow opening form for these types)
    "website",
    "github",
    "linkedin",
    "facebook",
    "youtube",
    "tiktok",
];

function ProfileItem({
    label = "",
    value = "",
    type = "",
    user = {},
    setShowFormItem = () => {},
    setTypeFormItem = () => {},
}) {
    const handleClick = () => {
        setShowFormItem(true);

        typeArr.includes(type) && setTypeFormItem(type);
    };

    return (
        <div
            className={`${styles.wrapper} ${type === "file" && styles.hasImg}`}
            onClick={() => {
                handleClick();
            }}
        >
            <div className={styles.content}>
                <h4 className={styles.label}>{label}</h4>
                {type === "file" ? (
                    <img
                        src={
                            user?.avatar
                                ? isHttps(user?.avatar)
                                    ? user?.avatar
                                    : `${import.meta.env.VITE_BASE_URL}${
                                          user?.avatar
                                      }`
                                : userImg
                        }
                        alt="user"
                        className={styles.img}
                    />
                ) : (
                    <span className={styles.value}>
                        {value ? value : "Chưa cập nhật"}
                    </span>
                )}
            </div>

            <Button className={styles.rightBtn} icon={faChevronRight} />
        </div>
    );
}

export default ProfileItem;
