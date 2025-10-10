import { useState } from "react";
import { Mail, CheckCircle, ArrowLeft } from "lucide-react";
import styles from "./ResendEmail.module.scss";
import authService from "@/services/authService";
import Button from "@/components/Button";

export default function ResendEmail() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setErrorMessage("Vui lòng nhập email");
            return;
        }

        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage("Email không hợp lệ");
            return;
        }

        setStatus("loading");
        setErrorMessage("");

        try {
            await authService.resendEmail(email, "sendVerifyEmailJob");
            setStatus("success");
        } catch (error) {
            setStatus("error");
            setErrorMessage(error || "Có lỗi xảy ra. Vui lòng thử lại sau.");
        }
    };

    const handleRetry = () => {
        setStatus("idle");
        setErrorMessage("");
    };

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                {/* Logo */}
                <div className={styles.header}>
                    <Button to="/" className={styles.logo}>
                        <span className={styles.logoText}>F8</span>
                    </Button>
                    <h1 className={styles.title}>Gửi lại Email xác thực</h1>
                </div>

                {/* Card */}
                <div className={styles.card}>
                    {/* Idle & Error State - Show Form */}
                    {(status === "idle" || status === "error") && (
                        <div className={styles.content}>
                            <div className={styles.iconWrapper}>
                                <Mail className={styles.icon} />
                            </div>
                            <h2 className={styles.heading}>
                                Nhập email của bạn
                            </h2>
                            <p className={styles.description}>
                                Chúng tôi sẽ gửi lại email xác thực đến địa chỉ
                                email của bạn
                            </p>

                            <form
                                onSubmit={handleSubmit}
                                className={styles.form}
                            >
                                <div className={styles.inputGroup}>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="example@email.com"
                                        className={styles.input}
                                        disabled={status === "loading"}
                                    />
                                </div>

                                {errorMessage && (
                                    <div className={styles.errorMessage}>
                                        {errorMessage}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={status === "loading"}
                                    className={styles.buttonPrimary}
                                >
                                    {status === "loading"
                                        ? "Đang gửi..."
                                        : "Gửi email xác thực"}
                                </button>
                            </form>

                            <Button to="/login" className={styles.buttonBack}>
                                <ArrowLeft className={styles.backIcon} />
                                Quay lại đăng nhập
                            </Button>
                        </div>
                    )}

                    {/* Success State */}
                    {status === "success" && (
                        <div className={styles.content}>
                            <div className={styles.iconWrapperSuccess}>
                                <CheckCircle className={styles.iconSuccess} />
                            </div>
                            <h2 className={styles.heading}>Đã gửi email!</h2>
                            <p className={styles.description}>
                                Chúng tôi đã gửi email xác thực đến{" "}
                                <strong>{email}</strong>
                            </p>
                            <p className={styles.instructionText}>
                                Vui lòng kiểm tra hộp thư của bạn và click vào
                                link xác thực. Nếu không thấy email, hãy kiểm
                                tra thư mục spam.
                            </p>

                            <div className={styles.buttonGroup}>
                                <button
                                    onClick={handleRetry}
                                    className={styles.buttonSecondary}
                                >
                                    Gửi lại email khác
                                </button>
                                <button
                                    onClick={() =>
                                        (window.top.location.href = "/")
                                    }
                                    className={styles.buttonPrimary}
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
