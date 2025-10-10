import { useEffect, useState } from "react";
import useQuery from "@/hook/useQuery";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import authService from "@/services/authService";
import Input from "../Input";
// import { setToken } from "@/utils/httpRequest";
import schemaRegister from "@/schema/schemaRegister";
import schemaLogin from "@/schema/schemaLogin";

import styles from "./Form.module.scss";
import Button from "@/components/Button";
import useDebounce from "@/hook/useDebounce";
import { useDispatch, useSelector } from "react-redux";
import { accessUser, setAuthErr } from "@/features/auth/authSlice";

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

    const [redirected, setRedirected] = useState(false);
    const { param } = useQuery();

    const passwordValue = watch("password");

    const email = useDebounce(watch("email"), 800);

    const dispatch = useDispatch();

    const isLoading = useSelector((state) => state.auth.loading);
    const respone = useSelector((state) => state.auth.authRespone);

    const messageErr = useSelector((state) => state.auth.error);

    useEffect(() => {
        if (email) {
            if (type === "register") {
                (async () => {
                    const ok = await trigger("email");
                    if (ok) {
                        const res = await authService.checkEmail(email);

                        if (res) {
                            setError("email", {
                                message: "email đã được sử dụng",
                            });
                        }
                    }
                })();
            }
        }
    }, [email]);

    useEffect(() => {
        dispatch(setAuthErr(""));
    }, [email, passwordValue]);

    const onSubmit = (data) => {
        dispatch(accessUser({ data, type }));
    };

    useEffect(() => {
        if (type === "login" && respone && !redirected) {
            if (respone.refresh_token && respone.access_token) {
                setRedirected(true);
                localStorage.setItem("token", respone.access_token);
                localStorage.setItem("refresh_token", respone.refresh_token);
                window.top.location.href = param.get("continue")
                    ? `/${param.get("continue")}`
                    : "/";
            }
            // setToken(respone.access_token);
        } else if (type === "register" && respone && !redirected) {
            window.top.location.href = "/login";
            setRedirected(true);
        }
    }, [respone, param, redirected, type]);

    return type === "register" ? (
        <form action="" onSubmit={handleSubmit(onSubmit)}>
            <Input
                labelName={"Tên"}
                name={"frist_name"}
                message={errors}
                register={register}
            />
            <Input
                labelName={"Tên đệm"}
                name={"last_name"}
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
                {"đăng nhập"}
            </Button>
        </form>
    );
}

export default Form;
