import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

import styles from "./SlideShow.module.scss";
import { useGetSlidesQuery } from "@/services/admin/slideshowApi";
import { Skeleton } from "antd";
import { Link } from "react-router-dom";

const SlideShow = () => {
    const { data: slides = [], isLoading } = useGetSlidesQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    console.log(slides);

    if (isLoading) {
        return (
            <div className={styles.slide}>
                <Skeleton.Image active className="w-full h-[270px]" />
            </div>
        );
    }

    if (!slides.length) {
        return null;
    }

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
                {slides.map((slide) => {
                    const customStyles = slide.customStyles
                        ? JSON.parse(JSON.parse(slide.customStyles))
                        : {};

                    const classNameStyles = slide.className;
                    return (
                        <SwiperSlide
                            key={slide.id}
                            className={styles[classNameStyles]}
                        >
                            <div
                                className={styles.slideItem}
                                style={{
                                    background:
                                        customStyles.backgroundImage ||
                                        customStyles.backgroundColor,
                                }}
                            >
                                <div className={styles.left}>
                                    <h2 className={styles.heading}>
                                        <Link to={`${slide.url}`}>
                                            {slide.title}
                                        </Link>
                                    </h2>

                                    <p className={styles.desc}>
                                        {slide.description}
                                    </p>

                                    <div>
                                        <Link
                                            to={`${slide.url}`}
                                            className={styles.ctaBtn}
                                        >
                                            {slide.buttonText}
                                        </Link>
                                    </div>
                                </div>

                                <div className={styles.right}>
                                    <Link
                                        to={`${slide.url}`}
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            src={`${
                                                import.meta.env.VITE_BASE_URL
                                            }${slide.image}`}
                                            alt={slide.title}
                                        />
                                    </Link>
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
};

export default SlideShow;
