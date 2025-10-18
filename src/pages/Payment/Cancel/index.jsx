import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/Button";
import styles from "./PaymentCancel.module.scss";

function PaymentCancel() {
    const navigate = useNavigate();

    const handleReturnHome = () => {
        navigate("/");
    };

    const handleReturnCourses = () => {
        navigate("/learning-paths");
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <div className={styles.icon}>
                    <FontAwesomeIcon icon={faTimes} />
                </div>
                <h1>Thanh toán đã bị huỷ</h1>
                <p>
                    Bạn đã huỷ quá trình thanh toán. Không có khoản phí nào được
                    tính.
                </p>
                <div className={styles.actions}>
                    <Button onClick={handleReturnCourses} primary>
                        Xem các khoá học khác
                    </Button>
                    <Button onClick={handleReturnHome} outline>
                        Về trang chủ
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default PaymentCancel;
