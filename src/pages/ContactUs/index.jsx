import Input from "@/layouts/DefaultLayout/components/AuthenticationApp/components/Input";
import styles from "./ContactUs.module.scss";
import ParentCard from "@/components/ParentCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEnvelope,
    faHouse,
    faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import schemaContact from "@/schema/schemaContact";
import { useEffect } from "react";
import Button from "@/components/Button";
import { toast } from "react-toastify";

function ContactUs() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schemaContact),
        mode: "onTouched",
    });

    const onSubmit = () => {
        toast.success(
            "Gửi đi thành công, chúng tôi sẽ sớm liện hệ lại với bạn"
        );
        reset();
    };

    return (
        <ParentCard>
            <div className={styles.top}>
                <h1 className={styles.heading}>Liên hệ</h1>
                <div className={`${styles.wrapper} ${styles.desc}`}>
                    <p>
                        F8 luôn lắng nghe và tiếp nhận mọi ý kiến ​đóng góp của
                        bạn. Hãy liên hệ với chúng mình bằng cách điền thông tin
                        vào form dưới đây. Chúng mình sẽ phản hồi bạn trong thời
                        gian sớm nhất.
                    </p>
                </div>
            </div>

            <div className={styles.body}>
                <div className={styles.wrap}>
                    <div className="row">
                        <div className="col col-6 col-lg-12">
                            <div className={styles.formWrapper}>
                                <div className={styles.listInfo}>
                                    <div className={styles.infoWrapper}>
                                        <div className={styles.iconWrapper}>
                                            <FontAwesomeIcon
                                                icon={faHouse}
                                                className={styles.icon}
                                            />
                                        </div>

                                        <p className={styles.text}>
                                            Số 1, ngõ 41, Trần Duy Hưng, Cầu
                                            Giấy, Hà Nội
                                        </p>
                                    </div>

                                    <div className={styles.infoWrapper}>
                                        <div className={styles.iconWrapper}>
                                            <FontAwesomeIcon
                                                icon={faPhone}
                                                className={styles.icon}
                                            />
                                        </div>

                                        <a
                                            className={styles.contact}
                                            href="tel:08 1919 8989"
                                        >
                                            08 1919 8989
                                        </a>
                                    </div>

                                    <div className={styles.infoWrapper}>
                                        <div className={styles.iconWrapper}>
                                            <FontAwesomeIcon
                                                icon={faEnvelope}
                                                className={styles.icon}
                                            />
                                        </div>

                                        <a
                                            className={styles.contact}
                                            href="mailto:contact@fullstack.edu.vn"
                                        >
                                            contact@fullstack.edu.vn
                                        </a>
                                    </div>
                                </div>

                                <form
                                    action=""
                                    onSubmit={handleSubmit(onSubmit)}
                                >
                                    <Input
                                        register={register}
                                        name="fullName"
                                        labelName="Họ và tên"
                                        placeholder="Nhập tên đầy đủ..."
                                        message={errors}
                                    />
                                    <Input
                                        register={register}
                                        name="email"
                                        labelName="Email"
                                        placeholder="Nhập email..."
                                        message={errors}
                                    />

                                    <Input
                                        register={register}
                                        name="phone"
                                        labelName="Số điện thoại"
                                        placeholder="Nhập số điện thoại..."
                                        message={errors}
                                        type="number"
                                    />

                                    <Input
                                        register={register}
                                        name="content"
                                        labelName="Nội dung"
                                        placeholder="Nhập nội dung để liên hệ..."
                                        message={errors}
                                        textArea
                                    />

                                    <div className={styles.submitWrap}>
                                        <Button
                                            rounded
                                            primary
                                            size="medium"
                                            className={`${styles.wrapBtn}`}
                                        >
                                            <span className={styles.inner}>
                                                Gửi đi
                                            </span>
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="col col-6 col-lg-12">
                            <div className={styles.mapWrapper}>
                                {/* <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7448.998934786409!2d105.802574!3d21.012692!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab4df3c6c329%3A0xd8e14fe61fd32604!2zQ8OUTkcgVFkgQ-G7lCBQSOG6pk4gQ8OUTkcgTkdI4buGIEdJw4FPIEThu6RDIEY4!5e0!3m2!1svi!2sus!4v1747296002517!5m2!1svi!2sus"
                                    width="600"
                                    height="450"
                                    style={{ border: 0 }} // ✅ React dùng object cho style
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                /> */}

                                <iframe
                                    className={styles.map}
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7448.998934786409!2d105.802574!3d21.012692!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab4df3c6c329%3A0xd8e14fe61fd32604!2zQ8OUTkcgVFkgQ-G7lCBQSOG6pk4gQ8OUTkcgTkdI4buGIEdJw4FPIEThu6RDIEY4!5e0!3m2!1svi!2sus!4v1747296002517!5m2!1svi!2sus"
                                    width="600"
                                    height="450"
                                    style={{ border: 0 }}
                                    allowfullscreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ParentCard>
    );
}

export default ContactUs;
