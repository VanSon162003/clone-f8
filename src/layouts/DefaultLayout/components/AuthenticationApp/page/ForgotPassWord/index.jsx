import { useState, useEffect } from "react";
import { KeyRound, CheckCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";
import styles from "./ForgotPassword.module.scss";
import authService from "@/services/authService";
import Button from "@/components/Button";
import useQuery from "@/hook/useQuery";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [status, setStatus] = useState("idle"); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState("");
    const [tokenValid, setTokenValid] = useState(true);

    const { param } = useQuery();
    const token = param.get("token");

    // Validate token when component mounts
    // useEffect(() => {
    //     if (token) {
    //         validateToken();
    //     }
    // }, [token]);

    // const validateToken = async () => {
    //     try {
    //         await authService.validateResetToken(token);
    //         setTokenValid(true);
    //     } catch (error) {
    //         setTokenValid(false);
    //         setErrorMessage(
    //             "Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn"
    //         );
    //     }
    // };

    const user = {
        email: "",
        password: "",
        confirmPassword: "",
    };

    const users = Object.keys(user);
    console.log(users);

    const handleSubmitEmail = async (e) => {
        e.preventDefault();

        if (!email) {
            setErrorMessage("Vui lòng nhập email");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage("Email không hợp lệ");
            return;
        }

        setStatus("loading");
        setErrorMessage("");

        try {
            await authService.resendEmail(email, "forgotPasswordJob");
            setStatus("success");
        } catch (error) {
            setStatus("error");
            setErrorMessage(error || "Có lỗi xảy ra. Vui lòng thử lại sau.");
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        // Validation
        if (!password || !confirmPassword) {
            setErrorMessage("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (!password.trim() || !confirmPassword.trim()) {
            setErrorMessage("Vui lòng không nhập toàn khoảng trắng");
            return;
        }

        if (password.length < 8) {
            setErrorMessage("Mật khẩu phải có ít nhất 8 ký tự");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Mật khẩu xác nhận không khớp");
            return;
        }

        setStatus("loading");
        setErrorMessage("");

        try {
            await authService.forgotPassword(token, password);
            setStatus("success");
            setTokenValid(true);
        } catch (error) {
            setStatus("error");
            setTokenValid(false);

            setErrorMessage(
                error.message ||
                    "Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn"
            );
        }
    };

    const handleRetry = () => {
        setStatus("idle");
        setErrorMessage("");
        setEmail("");
    };

    if (token && tokenValid) {
        return (
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <div className={styles.header}>
                        <Button to="/" className={styles.logo}>
                            <span className={styles.logoText}>F8</span>
                        </Button>
                        <h1 className={styles.title}>Đặt lại mật khẩu</h1>
                    </div>

                    <div className={styles.card}>
                        {status !== "success" ? (
                            <div className={styles.content}>
                                <div className={styles.iconWrapper}>
                                    <KeyRound className={styles.icon} />
                                </div>
                                <h2 className={styles.heading}>
                                    Tạo mật khẩu mới
                                </h2>
                                <p className={styles.description}>
                                    Vui lòng nhập mật khẩu mới cho tài khoản của
                                    bạn
                                </p>

                                <form
                                    onSubmit={handleResetPassword}
                                    className={styles.form}
                                >
                                    <div className={styles.inputGroup}>
                                        <label
                                            htmlFor="password"
                                            className={styles.label}
                                        >
                                            Mật khẩu mới
                                        </label>
                                        <div className={styles.passwordWrapper}>
                                            <input
                                                id="password"
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                                placeholder="Nhập mật khẩu mới"
                                                className={styles.input}
                                                disabled={status === "loading"}
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                className={styles.eyeButton}
                                            >
                                                {showPassword ? (
                                                    <EyeOff
                                                        className={
                                                            styles.eyeIcon
                                                        }
                                                    />
                                                ) : (
                                                    <Eye
                                                        className={
                                                            styles.eyeIcon
                                                        }
                                                    />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label
                                            htmlFor="confirmPassword"
                                            className={styles.label}
                                        >
                                            Xác nhận mật khẩu
                                        </label>
                                        <div className={styles.passwordWrapper}>
                                            <input
                                                id="confirmPassword"
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={confirmPassword}
                                                onChange={(e) =>
                                                    setConfirmPassword(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Nhập lại mật khẩu mới"
                                                className={styles.input}
                                                disabled={status === "loading"}
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword
                                                    )
                                                }
                                                className={styles.eyeButton}
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff
                                                        className={
                                                            styles.eyeIcon
                                                        }
                                                    />
                                                ) : (
                                                    <Eye
                                                        className={
                                                            styles.eyeIcon
                                                        }
                                                    />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* <div
                                        className={styles.passwordRequirements}
                                    >
                                        <p className={styles.requirementTitle}>
                                            Mật khẩu phải có:
                                        </p>
                                        <ul className={styles.requirementList}>
                                            <li
                                                className={
                                                    password.length >= 8
                                                        ? styles.valid
                                                        : ""
                                                }
                                            >
                                                Ít nhất 8 ký tự
                                            </li>
                                            <li
                                                className={
                                                    /[A-Z]/.test(password)
                                                        ? styles.valid
                                                        : ""
                                                }
                                            >
                                                Ít nhất 1 chữ hoa
                                            </li>
                                            <li
                                                className={
                                                    /[0-9]/.test(password)
                                                        ? styles.valid
                                                        : ""
                                                }
                                            >
                                                Ít nhất 1 chữ số
                                            </li>
                                        </ul>
                                    </div> */}

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
                                            ? "Đang xử lý..."
                                            : "Đặt lại mật khẩu"}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className={styles.content}>
                                <div className={styles.iconWrapperSuccess}>
                                    <CheckCircle
                                        className={styles.iconSuccess}
                                    />
                                </div>
                                <h2 className={styles.heading}>
                                    Đặt lại mật khẩu thành công!
                                </h2>
                                <p className={styles.description}>
                                    Mật khẩu của bạn đã được cập nhật thành
                                    công.
                                </p>
                                <p className={styles.instructionText}>
                                    Bạn có thể đăng nhập bằng mật khẩu mới ngay
                                    bây giờ.
                                </p>

                                <Button
                                    to="/login"
                                    className={`${styles.buttonPrimary} ${styles.mt20}`}
                                >
                                    Đăng nhập ngay
                                </Button>
                            </div>
                        )}
                    </div>

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

    // Invalid Token
    if (token && !tokenValid) {
        return (
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <div className={styles.header}>
                        <Button to="/" className={styles.logo}>
                            <span className={styles.logoText}>F8</span>
                        </Button>
                        <h1 className={styles.title}>Link không hợp lệ</h1>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.content}>
                            <div className={styles.iconWrapperError}>
                                <KeyRound className={styles.iconError} />
                            </div>
                            <h2 className={styles.heading}>Link đã hết hạn</h2>
                            <p className={styles.description}>
                                Link đặt lại mật khẩu không hợp lệ hoặc đã hết
                                hạn.
                            </p>
                            <p className={styles.instructionText}>
                                Vui lòng yêu cầu gửi lại email đặt lại mật khẩu.
                            </p>

                            <div className={styles.buttonGroup}>
                                <Button
                                    to="/forgot-password"
                                    className={styles.buttonPrimary}
                                >
                                    Yêu cầu link mới
                                </Button>
                                <Button
                                    to="/login"
                                    className={styles.buttonSecondary}
                                >
                                    Quay lại đăng nhập
                                </Button>
                            </div>
                        </div>
                    </div>

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

    // Request Reset Email Form (no token)
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <Button to="/" className={styles.logo}>
                        <span className={styles.logoText}>F8</span>
                    </Button>
                    <h1 className={styles.title}>Quên mật khẩu</h1>
                </div>

                <div className={styles.card}>
                    {(status === "idle" || status === "error") && (
                        <div className={styles.content}>
                            <div className={styles.iconWrapper}>
                                <KeyRound className={styles.icon} />
                            </div>
                            <h2 className={styles.heading}>Đặt lại mật khẩu</h2>
                            <p className={styles.description}>
                                Nhập email đã đăng ký của bạn. Chúng tôi sẽ gửi
                                link đặt lại mật khẩu đến email này.
                            </p>

                            <form
                                onSubmit={handleSubmitEmail}
                                className={styles.form}
                            >
                                <div className={styles.inputGroup}>
                                    <label
                                        htmlFor="email"
                                        className={styles.label}
                                    >
                                        Địa chỉ Email
                                    </label>
                                    <input
                                        id="email"
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
                                        : "Gửi link đặt lại mật khẩu"}
                                </button>
                            </form>

                            <Button to="/login" className={styles.buttonBack}>
                                <ArrowLeft className={styles.backIcon} />
                                Quay lại đăng nhập
                            </Button>
                        </div>
                    )}

                    {status === "success" && (
                        <div className={styles.content}>
                            <div className={styles.iconWrapperSuccess}>
                                <CheckCircle className={styles.iconSuccess} />
                            </div>
                            <h2 className={styles.heading}>
                                Kiểm tra email của bạn
                            </h2>
                            <p className={styles.description}>
                                Chúng tôi đã gửi link đặt lại mật khẩu đến{" "}
                                <strong>{email}</strong>
                            </p>
                            <p className={styles.instructionText}>
                                Vui lòng kiểm tra hộp thư và click vào link để
                                đặt lại mật khẩu. Link này sẽ hết hạn sau 24
                                giờ.
                            </p>
                            <p className={styles.noteText}>
                                Không nhận được email? Kiểm tra thư mục spam
                                hoặc yêu cầu gửi lại.
                            </p>

                            <div className={styles.buttonGroup}>
                                <button
                                    onClick={handleRetry}
                                    className={styles.buttonSecondary}
                                >
                                    Gửi lại email
                                </button>
                                <Button
                                    to="/login"
                                    className={styles.buttonPrimary}
                                >
                                    Quay lại đăng nhập
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

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
