import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Button from "@/components/Button";
import styles from "./CourseRegistrationButton.module.scss";
import { useRegisterCourseMutation } from "@/services/coursesService";
import { useCreatePaymentSessionMutation } from "@/services/paymentsService";

function CourseRegistrationButton({ courseId, courseSlug, isPro, onError }) {
    const [isLoading, setIsLoading] = useState(false);
    const navigator = useNavigate();
    const currentUser = useSelector((state) => state.auth.currentUser);

    const [registerCourse] = useRegisterCourseMutation();
    const [createPaymentSession] = useCreatePaymentSessionMutation();

    const handleRegistration = async () => {
        if (!currentUser) {
            return navigator("/authenticationApp");
        }

        setIsLoading(true);
        try {
            if (isPro) {
                // Handle pro course registration with payment
                const response = await createPaymentSession(courseId).unwrap();
                window.location.href = response.url; // Redirect to Stripe checkout
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

    return (
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
    );
}

export default CourseRegistrationButton;
