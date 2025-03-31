import ProfileType from "../ProfileType";

import styles from "./Profile.module.scss";

function Profile() {
    return (
        <main className={styles.content}>
            <h1 className={styles.title}>Thông tin cá nhân </h1>
            <p className={styles.desc}>Quản lý thông tin cá nhân của bạn.</p>

            <div className={styles.inner}>
                <ProfileType type="user" />
            </div>
        </main>
    );
}

export default Profile;
