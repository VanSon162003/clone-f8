import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

import styles from "./SlideShow.module.scss";

const SlideShow = () => {
    const slides = [
        {
            id: 1,
            title: "Học Lập Trình Frontend",
            description:
                "Khóa học HTML, CSS, JavaScript từ cơ bản đến nâng cao",
            buttonText: "Xem khóa học",
            image: "https://files.fullstack.edu.vn/f8-prod/banners/36/67ef3dad5d92b.png",
            className: "slide-blue",
            customStyles: {
                backgroundColor: "#4158D0",
                backgroundImage:
                    "linear-gradient(to right, rgb(44, 140, 188), rgb(88, 200, 199))",
                color: "white",
            },
        },
        {
            id: 2,
            title: "Học Node.js & Express",
            description: "Xây dựng ứng dụng backend với Node.js và Express",
            buttonText: "Đăng ký ngay",
            image: "https://files.fullstack.edu.vn/f8-prod/banners/37/66b5a6b16d31a.png",
            className: "slide-green",
            customStyles: {
                backgroundColor: "#0093E9",
                backgroundImage:
                    "linear-gradient(to right, rgb(138, 10, 255), rgb(96, 6, 255))",
                color: "white",
            },
        },
        {
            id: 3,
            title: "Khóa học ReactJS",
            description:
                "Làm chủ thư viện ReactJS và xây dựng ứng dụng chuyên nghiệp",
            buttonText: "Khám phá ngay",
            image: "https://files.fullstack.edu.vn/f8-prod/banners/20/68010e5598e64.png",
            className: "slide-purple",
            customStyles: {
                backgroundColor: "#8EC5FC",
                backgroundImage:
                    "linear-gradient(to right, rgb(104, 40, 250), rgb(255, 186, 164))",
                color: "black",
            },
        },
        {
            id: 4,
            title: "Khóa học ReactJS",
            description:
                "Làm chủ thư viện ReactJS và xây dựng ứng dụng chuyên nghiệp",
            buttonText: "Khám phá ngay",
            image: "https://files.fullstack.edu.vn/f8-prod/banners/Banner_web_ReactJS.png",
            className: "slide-purple",
            customStyles: {
                backgroundColor: "#8EC5FC",
                backgroundImage:
                    "linear-gradient(to right, rgb(40, 119, 250), rgb(103, 23, 205))",
                color: "black",
            },
        },
        {
            id: 5,
            title: "Khóa học ReactJS",
            description:
                "Làm chủ thư viện ReactJS và xây dựng ứng dụng chuyên nghiệp",
            buttonText: "Khám phá ngay",
            image: "https://files.fullstack.edu.vn/f8-prod/banners/Banner_03_youtube.png",
            className: "slide-purple",
            customStyles: {
                backgroundColor: "#8EC5FC",
                backgroundImage:
                    "linear-gradient(to right, rgb(118, 18, 255), rgb(5, 178, 255))",
                color: "black",
            },
        },
        {
            id: 6,
            title: "Khóa học ReactJS",
            description:
                "Làm chủ thư viện ReactJS và xây dựng ứng dụng chuyên nghiệp",
            buttonText: "Khám phá ngay",
            image: "https://files.fullstack.edu.vn/f8-prod/banners/Banner_04_2.png",
            className: "slide-purple",
            customStyles: {
                backgroundColor: "#8EC5FC",
                backgroundImage:
                    "linear-gradient(to right, rgb(254, 33, 94), rgb(255, 148, 2))",
                color: "black",
            },
        },
        {
            id: 7,
            title: "Khóa học ReactJS",
            description:
                "Làm chủ thư viện ReactJS và xây dựng ứng dụng chuyên nghiệp",
            buttonText: "Khám phá ngay",
            image: "https://files.fullstack.edu.vn/f8-prod/banners/20/68010e5598e64.png",
            className: "slide-purple",
            customStyles: {
                backgroundColor: "#8EC5FC",
                backgroundImage:
                    "linear-gradient(to right, rgb(0, 126, 254), rgb(6, 195, 254))",
                color: "black",
            },
        },
    ];

    return (
        <div className={styles.slide}>
            <Swiper
                modules={[EffectFade, Autoplay, Pagination, Navigation]}
                effect="fade"
                slidesPerView={1}
                spaceBetween={0}
                loop
                loopFillGroupWithBlank
                rewind={false}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    dynamicBullets: false,
                }}
                navigation={true}
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id} className={slide.className}>
                        <div
                            className={styles.slideItem}
                            style={{
                                background: `${slide.customStyles.backgroundImage}`,
                            }}
                        >
                            <div className={styles.left}>
                                <h2 className={styles.heading}>
                                    <a href="#" target="_blank">
                                        {slide.title}
                                    </a>
                                </h2>

                                <p className={styles.desc}>
                                    {slide.description}
                                </p>

                                <div>
                                    <a href="#" className={styles.ctaBtn}>
                                        {slide.buttonText}
                                    </a>
                                </div>
                            </div>

                            <div className={styles.right}>
                                <a
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img src={slide.image} alt="" />
                                </a>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default SlideShow;
