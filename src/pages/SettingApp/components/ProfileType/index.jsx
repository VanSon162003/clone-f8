import { useEffect, useState } from "react";

import styles from "./ProfileType.module.scss";
import ProfileItem from "../ProfileItem";
import authService from "@/services/authService";
import ProfileForm from "../ProfileForm";
import useRoll from "@/hook/useRoll";

function ProfileType({ type = "" }) {
    const [user, setUser] = useState(null);

    const [showForm, setShowForm] = useState(false);

    const [setIsRoll] = useRoll();

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
    }, [type]);

    const verify = user?.emailVerifiedAt
        ? "Tài khoản đã được xác minh"
        : "Tài khoản chưa xác minh";

    const gender = user?.gender === "male" ? "nam" : "nữ";

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN");
    };

    return (
        <>
            <section className={styles.wrapper}>
                <div className={styles.header}>
                    <div>
                        <h2 className={styles.title}>Thông tin cơ bản</h2>
                        <p className={styles.desc}>
                            Quản lý tên hiển thị, tên người dùng, bio và avatar
                            của bạn.
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setShowForm(true);
                        }}
                        className={styles.updateBtn}
                    >
                        sửa
                    </button>
                </div>

                <div className={styles.content}>
                    <ProfileItem label={"Họ và tên"} value={user?.username} />
                    <ProfileItem label={"Tuổi"} value={user?.age} />
                    <ProfileItem label={"Giới tính"} value={gender} />
                    <ProfileItem label={"Email"} value={user?.email} />
                    <ProfileItem label={"Số điện thoại"} value={user?.phone} />
                    <ProfileItem
                        label={"Ngày tháng năm sinh"}
                        value={user?.birthDate}
                    />
                    <ProfileItem
                        label={"Ngày tạo"}
                        value={formatDate(user?.createdAt)}
                    />
                    <ProfileItem label={"Xác minh tài khoản"} value={verify} />
                </div>
            </section>

            {showForm && (
                <ProfileForm
                    setIsRoll={setIsRoll}
                    user={user}
                    setShowForm={setShowForm}
                />
            )}
        </>
    );
}

export default ProfileType;
