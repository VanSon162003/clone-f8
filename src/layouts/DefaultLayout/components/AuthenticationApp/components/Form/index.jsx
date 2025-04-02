import { useEffect, useState } from "react";
import useQuery from "@/hook/useQuery";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import authService from "@/services/authService";
import Input from "../Input";
import { setToken } from "@/utils/httpRequest";
import schemaRegister from "@/schema/schemaRegister";
import schemaLogin from "@/schema/schemaLogin";

import styles from "./Form.module.scss";
import Button from "@/components/Button";

function Form({ type = "" }) {
    const {
        register,
        handleSubmit,
        trigger,
        setError,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(
            type === "register" ? schemaRegister : schemaLogin
        ),
    });

    const [isLoading, setIsLoading] = useState(false);

    const [respone, setRespone] = useState();

    const [messageErr, setMessageErr] = useState("");

    const { param } = useQuery();

    const emailValue = watch("email");

    const passwordValue = watch("password");

    useEffect(() => {
        if (emailValue) {
            if (type === "register") {
                const timeID = setTimeout(async () => {
                    const ok = await trigger("email");
                    if (ok) {
                        const res = await authService.checkEmail(emailValue);
                        if (res) {
                            setError("email", {
                                message: "email đã được sử dụng",
                            });
                        }
                    }
                }, 800);

                return () => {
                    clearTimeout(timeID);
                };
            }
        }
    }, [emailValue]);

    useEffect(() => {
        setMessageErr("");
    }, [emailValue, passwordValue]);

    console.log(isLoading);

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            if (type === "register") {
                const res = await authService.register(data);
                setRespone(res);
            } else {
                const res = await authService.login(data);
                setRespone(res);
            }
        } catch (error) {
            setMessageErr(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (respone?.access_token) {
        setToken(respone?.access_token);
        window.top.location.href = `http://localhost:5173${
            param.get("continue") ? param.get("continue") : ""
        }`;
    }

    return type === "register" ? (
        <form action="" onSubmit={handleSubmit(onSubmit)}>
            <Input
                labelName={"Tên"}
                name={"firstName"}
                message={errors}
                register={register}
            />
            <Input
                labelName={"Tên đệm"}
                name={"lastName"}
                message={errors}
                register={register}
            />
            <Input
                labelName={"email"}
                name={"email"}
                message={errors}
                register={register}
            />
            <Input
                labelName={"Mật khẩu"}
                name={"password"}
                message={errors}
                type="password"
                register={register}
            />
            <Input
                labelName={"Nhập lại mật khẩu"}
                name={"password_confirmation"}
                message={errors}
                type="password"
                register={register}
            />

            <Button
                isLoading={isLoading}
                className={`${styles.wrapperBtn} ${styles.btnPrimary} ${styles.rounded} `}
            >
                Đăng ký
            </Button>
        </form>
    ) : (
        <form action="" onSubmit={handleSubmit(onSubmit)}>
            <Input
                labelName={"email"}
                name={"email"}
                message={errors}
                register={register}
            />
            <Input
                labelName={"Mật khẩu"}
                name={"password"}
                message={errors}
                register={register}
                type="password"
            />

            {messageErr && (
                <div className={styles.message}>
                    {messageErr === "Invalid credentials"
                        ? "tài khoản hoặc mật khẩu không đúng"
                        : messageErr}
                </div>
            )}

            <Button
                isLoading={isLoading}
                className={`${styles.wrapperBtn} ${styles.btnPrimary} ${styles.rounded} `}
            >
                {type === "register" ? "đăng ký" : "đăng nhập"}
            </Button>
        </form>
    );
}

export default Form;
