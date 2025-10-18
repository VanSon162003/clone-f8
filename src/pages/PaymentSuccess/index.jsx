import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useVerifyPaymentMutation } from "@/services/paymentsService";
import styles from "./PaymentSuccess.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faSpinner } from "@fortawesome/free-solid-svg-icons";

function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [verificationStatus, setVerificationStatus] = useState("verifying"); // 'verifying', 'success', 'error'
    const [verifyPayment] = useVerifyPaymentMutation();

    useEffect(() => {
        const sessionId = searchParams.get("session_id");
        if (!sessionId) {
            navigate("/");
            return;
        }

        const verifySession = async () => {
            try {
                await verifyPayment(sessionId).unwrap();
                setVerificationStatus("success");
                // Chờ 3s rồi chuyển về trang courses
                setTimeout(() => {
                    navigate("/");
                }, 3000);
            } catch (error) {
                console.error("Verification error:", error);
                setVerificationStatus("error");
            }
        };

        verifySession();
    }, [searchParams, navigate, verifyPayment]);

    const renderContent = () => {
        switch (verificationStatus) {
            case "verifying":
                return (
                    <>
                        <FontAwesomeIcon
                            icon={faSpinner}
                            spin
                            className={styles.icon}
                        />
                        <h2>Đang xác minh thanh toán...</h2>
                        <p>Vui lòng chờ trong giây lát</p>
                    </>
                );
            case "success":
                return (
                    <>
                        <FontAwesomeIcon
                            icon={faCircleCheck}
                            className={styles.iconSuccess}
                        />
                        <h2>Thanh toán thành công!</h2>
                        <p>
                            Bạn sẽ được chuyển về trang khóa học trong vài
                            giây...
                        </p>
                    </>
                );
            case "error":
                return (
                    <>
                        <h2>Có lỗi xảy ra</h2>
                        <p>
                            Không thể xác minh thanh toán. Vui lòng liên hệ hỗ
                            trợ.
                        </p>
                        <button
                            className={styles.button}
                            onClick={() => navigate("/")}
                        >
                            Quay về trang khóa học
                        </button>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>{renderContent()}</div>
        </div>
    );
}

export default PaymentSuccess;
