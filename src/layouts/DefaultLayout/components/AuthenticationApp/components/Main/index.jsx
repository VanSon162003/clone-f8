import styles from "./Main.module.scss";
import { Link } from "react-router-dom";

import Form from "../Form";
import Button from "@/components/Button";

import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import authService from "@/services/authService";

function Main({ type = "" }) {
    const { loginWithPopup, user, isAuthenticated, getAccessTokenSilently } =
        useAuth0();

    const handleLogin = async () => {
        try {
            await loginWithPopup();

            const accessToken = await getAccessTokenSilently();

            localStorage.setItem("token", accessToken);
        } catch (err) {
            console.error("Lỗi khi đăng nhập Auth0:", err);
        }
    };

    useEffect(() => {
        if (isAuthenticated && user) {
            (async () => {
                try {
                    const { data } = await authService.loginWithAuth0({ user });

                    localStorage.setItem("token", data.access_token || "");
                    localStorage.setItem(
                        "refresh_token",
                        data.refresh_token || ""
                    );

                    window.top.location.href = "/";
                } catch (error) {
                    console.log("lỗi khi gọi api", error);
                }
            })();
        }
    }, [isAuthenticated, user]);
    return (
        <main className={styles.main}>
            {type === "register" ? (
                <div className={styles.content}>
                    <Form type={type} />
                </div>
            ) : (
                <div className={styles.content}>
                    <Form type={type} />
                </div>
            )}

            {type === "register" ? (
                <p className={styles.regisOrLogin}>
                    {"Bạn đã có tài khoản? "}
                    <Link to={"/login"}>Đăng nhập</Link>
                </p>
            ) : type === "login" ? (
                <p className={styles.regisOrLogin}>
                    {"Bạn chưa có tài khoản? "}
                    <Link to={"/register"}>Đăng ký</Link>
                </p>
            ) : (
                <p className={styles.regisOrLogin}>
                    {type === "register" ? (
                        <>
                            {"Bạn đã có tài khoản? "}
                            <button>Đăng nhập</button>
                        </>
                    ) : (
                        <>
                            {"Bạn chưa có tài khoản? "}
                            <button>Đăng ký</button>
                        </>
                    )}
                </p>
            )}

            <div className={styles.options}>
                <Link to={"/forGot-passWord"} className={styles.forgotPassword}>
                    Quên mật khẩu
                </Link>

                <Button onClick={handleLogin} className={styles.forgotPassword}>
                    {type === "login" ? "Đăng nhập" : "Đăng ký"} bằng phương
                    thức khác
                </Button>

                {type !== "register" && (
                    <Link
                        to={"/resend-email"}
                        className={styles.forgotPassword}
                    >
                        Gửi lại email xác thực
                    </Link>
                )}
            </div>

            <p className={styles.attention}>
                {
                    "Việc bạn tiếp tục sử dụng trang web này đồng nghĩa bạn đồng ý với "
                }
                <a href="http://localhost:5173/">điều khoản sử dụng</a>
                {" của chúng tôi"}
            </p>
        </main>
    );
}

export default Main;
