import { useState, useEffect, useRef } from "react";
import styles from "./TutorialGuide.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faXmark,
    faChevronLeft,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const TUTORIAL_STEPS = [
    {
        id: 1,
        title: "Chào mừng đến với F8 Learning",
        content:
            "Đây là giao diện học tập của khóa học. Tôi sẽ hướng dẫn bạn cách sử dụng các tính năng chính.",
        highlightSelector: null,
    },
    {
        id: 2,
        title: "Sidebar nội dung khóa học",
        content:
            "Ở bên trái là danh sách các chương (track) và bài học (lesson) của khóa học. Bạn có thể click vào để chọn bài học muốn học.",
        highlightSelector: ".sidebar",
    },
    {
        id: 3,
        title: "Video học tập",
        content:
            "Đây là phần video chính. Click vào để bắt đầu phát video. Bạn có thể tạm dừng, điều chỉnh âm lượng và xem phụ đề.",
        highlightSelector: ".videoWrapper",
    },
    {
        id: 4,
        title: "Nội dung bài học",
        content:
            "Phần này chứa nội dung chi tiết của bài học. Scroll down để đọc các kiến thức bổ sung.",
        highlightSelector: ".lessonBody",
    },
    {
        id: 5,
        title: "Tính năng Ghi chú",
        content:
            "Click nút 'Ghi chú' ở phía trên để tạo ghi chú tại thời điểm hiện tại của video. Ghi chú sẽ giúp bạn ôn tập dễ dàng hơn.",
        highlightSelector: '[data-tour="notes-tutorial"]',
    },
    {
        id: 6,
        title: "Tính năng Hỏi đáp",
        content:
            "Click nút 'Hỏi đáp' để xem các câu hỏi và trả lời từ cộng đồng học viên. Bạn cũng có thể đặt câu hỏi ở đây.",
        highlightSelector: '[data-tour="comments-tutorial"]',
    },
    {
        id: 7,
        title: "Điều hướng giữa các bài",
        content:
            "Sử dụng các nút 'Bài trước' và 'Bài tiếp theo' ở cuối trang để điều hướng giữa các bài học.",
        highlightSelector: ".footer",
    },
    {
        id: 8,
        title: "Tiến độ học tập",
        content:
            "Biểu đồ tròn ở góc phía trên cho thấy tiến độ hoàn thành khóa học của bạn. Hoàn thành tất cả các bài để đạt 100%.",
        highlightSelector: ".progressBar",
    },
];

function TutorialGuide({ open, onClose }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [highlightedElement, setHighlightedElement] = useState(null);
    const utteranceRef = useRef(null);

    const step = TUTORIAL_STEPS[currentStep];

    // Cleanup highlight element
    useEffect(() => {
        return () => {
            if (highlightedElement) {
                highlightedElement.classList.remove(styles.highlighted);
            }
        };
    }, [highlightedElement]);

    // Text-to-speech for current step
    useEffect(() => {
        if (open && !isMuted) {
            speakStep();
            highlightElement();
        }

        return () => {
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
        };
    }, [currentStep, open, isMuted]);

    // Highlight element related to current step
    const highlightElement = () => {
        // Remove previous highlight
        if (highlightedElement) {
            highlightedElement.classList.remove(styles.highlighted);
        }

        if (step.highlightSelector) {
            const element = document.querySelector(step.highlightSelector);
            if (element) {
                element.classList.add(styles.highlighted);
                setHighlightedElement(element);

                // Scroll to element
                element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    };

    const speakStep = () => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }

        setIsSpeaking(true);
        const text = `${step.title}. ${step.content}`;

        // Tìm voice Việt tốt nhất
        const voices = window.speechSynthesis.getVoices();
        let selectedVoice = null;

        // Ưu tiên: Tìm voice Việt
        selectedVoice = voices.find(
            (voice) =>
                voice.lang === "vi-VN" ||
                voice.lang.startsWith("vi-") ||
                voice.name.includes("Vietnamese")
        );

        // Nếu không có voice Việt, sử dụng voice Anh Anh (clear)
        if (!selectedVoice) {
            selectedVoice = voices.find(
                (voice) =>
                    voice.lang === "en-GB" ||
                    (voice.lang.startsWith("en-") &&
                        voice.name.includes("Female"))
            );
        }

        // Fallback: sử dụng voice mặc định đầu tiên
        if (!selectedVoice && voices.length > 0) {
            selectedVoice = voices[0];
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "vi-VN";
        utterance.rate = 0.95; // Tốc độ tự nhiên, không quá chậm
        utterance.pitch = 1.05; // Pitch tự nhiên, phát âm rõ
        utterance.volume = 1;

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        utterance.onend = () => {
            setIsSpeaking(false);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    const handleNext = () => {
        if (currentStep < TUTORIAL_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleClose = () => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
        setCurrentStep(0);
        onClose();
    };

    const handleMuteToggle = () => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
        setIsMuted(!isMuted);
    };

    if (!open) return null;

    return (
        <div className={styles.backdrop} onClick={handleClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>{step.title}</h2>
                    <button className={styles.closeBtn} onClick={handleClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                {/* Content */}
                <div className={styles.content}>
                    {/* Bot Status */}
                    <div
                        className={`${styles.botStatus} ${
                            isSpeaking ? styles.speaking : ""
                        }`}
                    >
                        <div className={styles.botIcon}>🤖</div>
                        <div className={styles.statusText}>
                            {isSpeaking && !isMuted
                                ? "Bot đang nói..."
                                : "Sẵn sàng"}
                        </div>
                    </div>

                    {/* Tutorial Text */}
                    <p className={styles.text}>{step.content}</p>

                    {/* Step Indicator */}
                    <div className={styles.stepIndicator}>
                        <span className={styles.stepNumber}>
                            Bước {currentStep + 1} / {TUTORIAL_STEPS.length}
                        </span>
                        <div className={styles.progressBar}>
                            <div
                                className={styles.progress}
                                style={{
                                    width: `${
                                        ((currentStep + 1) /
                                            TUTORIAL_STEPS.length) *
                                        100
                                    }%`,
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    <button
                        className={`${styles.btn} ${styles.secondary}`}
                        onClick={handleMuteToggle}
                    >
                        {isMuted ? "🔇 Âm lặng" : "🔊 Có âm thanh"}
                    </button>

                    <button
                        className={`${styles.btn} ${styles.secondary}`}
                        onClick={speakStep}
                        disabled={isMuted}
                    >
                        🔁 Nghe lại
                    </button>

                    <div className={styles.navigation}>
                        <button
                            className={`${styles.btn} ${styles.navBtn}`}
                            onClick={handlePrev}
                            disabled={currentStep === 0}
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                            <span>Trước</span>
                        </button>

                        <button
                            className={`${styles.btn} ${styles.navBtn}`}
                            onClick={handleNext}
                            disabled={currentStep === TUTORIAL_STEPS.length - 1}
                        >
                            <span>Tiếp theo</span>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TutorialGuide;
