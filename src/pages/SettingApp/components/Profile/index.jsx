import ProfileType from "../ProfileType";

import styles from "./Profile.module.scss";

function Profile({ type = "" }) {
    const title = type === "user" ? "Thông tin cơ bản" : "Mật khẩu và bảo mật";
    const desc =
        type === "user"
            ? "Quản lý thông tin cá nhân của bạn."
            : "Quản lý mật khẩu và cài đặt bảo mật.";

    return (
        <main className={styles.content}>
            <h1 className={styles.title}>{title} </h1>
            <p className={styles.desc}>{desc}</p>

            <div className={styles.inner}>
                <ProfileType type={type} />
            </div>
        </main>
    );
}

export default Profile;
