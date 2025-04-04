import { useEffect, useState } from "react";
import styles from "./ProfileFormItem.module.scss";
import Magic from "@/components/Magic";
import Button from "@/components/Button";
import { faChevronLeft, faXmark } from "@fortawesome/free-solid-svg-icons";
import Input from "@/layouts/DefaultLayout/components/AuthenticationApp/components/Input";
import authService from "@/services/authService";
import { toast } from "react-toastify";

function ProfileFormItem({
    type = "",
    setShowFormItem = () => {},
    setIsRoll = () => {},
    user = {},
}) {
    const [isLoading, setIsloading] = useState(false);

    const [avatar, setAvatar] = useState({});
    const [url, setUrl] = useState("");

    console.log(user);

    useEffect(() => {
        return () => {
            URL.revokeObjectURL(url);
        };
    }, [url]);

    useEffect(() => {
        setIsRoll(true);
    }, [setIsRoll]);

    const title = type === "file" ? "Ảnh đại diện" : "";
    const desc =
        type === "file"
            ? "Ảnh đại diện giúp mọi người nhận biết bạn dễ dàng hơn qua các bài viết, bình luận, tin nhắn..."
            : "";

    const handleSubmitAvatar = async (e) => {
        e.preventDefault();
        if (!avatar) return;
        console.log(avatar);

        setIsloading(true);
        const formData = new FormData();
        formData.append("image", avatar);

        try {
            const res = await authService.updateUserImg(formData);

            if (res) {
                setShowFormItem(false);
                setIsRoll(false);
                toast.success("Cập nhật thành công");

                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        } catch (error) {
            console.log(error);
            toast.error("Cập nhập thất bại");
        } finally {
            setIsloading(false);
        }
    };

    return url ? (
        <form
            action=""
            className={styles.wrapper}
            onSubmit={handleSubmitAvatar}
        >
            <div className={styles.overlay}></div>
            <div className={styles.inner}>
                <Magic position="absolute" zIndex={"-1"} />
                <div className={styles.control}>
                    <Button
                        href="#"
                        icon={faChevronLeft}
                        className={styles.back}
                        onClick={() => setUrl("")}
                    />
                    <Button
                        href="#"
                        icon={faXmark}
                        className={styles.closeUrl}
                        onClick={() => {
                            setShowFormItem(false);
                            setIsRoll(false);
                        }}
                    />
                </div>
                <header className={styles.header}>
                    <h2 className={styles.title}>Xem trước</h2>
                </header>
                <main className={styles.content}>
                    <Input type="review" url={url} />
                    <Button
                        isLoading={isLoading}
                        className={`${styles.wrapperBtn} ${styles.btnPrimary} ${styles.rounded} `}
                    >
                        Cập nhật
                    </Button>
                </main>
            </div>
        </form>
    ) : (
        <form action="" className={styles.wrapper}>
            <div className={styles.overlay}></div>
            <div className={styles.inner}>
                <Magic position="absolute" zIndex={"-1"} />

                <div className={styles.control}>
                    <Button
                        href="#"
                        icon={faXmark}
                        className={styles.close}
                        onClick={() => {
                            setShowFormItem(false);
                            setIsRoll(false);
                        }}
                    />
                </div>

                <header className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.desc}>{desc}</p>
                </header>

                <main className={styles.content}>
                    <Input
                        user={user}
                        type="file"
                        setAvatar={setAvatar}
                        setUrl={setUrl}
                    />
                    {type === "file" ? (
                        ""
                    ) : (
                        <Button
                            isLoading={isLoading}
                            className={`${styles.wrapperBtn} ${styles.btnPrimary} ${styles.rounded}  `}
                        >
                            Cập nhật
                        </Button>
                    )}
                </main>
            </div>
        </form>
    );
}

export default ProfileFormItem;
