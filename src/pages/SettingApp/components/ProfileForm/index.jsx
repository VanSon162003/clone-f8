import Magic from "@/components/Magic";
import Button from "@/components/Button";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import Input from "@/layouts/DefaultLayout/components/AuthenticationApp/components/Input";
import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import authService from "@/services/authService";
import { toast } from "react-toastify";

import styles from "./ProfileForm.module.scss";
import schemaProfile from "@/schema/schemaProfile";
import useDebounce from "@/hook/useDebounce";
import { useUpdateCurrentUserMutation } from "@/services/ProfileService";

function ProfileForm({
    user = {},
    setShowForm = () => {},
    setIsRoll = () => {},
}) {
    const [updateUser, { isLoading, error }] = useUpdateCurrentUserMutation();

    const {
        register,
        handleSubmit,
        watch,
        trigger,
        setError,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: {
            username: user?.username,
            age: user?.age,
            gender: user?.gender === "male" ? "nam" : "nữ",

            email: user?.email,
            phone: user?.phone,
            birthDate: user?.birthDate,
        },
        resolver: yupResolver(schemaProfile),
    });

    const onSubmit = (data) => {
        if (!isValid) {
            return;
        }

        const newData = Object.fromEntries(
            Object.entries(data).filter(([key, value]) => value !== null)
        );

        if (newData.gender) {
            const genderMap = {
                nam: "male",
                nu: "female",
                nữ: "female",
            };

            newData.gender = genderMap[newData.gender] || newData.gender;
        }

        if (newData) {
            (async () => {
                try {
                    const res = await updateUser(newData);

                    if (res) {
                        toast.success("Cập nhật thành công", {
                            autoClose: 3000,
                        });
                        setShowForm(false);

                        setTimeout(() => {
                            window.top.location.replace(
                                "/setting/p/" + newData.username
                            );
                            window.location.reload();
                        }, 1500);
                    }
                } catch (error) {
                    toast.error("Cập nhập thất bại", { autoClose: 3000 });
                }
            })();
        }
    };

    useEffect(() => {
        setIsRoll(true);
    }, [setIsRoll]);

    const ageValue = useDebounce(watch("age"), 600);
    const genderValue = useDebounce(watch("gender"), 600);
    const emailValue = useDebounce(watch("email"), 600);
    const phoneValue = useDebounce(watch("phone"), 600);
    const usernameValue = useDebounce(watch("username"), 600);

    useEffect(() => {
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                setShowForm(false);
                setIsRoll(false);
            }
        });

        if (ageValue) {
            if (ageValue < 0) {
                setError("age", {
                    message: "Tuổi không thể nhỏ hơn 0",
                });
            }
        }
    }, [ageValue]);

    useEffect(() => {
        if (genderValue) {
            (async () => {
                const ok = await trigger("gender");
                if (ok) {
                    const validGenders = ["nam", "nữ", "nu"];
                    if (!validGenders.includes(genderValue.toLowerCase())) {
                        setError("gender", {
                            message: "Giới tính gồm: nam, nữ",
                        });
                    }
                }
            })();
        }
    }, [genderValue]);

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
    }, [emailValue]);

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
    }, [phoneValue]);

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
    }, [usernameValue]);

    return (
        <form
            action=""
            className={styles.wrapper}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div
                className={styles.overlay}
                onClick={() => {
                    setShowForm(false);
                    setIsRoll(false);
                }}
            ></div>
            <div className={styles.inner}>
                <Magic position="absolute" zIndex={"-1"} />

                <div className={styles.control}>
                    <Button
                        onClick={() => {
                            setShowForm(false);
                            setIsRoll(false);
                        }}
                        href="#"
                        icon={faXmark}
                        className={styles.close}
                    />
                </div>

                <header className={styles.header}>
                    <h2 className={styles.title}>Cập nhật thông tin của bạn</h2>
                    <p className={styles.desc}>
                        Thông tin của bạn sẽ phản ánh ra giao diện
                    </p>
                </header>

                <main className={styles.content}>
                    <Input
                        labelName="Họ và tên"
                        name="username"
                        register={register}
                        message={errors}
                    />

                    <Input
                        labelName="Tuổi"
                        name="age"
                        register={register}
                        message={errors}
                        type="number"
                        max="120"
                    />

                    <Input
                        labelName="Giới tính"
                        name="gender"
                        register={register}
                        message={errors}
                    />

                    <Input
                        labelName="Email"
                        name="email"
                        register={register}
                        message={errors}
                    />

                    <Input
                        labelName="Số điện thoại"
                        name="phone"
                        register={register}
                        message={errors}
                        type="number"
                    />

                    <Input
                        labelName="Ngày tháng năm sinh"
                        name="birthDate"
                        register={register}
                        message={errors}
                        type="date"
                    />

                    <Button
                        isLoading={isLoading}
                        className={`${styles.wrapperBtn} ${styles.btnPrimary} ${
                            styles.rounded
                        } ${!isValid && styles.disabled} `}
                    >
                        Cập nhật
                    </Button>
                </main>
            </div>
        </form>
    );
}

export default ProfileForm;
