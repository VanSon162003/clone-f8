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

    const [showFormItem, setShowFormItem] = useState(false);
    const [typeFormItem, setTypeFormItem] = useState("");

    const [setIsRoll] = useRoll();

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
                </div>

                {type === "user" ? (
                    <div className={styles.content}>
                        <div className={styles.profile}>
                            <ProfileItem
                                type="fullname"
                                label={"Họ và tên"}
                                value={user?.full_name}
                                setShowFormItem={setShowFormItem}
                                setTypeFormItem={setTypeFormItem}
                            />

                            <ProfileItem
                                type="username"
                                label={"Tên người dùng"}
                                value={user?.username}
                                setShowFormItem={setShowFormItem}
                                setTypeFormItem={setTypeFormItem}
                            />
                            <ProfileItem
                                type="about"
                                label={"Giới thiệu"}
                                value={user?.about || "Chưa có giới thiệu"}
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
                        {/* Social links section */}
                        <div className={styles.socialSection}>
                            <h3 className={styles.title}>
                                Thông tin mạng xã hội
                            </h3>
                            <p className={styles.desc}>
                                Quản lý liên kết tới các trang mạng xã hội của
                                bạn.
                            </p>

                            <div className={styles.social}>
                                <ProfileItem
                                    type="website"
                                    label={"Trang web cá nhân"}
                                    value={user?.website_url || "Chưa cập nhật"}
                                    setShowFormItem={setShowFormItem}
                                    setTypeFormItem={setTypeFormItem}
                                />

                                <ProfileItem
                                    type="github"
                                    label={"GitHub"}
                                    value={user?.github_url || "Chưa cập nhật"}
                                    setShowFormItem={setShowFormItem}
                                    setTypeFormItem={setTypeFormItem}
                                />

                                <ProfileItem
                                    type="linkedin"
                                    label={"LinkedIn"}
                                    value={
                                        user?.linkedkin_url || "Chưa cập nhật"
                                    }
                                    setShowFormItem={setShowFormItem}
                                    setTypeFormItem={setTypeFormItem}
                                />

                                <ProfileItem
                                    type="facebook"
                                    label={"Facebook"}
                                    value={
                                        user?.facebook_url || "Chưa cập nhật"
                                    }
                                    setShowFormItem={setShowFormItem}
                                    setTypeFormItem={setTypeFormItem}
                                />

                                <ProfileItem
                                    type="youtube"
                                    label={"YouTube"}
                                    value={user?.youtube_url || "Chưa cập nhật"}
                                    setShowFormItem={setShowFormItem}
                                    setTypeFormItem={setTypeFormItem}
                                />

                                <ProfileItem
                                    type="tiktok"
                                    label={"TikTok"}
                                    value={user?.tiktok_url || "Chưa cập nhật"}
                                    setShowFormItem={setShowFormItem}
                                    setTypeFormItem={setTypeFormItem}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.content}>
                        {/* Only show change password for non-social (no auth0_id) users */}
                        {!user?.auth0_id && (
                            <ProfileItem
                                type="changePassword"
                                label={"Đổi mật khẩu"}
                                value={"chưa đổi mật khẩu"}
                                setShowFormItem={setShowFormItem}
                                setTypeFormItem={setTypeFormItem}
                            />
                        )}
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
