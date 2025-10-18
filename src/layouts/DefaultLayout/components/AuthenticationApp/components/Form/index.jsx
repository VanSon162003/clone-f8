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
            // If backend indicates 2FA is required, do not redirect yet. Show 2FA UI instead.
            if (respone.require2fa) {
                // handled elsewhere (twoFaMode state)
                return;
            }

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

    // Local 2FA state
    const [twoFaMode, setTwoFaMode] = useState(false);
    const [twoFaToken, setTwoFaToken] = useState("");
    const [useRecoveryCode, setUseRecoveryCode] = useState(false);

    useEffect(() => {
        if (type === "login" && respone && respone.require2fa) {
            setTwoFaMode(true);
        }
    }, [respone, type]);

    const handleSubmit2fa = async () => {
        try {
            const res = await authService.login2fa(
                respone.tmpToken,
                twoFaToken
            );
            if (res && res.data && res.data.access_token) {
                localStorage.setItem("token", res.data.access_token);
                localStorage.setItem("refresh_token", res.data.refresh_token);
                window.top.location.href = param.get("continue")
                    ? `/${param.get("continue")}`
                    : "/";
            }
        } catch (err) {
            dispatch(
                setAuthErr(
                    err?.response?.data?.message || err?.message || "2FA failed"
                )
            );
        }
    };

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
            {!twoFaMode ? (
                <>
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
                </>
            ) : (
                <>
                    <Input
                        labelName={
                            useRecoveryCode
                                ? "Mã khôi phục"
                                : "Mã xác thực 2 bước"
                        }
                        name={"twoFa"}
                        message={{}}
                        register={() => {}}
                        placeholder={
                            useRecoveryCode
                                ? "Nhập mã khôi phục"
                                : "Nhập mã từ ứng dụng Authenticator"
                        }
                        value={twoFaToken}
                        onChange={(e) => setTwoFaToken(e.target.value)}
                    />

                    <div className={styles.twoFaToggle}>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setUseRecoveryCode((s) => !s);
                            }}
                        >
                            {useRecoveryCode
                                ? "Sử dụng mã từ ứng dụng"
                                : "Sử dụng mã khôi phục"}
                        </a>
                    </div>

                    <div className={styles.buttons}>
                        <Button
                            className={`${styles.wrapperBtn} ${styles.btnPrimary} ${styles.rounded}`}
                            onClick={handleSubmit2fa}
                        >
                            Xác thực
                        </Button>
                    </div>
                </>
            )}
        </form>
    );
}

export default Form;
