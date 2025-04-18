import styles from "./ProfileItem.module.scss";
import Button from "@/components/Button";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import userImg from "@/assets/imgs/user.jpg";

const typeArr = [
    "username",
    "age",
    "gender",
    "email",
    "phone",
    "birthDate",
    "emailVerifiedAt",
    "file",
    "changePassword",
    "verify",
];

function ProfileItem({
    label = "",
    value = "",
    type = "",
    user = {},
    setShowFormItem = () => {},
    setTypeFormItem = () => {},
}) {
    const handleClick = (e) => {
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
                        src={user?.image ? user?.image : userImg}
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
