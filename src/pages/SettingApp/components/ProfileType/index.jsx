import { useState } from "react";

import styles from "./ProfileType.module.scss";
import ProfileItem from "../ProfileItem";
import ProfileForm from "../ProfileForm";
import useRoll from "@/hook/useRoll";
import ProfileFormItem from "../ProfileFormItem";
import Loading from "@/components/Loading";
import { useSelector } from "react-redux";
import useCurrentUser from "@/hook/useCurrentUser";

function ProfileType({ type = "" }) {
    const { user } = useCurrentUser();

    const isLoading = useSelector((state) => state.auth.loading);

    const [showForm, setShowForm] = useState(false);
    const [showFormItem, setShowFormItem] = useState(false);
    const [typeFormItem, setTypeFormItem] = useState("");

    const [setIsRoll] = useRoll();

    const verify = user?.emailVerifiedAt
        ? "Tài khoản đã được xác minh"
        : "Tài khoản chưa xác minh";

    const gender = user?.gender === "male" ? "nam" : "nữ";

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN");
    };

    const title =
        type === "user" ? "Thông tin cơ bản" : "Đăng nhập & khôi phục";
    const desc =
        type === "user"
            ? "Quản lý tên hiển thị, tên người dùng, bio và avatar của bạn."
            : "Quản lý mật khẩu và xác minh 2 bước.";

    return (
        <>
            {isLoading && <Loading />}
            <section className={styles.wrapper}>
                <div className={styles.header}>
                    <div>
                        <h2 className={styles.title}>{title}</h2>
                        <p className={styles.desc}>{desc}</p>
                    </div>

                    {type === "user" && (
                        <button
                            onClick={() => {
                                setShowForm(true);
                            }}
                            className={styles.updateBtn}
                        >
                            sửa
                        </button>
                    )}
                </div>

                {type === "user" ? (
                    <div className={styles.content}>
                        <ProfileItem
                            type="username"
                            label={"Họ và tên"}
                            value={user?.username}
                            setShowFormItem={setShowFormItem}
                            setTypeFormItem={setTypeFormItem}
                        />
                        <ProfileItem
                            type="age"
                            label={"Tuổi"}
                            value={user?.age}
                            setShowFormItem={setShowFormItem}
                            setTypeFormItem={setTypeFormItem}
                        />
                        <ProfileItem
                            type="gender"
                            label={"Giới tính"}
                            value={gender}
                            setShowFormItem={setShowFormItem}
                            setTypeFormItem={setTypeFormItem}
                        />
                        <ProfileItem
                            type="email"
                            label={"Email"}
                            value={user?.email}
                            setShowFormItem={setShowFormItem}
                            setTypeFormItem={setTypeFormItem}
                        />
                        <ProfileItem
                            type="phone"
                            label={"Số điện thoại"}
                            value={user?.phone}
                            setShowFormItem={setShowFormItem}
                            setTypeFormItem={setTypeFormItem}
                        />
                        <ProfileItem
                            type="birthDate"
                            label={"Ngày tháng năm sinh"}
                            value={user?.birthDate}
                            setShowFormItem={setShowFormItem}
                            setTypeFormItem={setTypeFormItem}
                        />
                        <ProfileItem
                            type=""
                            label={"Ngày tạo"}
                            value={formatDate(user?.createdAt)}
                            setShowFormItem={setShowFormItem}
                            setTypeFormItem={setTypeFormItem}
                        />
                        <ProfileItem
                            type="emailVerifiedAt"
                            label={"Xác minh tài khoản"}
                            value={verify}
                            setShowFormItem={setShowFormItem}
                            setTypeFormItem={setTypeFormItem}
                        />
                        <ProfileItem
                            type="file"
                            label={"Ảnh đại diện"}
                            setShowFormItem={setShowFormItem}
                            setTypeFormItem={setTypeFormItem}
                            user={user}
                        />
                    </div>
                ) : (
                    <div className={styles.content}>
                        <ProfileItem
                            type="changePassword"
                            label={"Đổi mật khẩu"}
                            value={"chưa đổi mật khẩu"}
                            setShowFormItem={setShowFormItem}
                            setTypeFormItem={setTypeFormItem}
                        />
                        <ProfileItem
                            type="verify"
                            label={"Xác minh 2 bước"}
                            value="Đang tắt"
                            setShowFormItem={setShowFormItem}
                            setTypeFormItem={setTypeFormItem}
                            user={user}
                        />
                    </div>
                )}
            </section>

            {showForm && (
                <ProfileForm
                    setIsRoll={setIsRoll}
                    user={user}
                    setShowForm={setShowForm}
                />
            )}

            {showFormItem && (
                <ProfileFormItem
                    type={typeFormItem}
                    setShowFormItem={setShowFormItem}
                    setIsRoll={setIsRoll}
                    user={user}
                />
            )}
        </>
    );
}

export default ProfileType;
