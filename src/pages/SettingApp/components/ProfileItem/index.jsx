import styles from "./ProfileItem.module.scss";
import Button from "@/components/Button";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import userImg from "@/assets/imgs/user.jpg";

function ProfileItem({
    label = "",
    value = "",
    avatar = false,
    user = {},
    setShowFormItem = () => {},
    setTypeFormItem = () => {},
}) {
    const handleClick = (e) => {
        setShowFormItem(true);
        setTypeFormItem("file");
    };

    console.log(user);

    return (
        <div
            className={`${styles.wrapper} ${avatar && styles.hasImg}`}
            onClick={() => {
                avatar && handleClick();
            }}
        >
            <div className={styles.content}>
                <h4 className={styles.label}>{label}</h4>
                {avatar ? (
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
