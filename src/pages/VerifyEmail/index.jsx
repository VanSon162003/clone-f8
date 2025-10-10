import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import styles from "./VerifyEmail.module.scss";
import authService from "@/services/authService";
import Button from "@/components/Button";

export default function VerifyEmailPage() {
    const [status, setStatus] = useState("verifying");
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        if (!token) {
            setStatus("error");
            return;
        }
        setIsLoading(true);
        const verifyEmail = async () => {
            try {
                await authService.verifyEmail(token);

                setStatus("success");
            } catch (error) {
                setStatus("error");
            }
            setIsLoading(false);
        };
        verifyEmail();
    }, []);

    useEffect(() => {
        if (status === "success" && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [status, countdown]);

    const handleResend = () => {};

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                {/* Logo */}
                <div className={styles.header}>
                    <Button to="/" className={styles.logo}>
                        <span className={styles.logoText}>F8</span>
                    </Button>
                    <h1 className={styles.title}>Xác thực Email</h1>
                </div>

                {/* Card */}
                <div className={styles.card}>
                    {/* Verifying State */}
                    {isLoading && (
                        <div className={styles.content}>
                            <div className={styles.iconWrapper}>
                                <Loader className={styles.iconVerifying} />
                            </div>
                            <h2 className={styles.heading}>Đang xác thực...</h2>
                            <p className={styles.description}>
                                Vui lòng đợi trong giây lát
                            </p>
                        </div>
                    )}

                    {/* Success State */}
                    {status === "success" && (
                        <div className={styles.content}>
                            <div className={styles.iconWrapperSuccess}>
                                <CheckCircle className={styles.iconSuccess} />
                            </div>
                            <h2 className={styles.heading}>
                                Xác thực thành công!
                            </h2>
                            <p className={styles.description}>
                                Email của bạn đã được xác thực thành công.
                            </p>
                            <p className={styles.countdown}>
                                Tự động chuyển hướng sau {countdown}s...
                            </p>
                            <button
                                onClick={() => (window.location.href = "/")}
                                className={styles.buttonPrimary}
                            >
                                Đăng nhập ngay
                            </button>
                        </div>
                    )}

                    {/* Error State */}
                    {status === "error" && (
                        <div className={styles.content}>
                            <div className={styles.iconWrapperError}>
                                <XCircle className={styles.iconError} />
                            </div>
                            <h2 className={styles.heading}>
                                Xác thực thất bại
                            </h2>
                            <p className={styles.description}>
                                Link xác thực không hợp lệ hoặc đã hết hạn.
                            </p>
                            <div className={styles.buttonGroup}>
                                <button
                                    onClick={handleResend}
                                    className={styles.buttonPrimary}
                                >
                                    Gửi lại email xác thực
                                </button>
                                <button
                                    onClick={() => (window.location.href = "/")}
                                    className={styles.buttonSecondary}
                                >
                                    Về trang chủ
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        Bạn cần hỗ trợ?{" "}
                        <a href="/support" className={styles.footerLink}>
                            Liên hệ với chúng tôi
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
