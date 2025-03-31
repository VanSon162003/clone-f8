import React, { useEffect, useState } from "react";

import styles from "./ProfileType.module.scss";
import ProfileItem from "../ProfileItem";
import authService from "@/services/authService";

function ProfileType({ type = "" }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        type === "user" &&
            (async () => {
                try {
                    const data = await authService.getCurrentUser();
                    data.user && setUser(data.user);
                } catch (error) {
                    console.log(error);
                }
            })();
    }, []);
    return (
        <section className={styles.wrapper}>
            <div className={styles.header}>
                <h2 className={styles.title}>Thông tin cơ bản</h2>
                <p className={styles.desc}>
                    Quản lý tên hiển thị, tên người dùng, bio và avatar của bạn.
                </p>
            </div>

            <div className={styles.content}>
                <ProfileItem label={"Họ và tên"} value={user?.username} />
                <ProfileItem label={"Tuổi"} value={user?.age} />
                <ProfileItem label={"Giới tính"} value={user?.gender} />
                <ProfileItem label={"Email"} value={user?.email} />
                <ProfileItem label={"Số điện thoại"} value={user?.phone} />
                <ProfileItem
                    label={"Ngày tháng năm sinh"}
                    value={user?.birthDate}
                />
                <ProfileItem label={"Ngày tạo"} value={user?.createdAt} />
                <ProfileItem
                    label={"Xác minh tài khoản"}
                    value={user?.emailVerifiedAt}
                />
            </div>
        </section>
    );
}

export default ProfileType;
