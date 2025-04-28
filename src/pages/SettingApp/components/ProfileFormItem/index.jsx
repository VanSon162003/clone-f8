import { useEffect, useState } from "react";
import styles from "./ProfileFormItem.module.scss";
import Magic from "@/components/Magic";
import Button from "@/components/Button";
import { faChevronLeft, faXmark } from "@fortawesome/free-solid-svg-icons";
import Input from "@/layouts/DefaultLayout/components/AuthenticationApp/components/Input";
import authService from "@/services/authService";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import useDebounce from "@/hook/useDebounce";
import { useUpdateCurrentUserMutation } from "@/services/ProfileService";

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

const storage = {
    username: {
        title: "Cập nhật tên của bạn",
        desc: "Tên sẽ được hiển thị trên trang cá nhân, trong các bình luận và bài viết của bạn.",
    },

    age: {
        title: "Cập nhật tuổi của bạn",
        desc: "Tuổi sẽ được hiển thị trên trang cá nhân của bạn.",
    },

    gender: {
        title: "Cập nhật giới tính của bạn",
        desc: "Giới tính sẽ được hiển thị trên trang cá nhân của bạn.",
    },

    email: {
        title: "Cập nhật email của bạn",
        desc: "Email sẽ được hiển thị trên trang cá nhân, trong các bình luận và bài viết của bạn.",
    },

    phone: {
        title: "Cập nhật số điện thoại của bạn",
        desc: "Số điện thoại sẽ được hiển thị trên trang cá nhân, trong các bình luận và bài viết của bạn.",
    },

    birthDate: {
        title: "Cập nhật ngày sinh của bạn",
        desc: "Ngày sinh sẽ được hiển thị trên trang cá nhân, trong các bình luận và bài viết của bạn.",
    },

    emailVerifiedAt: {
        title: "Xác minh tài khoản",
        desc: "Chúng tôi đã gửi mã cho bạn qua email hãy nhập mã vào dưới đây để xác minh tài khoản",
    },

    file: {
        title: "Ảnh đại diện",
        desc: "Ảnh đại diện giúp mọi người nhận biết bạn dễ dàng hơn qua các bài viết, bình luận, tin nhắn...",
    },

    changePassword: {
        title: "Đổi mật khẩu",
        desc: "Mật khẩu của bạn phải có tối thiểu 8 ký tự, bao gồm cả chữ số, chữ cái và ký tự đặc biệt (!$@%...).",
    },

    verify: {
        title: "Xác nhận mật khẩu",
        desc: "Để chắc chắn rằng bạn là chủ sở hữu tài khoản, vui lòng nhập mật khẩu hiện tại của bạn.",
    },
};

const label = {
    username: "Họ và tên",
    age: "Tuổi",
    gender: "Giới tính",
    email: "Email",
    phone: "Số điện thoại",
    birthDate: "Ngày sinh",
    emailVerifiedAt: "Nhập mã xác minh",
    file: "",
    changePassword: "",
    verify: "",
};

function ProfileFormItem({
    type = "",
    setShowFormItem = () => {},
    setIsRoll = () => {},
    user = {},
}) {
    const {
        register,
        handleSubmit,
        watch,
        trigger,
        setError,
        formState: { errors },
    } = useForm({
        defaultValues: {
            [type]:
                user[type] === "male"
                    ? "nam"
                    : user[type] === "female"
                    ? "nữ"
                    : user[type],
        },
    });

    const [avatar, setAvatar] = useState({});
    const [url, setUrl] = useState("");

    const [updateUser, { isLoading, error }] = useUpdateCurrentUserMutation();

    useEffect(() => {
        return () => {
            URL.revokeObjectURL(url);
        };
    }, [url]);

    useEffect(() => {
        setIsRoll(true);
    }, [setIsRoll]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setShowFormItem(false);
                setIsRoll(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [setIsRoll, setShowFormItem]);

    const title = storage[type]?.title;
    const desc = storage[type]?.desc;

    const handleSubmitAvatar = async (e) => {
        e.preventDefault();
        if (!avatar) return;
        console.log(avatar);

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
            toast.error("Cập nhập thất bại");
        }
    };

    const gender = watch("gender");

    const emailValue = useDebounce(watch("email"), 600);
    const phoneValue = useDebounce(watch("phone"), 600);
    const usernameValue = useDebounce(watch("username"), 600);

    useEffect(() => {
        if (type === "gender") {
            (async () => {
                const ok = await trigger("gender");
                if (ok) {
                    const validGender = ["nam", "nu", "nữ"];

                    if (!validGender.includes(gender?.toLowerCase())) {
                        setError("gender", {
                            message: "giới tính gồm nam, nữ",
                        });
                    }
                }
            })();
        }
    }, [gender, setError, trigger]);

    useEffect(() => {
        if (emailValue) {
            (async () => {
                const ok = await trigger("email");
                if (ok) {
                    const res = await authService.checkEmail(
                        `${emailValue}&exclude_id=${user?.id}`
                    );
                    if (res) {
                        setError("email", { message: "email đã tồn tại" });
                    }
                }
            })();
        }
    }, [emailValue, setError, trigger, user.id]);

    useEffect(() => {
        if (phoneValue) {
            (async () => {
                const ok = await trigger("phone");
                if (ok) {
                    if (phoneValue.length !== 10) {
                        setError("phone", {
                            message: "Số điện thoại chỉ có 10 số",
                        });
                    } else {
                        const res = await authService.checkPhone(
                            `${phoneValue}&exclude_id=${user?.id}`
                        );
                        if (res) {
                            setError("phone", {
                                message: "số điện thoại đã tồn tại",
                            });
                        }
                    }
                }
            })();
        }
    }, [phoneValue, setError, trigger, user.id]);

    useEffect(() => {
        if (usernameValue) {
            (async () => {
                const ok = await trigger("username");
                if (ok) {
                    const res = await authService.checkUserName(
                        `${usernameValue}&exclude_id=${user?.id}`
                    );
                    if (res) {
                        setError("username", {
                            message: "username đã tồn tại",
                        });
                    }
                }
            })();
        }
    }, [usernameValue, setError, trigger, user.id]);

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("image", avatar);

        if (data.gender) {
            const genderMap = {
                nam: "male",
                nu: "female",
                nữ: "female",
            };

            data.gender = genderMap[data.gender] || data.gender;
        }

        (async () => {
            try {
                const res = await updateUser(data);

                if (res) {
                    toast.success("Cập nhật thành công");
                    setShowFormItem(false);

                    setTimeout(() => {
                        if (type === "username")
                            window.top.location.replace(
                                "/setting/p/" + data.username
                            );
                        window.location.reload();
                    }, 1500);
                }
            } catch (error) {
                console.log(error);

                toast.error("Cập nhập thất bại");
            }
        })();
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
        <form
            action=""
            className={styles.wrapper}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div
                className={styles.overlay}
                onClick={() => {
                    setShowFormItem(false);
                    setIsRoll(false);
                }}
            ></div>
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
                        type={
                            type === "file"
                                ? type
                                : type === "age" || type === "phone"
                                ? "number"
                                : type === "birthDate"
                                ? "date"
                                : "text"
                        }
                        name={type}
                        labelName={label[type]}
                        setAvatar={setAvatar}
                        setUrl={setUrl}
                        register={register}
                        message={errors}
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
