import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Button from "@/components/Button";
import SepayPaymentModal from "@/components/SepayPaymentModal";
import styles from "./CourseRegistrationButton.module.scss";
import { useRegisterCourseMutation } from "@/services/coursesService";

function CourseRegistrationButton({
    courseId,
    courseSlug,
    isPro,
    onError,
    courseTitle,
    coursePrice,
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [showSepayModal, setShowSepayModal] = useState(false);
    const navigator = useNavigate();
    const currentUser = useSelector((state) => state.auth.currentUser);

    const [registerCourse] = useRegisterCourseMutation();

    const handleRegistration = async () => {
        if (!currentUser) {
            return navigator("/authenticationApp");
        }

        setIsLoading(true);
        try {
            if (isPro) {
                // Show Sepay payment modal for pro course
                setShowSepayModal(true);
            } else {
                // Handle free course registration
                await registerCourse({ course_id: courseId }).unwrap();
                navigator(`/learning/${courseSlug}`);
            }
        } catch (error) {
            console.error("Registration error:", error);
            onError?.(error.message || "Failed to process registration");
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handle successful payment from Sepay
     * Grant course access and redirect to lesson page
     */
    const handleSepaySuccess = async (paymentData) => {
        try {
            // Register course after successful payment
            await registerCourse({ course_id: courseId }).unwrap();
            setShowSepayModal(false);
            // Redirect to course lesson page
            setTimeout(() => {
                navigator(`/learning/${courseSlug}`);
            }, 500);
        } catch (error) {
            console.error("Course registration error after payment:", error);
            onError?.(
                error.message || "Failed to register course after payment"
            );
        }
    };

    return (
        <>
            <Button
                onClick={handleRegistration}
                className={styles.wrapper}
                rounded
                disabled={isLoading}
            >
                <span className={styles.inner}>
                    <span className={styles.title}>
                        {isLoading
                            ? "ĐANG XỬ LÝ..."
                            : isPro
                            ? "ĐĂNG KÝ HỌC (PRO)"
                            : "ĐĂNG KÝ HỌC"}
                    </span>
                </span>
            </Button>

            {/* Sepay Payment Modal */}
            <SepayPaymentModal
                isOpen={showSepayModal}
                courseId={courseId}
                courseTitle={courseTitle}
                coursePrice={coursePrice}
                onClose={() => {
                    setShowSepayModal(false);
                    setIsLoading(false);
                }}
                onSuccess={handleSepaySuccess}
            />
        </>
    );
}

export default CourseRegistrationButton;
