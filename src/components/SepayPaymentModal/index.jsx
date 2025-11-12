import { useState, useEffect } from "react";
import styles from "./SepayPaymentModal.module.scss";
import {
    useCreateSepayPaymentMutation,
    useLazyCheckPaymentStatusQuery,
    useCancelPaymentMutation,
} from "@/services/sepayService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTimes,
    faCheckCircle,
    faExclamationCircle,
    faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

/**
 * SepayPaymentModal Component
 * Hiển thị QR code thanh toán Sepay
 * - QR code image
 * - Countdown timer (15 phút)
 * - Check status button
 * - Polling automatic
 * - Success/Error messages
 */
const SepayPaymentModal = ({
    isOpen,
    courseId,
    courseTitle,
    coursePrice,
    onClose,
    onSuccess,
}) => {
    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [countdown, setCountdown] = useState(900); // 15 phút = 900 giây
    const [isChecking, setIsChecking] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

    // RTK Query mutations/queries
    const [createPayment] = useCreateSepayPaymentMutation();
    const [checkPaymentStatus] = useLazyCheckPaymentStatusQuery();
    const [cancelPayment] = useCancelPaymentMutation();

    /**
     * Tạo QR code khi modal mở
     */
    useEffect(() => {
        if (isOpen && courseId) {
            handleCreatePayment();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, courseId]);

    /**
     * Countdown timer
     */
    useEffect(() => {
        if (!paymentData || success) return;

        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    setError("QR code đã hết hạn. Vui lòng tạo mới.");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [paymentData, success]);

    /**
     * Tạo QR code thanh toán
     */
    const handleCreatePayment = async () => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);
            setCountdown(900);

            // Cancel old payment if exists
            if (paymentData?.id) {
                try {
                    await cancelPayment(paymentData.id).unwrap();
                    console.log("Old payment cancelled");
                } catch (err) {
                    console.error("Failed to cancel old payment:", err);
                    // Continue to create new payment even if cancel fails
                }
            }

            const response = await createPayment(courseId).unwrap();

            if (response.success && response.data) {
                setPaymentData(response.data);
                setCountdown(900);
                console.log("Payment created:", response.data);
            } else {
                setError(
                    response.message || "Không thể tạo mã QR. Vui lòng thử lại."
                );
            }
        } catch (err) {
            console.error("Create payment error:", err);
            setError(
                err?.data?.message ||
                    err?.message ||
                    "Lỗi tạo thanh toán. Vui lòng thử lại."
            );
        } finally {
            setLoading(false);
        }
    };

    /**
     * Kiểm tra trạng thái thanh toán
     */
    const handleCheckStatus = async () => {
        if (!paymentData?.referenceCode) {
            setError("Không có mã tham chiếu. Vui lòng tạo mới.");
            return;
        }

        try {
            setIsChecking(true);
            const response = await checkPaymentStatus(
                paymentData.referenceCode
            ).unwrap();

            if (
                response.data?.status === "COMPLETED" ||
                response.data?.status === "completed"
            ) {
                setSuccess(true);
                setCountdown(0);
                if (onSuccess) {
                    setTimeout(() => {
                        onSuccess(paymentData);
                    }, 2000);
                }
            } else if (response.data?.status === "pending") {
                setError(null);
            } else {
                setError(`Trạng thái: ${response.data?.status || "Chưa rõ"}`);
            }
        } catch (err) {
            console.error("Check status error:", err);
            setError(err?.data?.message || "Lỗi kiểm tra trạng thái.");
        } finally {
            setIsChecking(false);
        }
    };

    /**
     * Format thời gian countdown
     */
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    };

    /**
     * Huỷ bỏ thanh toán
     */
    const handleCancelPayment = async () => {
        console.log(paymentData);

        if (!paymentData?.data?.paymentId) return;

        try {
            setIsCancelling(true);
            await cancelPayment(paymentData?.data?.paymentId).unwrap();
            console.log("Payment cancelled successfully");
            onClose();
        } catch (err) {
            console.error("Cancel payment error:", err);
            setError(
                err?.data?.message || "Lỗi huỷ thanh toán. Vui lòng thử lại."
            );
        } finally {
            setIsCancelling(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                {/* Header */}
                <div className={styles.header}>
                    <h2>Thanh toán khóa học</h2>
                    <button
                        className={styles.closeBtn}
                        onClick={
                            paymentData && !success
                                ? handleCancelPayment
                                : onClose
                        }
                        disabled={loading || isChecking || isCancelling}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                {/* Body */}
                <div className={styles.body}>
                    {/* Course Info */}
                    <div className={styles.courseInfo}>
                        <h3>{courseTitle}</h3>
                        <p className={styles.price}>
                            Giá:{" "}
                            <strong>
                                {coursePrice?.toLocaleString("vi-VN")} VND
                            </strong>
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className={styles.alert + " " + styles.error}>
                            <FontAwesomeIcon icon={faExclamationCircle} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className={styles.alert + " " + styles.success}>
                            <FontAwesomeIcon icon={faCheckCircle} />
                            <span>Thanh toán thành công! Đang xử lý...</span>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && !paymentData && (
                        <div className={styles.loadingContainer}>
                            <FontAwesomeIcon
                                icon={faSpinner}
                                className={styles.spinner}
                            />
                            <p>Đang tạo mã QR...</p>
                        </div>
                    )}

                    {/* QR Code Display */}
                    {paymentData && !success && (
                        <div className={styles.qrContainer}>
                            <img
                                src={paymentData?.data?.qrCode}
                                alt="QR Code"
                                className={styles.qrImage}
                            />

                            {/* Countdown Timer */}
                            <div className={styles.timerContainer}>
                                <p>Hạn sử dụng:</p>
                                <div
                                    className={
                                        styles.timer +
                                        " " +
                                        (countdown < 60 ? styles.urgent : "")
                                    }
                                >
                                    {formatTime(countdown)}
                                </div>
                                {countdown < 60 && (
                                    <p className={styles.urgentWarning}>
                                        Còn ít thời gian, vui lòng quét QR ngay!
                                    </p>
                                )}
                            </div>

                            {/* Instructions */}
                            <div className={styles.instructions}>
                                <h4>Hướng dẫn:</h4>
                                <ol>
                                    <li>Mở ứng dụng ngân hàng của bạn</li>
                                    <li>
                                        Chọn chức năng &quot;Quét mã QR&quot;
                                    </li>
                                    <li>Quét mã QR bên trên</li>
                                    <li>Xác nhận và chuyển khoản</li>
                                </ol>
                            </div>

                            {/* Reference Code */}
                            <div className={styles.referenceCode}>
                                <small>
                                    Mã tham chiếu:{" "}
                                    <code>{paymentData.referenceCode}</code>
                                </small>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    {paymentData && !success && (
                        <button
                            className={styles.checkBtn}
                            onClick={handleCheckStatus}
                            disabled={loading || isChecking}
                        >
                            {isChecking && (
                                <FontAwesomeIcon
                                    icon={faSpinner}
                                    className={styles.spinner}
                                />
                            )}
                            {isChecking
                                ? "Đang kiểm tra..."
                                : "Kiểm tra trạng thái"}
                        </button>
                    )}

                    {!paymentData || error ? (
                        <button
                            className={styles.retryBtn}
                            onClick={async () => {
                                await handleCancelPayment();
                                await handleCreatePayment();
                            }}
                            disabled={loading}
                        >
                            {loading && (
                                <FontAwesomeIcon
                                    icon={faSpinner}
                                    className={styles.spinner}
                                />
                            )}
                            {loading ? "Đang tạo mới..." : "Tạo mã QR mới"}
                        </button>
                    ) : null}

                    <button
                        className={styles.cancelBtn}
                        onClick={
                            paymentData && !success
                                ? handleCancelPayment
                                : onClose
                        }
                        disabled={loading || isChecking || isCancelling}
                    >
                        {isCancelling && (
                            <FontAwesomeIcon
                                icon={faSpinner}
                                className={styles.spinner}
                            />
                        )}
                        {isCancelling
                            ? "Đang huỷ..."
                            : success
                            ? "Đóng"
                            : "Hủy"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SepayPaymentModal;
