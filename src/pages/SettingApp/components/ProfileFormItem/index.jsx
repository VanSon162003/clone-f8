import { useEffect, useState } from "react";
import styles from "./ProfileFormItem.module.scss";
import Magic from "@/components/Magic";
import Button from "@/components/Button";
import { faChevronLeft, faXmark } from "@fortawesome/free-solid-svg-icons";
import Input from "@/layouts/DefaultLayout/components/AuthenticationApp/components/Input";
import authService from "@/services/authService";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useDebounce from "@/hook/useDebounce";
import { useUpdateCurrentUserMutation } from "@/services/ProfileService";

const storage = {
    username: {
        title: "Cập nhật tên của bạn",
        desc: "Tên sẽ được hiển thị trên trang cá nhân, trong các bình luận và bài viết của bạn.",
    },
    fullname: {
        title: "Cập nhật họ và tên của bạn",
        desc: "Họ và tên sẽ được hiển thị trên trang cá nhân, trong các bình luận và bài viết của bạn.",
    },

    website: {
        title: "Cập nhật trang web cá nhân",
        desc: "Nhập URL trang web cá nhân hoặc blog của bạn.",
    },
    github: {
        title: "Cập nhật GitHub",
        desc: "Nhập địa chỉ GitHub của bạn.",
    },
    linkedin: {
        title: "Cập nhật LinkedIn",
        desc: "Nhập địa chỉ LinkedIn của bạn.",
    },
    facebook: {
        title: "Cập nhật Facebook",
        desc: "Nhập địa chỉ Facebook cá nhân hoặc trang của bạn.",
    },
    youtube: {
        title: "Cập nhật YouTube",
        desc: "Nhập kênh YouTube hoặc URL video giới thiệu.",
    },
    tiktok: {
        title: "Cập nhật TikTok",
        desc: "Nhập địa chỉ TikTok của bạn.",
    },

    file: {
        title: "Ảnh đại diện",
        desc: "Ảnh đại diện giúp mọi người nhận biết bạn dễ dàng hơn qua các bài viết, bình luận, tin nhắn...",
    },

    changePassword: {
        title: "Đổi mật khẩu",
        desc: "Mật khẩu của bạn phải có tối thiểu 8 ký tự, hãy đặt mật khẩu mạnh nhất có thể nhé!!!",
    },

    verify: {
        title: "Xác nhận mật khẩu",
        desc: "Để chắc chắn rằng bạn là chủ sở hữu tài khoản, vui lòng nhập mật khẩu hiện tại của bạn.",
    },
};

const label = {
    username: "Họ và tên",
    age: "Tuổi",
    gender: "Giới tính",
    email: "Email",
    phone: "Số điện thoại",
    birthDate: "Ngày sinh",
    emailVerifiedAt: "Nhập mã xác minh",
    file: "",
    changePassword: "",
    verify: "",
    website: "Trang web cá nhân",
    github: "GitHub",
    linkedin: "LinkedIn",
    facebook: "Facebook",
    youtube: "YouTube",
    tiktok: "TikTok",
};

function ProfileFormItem({
    type = "",
    setShowFormItem = () => {},
    setIsRoll = () => {},
    user = {},
}) {
    // Map ui field types to actual user object keys (backend)
    const mapTypeToUserKey = (t) => {
        const map = {
            fullname: "full_name",
            username: "username",
            about: "about",
            file: "avatar",
            // social mappings -> backend column names
            website: "website_url",
            github: "github_url",
            linkedin: "linkedkin_url",
            facebook: "facebook_url",
            youtube: "youtube_url",
            tiktok: "tiktok_url",
        };
        return map[t] || t;
    };

    const userKey = mapTypeToUserKey(type);
    const initialValue = user && user[userKey] ? user[userKey] : "";

    // define validation schema for social links (optional but must be a valid URL when provided)
    const socialKeys = [
        "website",
        "github",
        "linkedin",
        "facebook",
        "youtube",
        "tiktok",
    ];

    // per-social validation: require http/https and check host contains expected domain
    const socialHosts = {
        github: ["github.com"],
        linkedin: ["linkedin.com"],
        facebook: ["facebook.com"],
        youtube: ["youtube.com", "youtu.be"],
        tiktok: ["tiktok.com", "vt.tiktok.com"],
        // website: allow any host
        website: [],
    };

    const makeSocialValidator = (key) =>
        yup
            .string()
            .trim()
            .test(
                "is-url-or-empty",
                "Đường dẫn không hợp lệ. Vui lòng nhập một URL hợp lệ (ví dụ: https://example.com)",
                (v) => {
                    if (!v) return true;
                    try {
                        const url = new URL(v);
                        if (
                            !(
                                url.protocol === "http:" ||
                                url.protocol === "https:"
                            )
                        )
                            return false;
                        const hosts = socialHosts[key] || [];
                        if (hosts.length === 0) return true; // website or unspecified: accept any host

                        const host = url.hostname.toLowerCase();
                        return hosts.some((h) => host.includes(h));
                    } catch {
                        return false;
                    }
                }
            );

    // Build schema shape. Avoid using `when` referencing a non-form field (causes Yup internals error).
    const schemaShape = {
        username: yup.string().trim(),
        fullname: yup.string().trim(),
        about: yup.string().trim(),
    };

    if (type === "changePassword") {
        schemaShape.oldPassword = yup
            .string()
            .required("Vui lòng nhập mật khẩu hiện tại");
        schemaShape.newPassword = yup
            .string()
            .required("Vui lòng nhập mật khẩu mới")
            .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự");
    }

    socialKeys.forEach((k) => (schemaShape[k] = makeSocialValidator(k)));

    const schema = yup.object().shape(schemaShape);

    const {
        register,
        handleSubmit,
        watch,
        trigger,
        setError,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: (() => {
            if (type === "changePassword") {
                return { oldPassword: "", newPassword: "" };
            }
            return { [type]: initialValue };
        })(),
    });

    const [avatar, setAvatar] = useState({});
    const [url, setUrl] = useState("");

    const [, { isLoading }] = useUpdateCurrentUserMutation();

    useEffect(() => {
        return () => {
            URL.revokeObjectURL(url);
        };
    }, [url]);

    useEffect(() => {
        setIsRoll(true);
    }, [setIsRoll]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setShowFormItem(false);
                setIsRoll(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [setIsRoll, setShowFormItem]);

    const title = storage[type]?.title;
    const desc = storage[type]?.desc;
    const placeholders = {
        website: "Nhập đường dẫn trang web của bạn",
        github: "Nhập đường dẫn trang GitHub của bạn",
        linkedin: "Nhập đường dẫn trang LinkedIn của bạn",
        facebook: "Nhập đường dẫn trang Facebook của bạn",
        youtube: "Nhập đường dẫn kênh YouTube của bạn",
        tiktok: "Nhập đường dẫn trang TikTok của bạn",
    };

    const examples = {
        website: "https://example.com",
        github: "https://github.com/username",
        linkedin: "https://www.linkedin.com/in/username",
        facebook: "https://www.facebook.com/username",
        youtube: "https://www.youtube.com/channel/CHANNEL_ID",
        tiktok: "https://www.tiktok.com/@username",
    };

    const isSocial = [
        "website",
        "github",
        "linkedin",
        "facebook",
        "youtube",
        "tiktok",
    ].includes(type);

    const handleSubmitAvatar = async (e) => {
        e.preventDefault();
        if (!avatar) return;

        // validate social fields before sending
        const ok = await trigger([
            "website",
            "github",
            "linkedin",
            "facebook",
            "youtube",
            "tiktok",
        ]);

        if (!ok) {
            toast.error("Vui lòng sửa các lỗi trước khi cập nhật ảnh đại diện");
            return;
        }

        const formData = new FormData();
        formData.append("image", avatar);

        try {
            const username = watch("username") || user?.username || "";
            const fullname = watch("fullname") || user?.full_name || "";
            const about = watch("about") || user?.about || "";

            // append social fields as well so avatar update carries social links
            const socialKeys = [
                "website",
                "github",
                "linkedin",
                "facebook",
                "youtube",
                "tiktok",
            ];

            const socialData = {};
            socialKeys.forEach((k) => {
                const v = watch(k) || user?.[k] || "";
                if (v) {
                    // coerce to string to avoid arrays
                    socialData[k] = typeof v === "string" ? v : String(v);
                }
            });

            if (username) formData.append("username", username);
            if (fullname) formData.append("full_name", fullname);
            if (about) formData.append("about", about);

            Object.keys(socialData).forEach((k) => {
                formData.append(k, socialData[k]);
            });

            const res = await authService.updateUserImg(formData);

            if (res) {
                setShowFormItem(false);
                setIsRoll(false);
                toast.success("Cập nhật thành công");

                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        } catch (_err) {
            console.log(_err);
            toast.error("Cập nhập thất bại");
        }
    };

    // 2FA UI state
    const [qrData, setQrData] = useState(null);
    const [tmpSecret, setTmpSecret] = useState(null);
    const [twoFaToken, setTwoFaToken] = useState("");
    const [recoveryCodes, setRecoveryCodes] = useState([]);

    const usernameValue = useDebounce(watch("username"), 600);

    useEffect(() => {
        if (usernameValue) {
            (async () => {
                const ok = await trigger("username");
                if (ok) {
                    const res = await authService.checkUserName(
                        `${usernameValue}&exclude_id=${user?.id}`
                    );
                    if (res) {
                        setError("username", {
                            message: "username đã tồn tại",
                        });
                    }
                }
            })();
        }
    }, [usernameValue, setError, trigger, user.id]);

    const onSubmit = (data) => {
        // Build FormData to include file + text fields
        const formData = new FormData();

        // If a new avatar was selected via Input, include it
        if (avatar && avatar instanceof File) {
            formData.append("image", avatar);
        }

        // Determine values for username, fullname, about
        const username =
            data.username || watch("username") || user?.username || "";
        const fullname =
            data.fullname || watch("fullname") || user?.full_name || "";
        const about = data.about || watch("about") || user?.about || "";

        if (username) formData.append("username", username);
        if (fullname) formData.append("full_name", fullname);
        if (about) formData.append("about", about);

        // append social fields: if editing a single social field, send only that field
        const socialKeys = [
            "website",
            "github",
            "linkedin",
            "facebook",
            "youtube",
            "tiktok",
        ];

        if (isSocial) {
            const raw = data[type] || watch(type) || user?.[type] || "";
            const val =
                raw !== undefined && raw !== null
                    ? typeof raw === "string"
                        ? raw
                        : String(raw)
                    : "";
            if (val) formData.append(type, val);
        } else {
            socialKeys.forEach((k) => {
                const raw = data[k] || watch(k) || user?.[k] || "";
                const val =
                    raw !== undefined && raw !== null
                        ? typeof raw === "string"
                            ? raw
                            : String(raw)
                        : "";
                if (val) formData.append(k, val);
            });
        }

        // Also append any other field that might be present in data (skip social keys to avoid duplicates)
        Object.keys(data).forEach((key) => {
            const val = data[key];
            if (val !== undefined && val !== null) {
                if (key === "username" || key === "fullname" || key === "about")
                    return;
                if (socialKeys.includes(key)) return;
                formData.append(key, val);
            }
        });

        (async () => {
            try {
                const res = await authService.updateUserImg(formData);

                if (res) {
                    toast.success("Cập nhật thành công");
                    setShowFormItem(false);

                    setTimeout(() => {
                        if (type === "username")
                            window.top.location.replace(
                                "/setting/p/" + username
                            );
                        window.location.reload();
                    }, 1500);
                }
            } catch (err) {
                console.log(err);
                toast.error("Cập nhập thất bại");
            }
        })();
    };

    return url ? (
        <form
            action=""
            className={styles.wrapper}
            onSubmit={handleSubmitAvatar}
        >
            <div className={styles.overlay}></div>
            <div className={styles.inner}>
                <Magic position="absolute" zIndex={"-1"} />
                <div className={styles.control}>
                    <Button
                        href="#"
                        icon={faChevronLeft}
                        className={styles.back}
                        onClick={() => setUrl("")}
                    />
                    <Button
                        href="#"
                        icon={faXmark}
                        className={styles.closeUrl}
                        onClick={() => {
                            setShowFormItem(false);
                            setIsRoll(false);
                        }}
                    />
                </div>
                <header className={styles.header}>
                    <h2 className={styles.title}>Xem trước</h2>
                </header>
                <main className={styles.content}>
                    <Input type="review" url={url} />
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        className={`${styles.wrapperBtn} ${styles.btnPrimary} ${styles.rounded} `}
                    >
                        Cập nhật
                    </Button>
                </main>
            </div>
        </form>
    ) : (
        <form
            action=""
            className={styles.wrapper}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div
                className={styles.overlay}
                onClick={() => {
                    setShowFormItem(false);
                    setIsRoll(false);
                }}
            ></div>
            <div className={styles.inner}>
                <Magic position="absolute" zIndex={"-1"} />

                <div className={styles.control}>
                    <Button
                        href="#"
                        icon={faXmark}
                        className={styles.close}
                        onClick={() => {
                            setShowFormItem(false);
                            setIsRoll(false);
                        }}
                    />
                </div>

                <header className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.desc}>{desc}</p>
                </header>

                <main className={styles.content}>
                    {type === "changePassword" ? (
                        <>
                            <Input
                                user={user}
                                type="password"
                                name="oldPassword"
                                defaultValue={""}
                                labelName={"Mật khẩu hiện tại"}
                                placeholder={"Nhập mật khẩu hiện tại"}
                                register={register}
                                message={errors}
                            />

                            <Input
                                user={user}
                                type="password"
                                name="newPassword"
                                defaultValue={""}
                                labelName={"Mật khẩu mới"}
                                placeholder={
                                    "Nhập mật khẩu mới (ít nhất 8 ký tự)"
                                }
                                register={register}
                                message={errors}
                            />
                            <Button
                                isLoading={isLoading}
                                className={`${styles.wrapperBtn} ${styles.btnPrimary} ${styles.rounded}  `}
                                onClick={handleSubmit(async (data) => {
                                    try {
                                        const res =
                                            await authService.changePassword(
                                                data.oldPassword,
                                                data.newPassword
                                            );
                                        if (res) {
                                            toast.success(
                                                "Đổi mật khẩu thành công"
                                            );
                                            setShowFormItem(false);
                                            setIsRoll(false);
                                            setTimeout(
                                                () => window.location.reload(),
                                                1200
                                            );
                                        }
                                    } catch (err) {
                                        console.error(err);
                                        const msg =
                                            err?.response?.data?.message ||
                                            err?.message ||
                                            "Đổi mật khẩu thất bại";
                                        toast.error(msg);
                                    }
                                })}
                            >
                                Đổi mật khẩu
                            </Button>
                        </>
                    ) : type === "verify" ? (
                        <>
                            {user?.two_factor_enabled ? (
                                <>
                                    <p>Xác thực 2 bước đang được bật</p>
                                    <Input
                                        type="text"
                                        name="disableToken"
                                        defaultValue={""}
                                        labelName={"Mã xác thực"}
                                        placeholder={"Nhập mã để tắt 2FA"}
                                        register={() => {}}
                                        message={{}}
                                        value={twoFaToken}
                                        onChange={(e) =>
                                            setTwoFaToken(e.target.value)
                                        }
                                    />
                                    <Button
                                        className={`${styles.wrapperBtn} ${styles.btnPrimary} ${styles.rounded}`}
                                        onClick={async () => {
                                            try {
                                                await authService.twoFactorDisable(
                                                    twoFaToken
                                                );
                                                toast.success(
                                                    "2FA đã được tắt"
                                                );
                                                setShowFormItem(false);
                                            } catch (err) {
                                                toast.error(
                                                    err?.response?.data
                                                        ?.message ||
                                                        err?.message ||
                                                        "Tắt 2FA thất bại"
                                                );
                                            }
                                        }}
                                    >
                                        Tắt 2FA
                                    </Button>
                                </>
                            ) : (
                                <>
                                    {!qrData ? (
                                        <Button
                                            className={`${styles.wrapperBtn} ${styles.btnPrimary} ${styles.rounded}`}
                                            onClick={async () => {
                                                try {
                                                    const res =
                                                        await authService.twoFactorSetup();
                                                    // res contains { secret, qr }
                                                    setTmpSecret(res.secret);
                                                    setQrData(res.qr);
                                                } catch (err) {
                                                    toast.error(
                                                        err?.response?.data
                                                            ?.message ||
                                                            err?.message ||
                                                            "Lấy QR thất bại"
                                                    );
                                                }
                                            }}
                                        >
                                            Bật 2FA
                                        </Button>
                                    ) : (
                                        <div>
                                            <img src={qrData} alt="QR" />
                                            <Input
                                                type="text"
                                                name="twoFaToken"
                                                defaultValue={""}
                                                labelName={"Mã xác thực"}
                                                placeholder={
                                                    "Nhập mã từ ứng dụng Authenticator"
                                                }
                                                register={() => {}}
                                                message={{}}
                                                value={twoFaToken}
                                                onChange={(e) =>
                                                    setTwoFaToken(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <Button
                                                className={`${styles.wrapperBtn} ${styles.btnPrimary} ${styles.rounded}`}
                                                onClick={async () => {
                                                    try {
                                                        const r =
                                                            await authService.twoFactorVerify(
                                                                twoFaToken,
                                                                tmpSecret
                                                            );
                                                        toast.success(
                                                            "2FA đã được bật"
                                                        );
                                                        if (
                                                            r &&
                                                            r.data &&
                                                            r.data
                                                                .recovery_codes
                                                        ) {
                                                            setRecoveryCodes(
                                                                r.data
                                                                    .recovery_codes ||
                                                                    []
                                                            );
                                                        }
                                                        // keep the modal open so user can copy/save recovery codes
                                                    } catch (err) {
                                                        toast.error(
                                                            err?.response?.data
                                                                ?.message ||
                                                                err?.message ||
                                                                "Kích hoạt 2FA thất bại"
                                                        );
                                                    }
                                                }}
                                            >
                                                Xác nhận
                                            </Button>
                                            {recoveryCodes &&
                                                recoveryCodes.length > 0 && (
                                                    <div
                                                        className={
                                                            styles.recoveryCodes
                                                        }
                                                    >
                                                        <h4>Mã khôi phục</h4>
                                                        <p>
                                                            Lưu lại các mã này ở
                                                            nơi an toàn. Mỗi mã
                                                            chỉ dùng được một
                                                            lần.
                                                        </p>
                                                        <ul>
                                                            {recoveryCodes.map(
                                                                (c, idx) => (
                                                                    <li
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className={
                                                                            styles.codeItem
                                                                        }
                                                                    >
                                                                        {c}
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                        <div
                                                            className={
                                                                styles.recoveryActions
                                                            }
                                                        >
                                                            <Button
                                                                className={`${styles.wrapperBtn} ${styles.btnSecondary}`}
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(
                                                                        recoveryCodes.join(
                                                                            "\n"
                                                                        )
                                                                    );
                                                                    toast.success(
                                                                        "Đã sao chép mã khôi phục"
                                                                    );
                                                                }}
                                                            >
                                                                Sao chép
                                                            </Button>
                                                            <Button
                                                                className={`${styles.wrapperBtn} ${styles.btnSecondary}`}
                                                                onClick={() => {
                                                                    const blob =
                                                                        new Blob(
                                                                            [
                                                                                recoveryCodes.join(
                                                                                    "\n"
                                                                                ),
                                                                            ],
                                                                            {
                                                                                type: "text/plain;charset=utf-8",
                                                                            }
                                                                        );
                                                                    const url =
                                                                        URL.createObjectURL(
                                                                            blob
                                                                        );
                                                                    const a =
                                                                        document.createElement(
                                                                            "a"
                                                                        );
                                                                    a.href =
                                                                        url;
                                                                    a.download =
                                                                        "recovery_codes.txt";
                                                                    document.body.appendChild(
                                                                        a
                                                                    );
                                                                    a.click();
                                                                    a.remove();
                                                                    URL.revokeObjectURL(
                                                                        url
                                                                    );
                                                                }}
                                                            >
                                                                Tải về
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <Input
                            user={user}
                            type={type === "file" ? type : "text"}
                            name={type}
                            defaultValue={initialValue}
                            labelName={label[type]}
                            placeholder={placeholders[type] || label[type]}
                            example={examples[type]}
                            setAvatar={setAvatar}
                            setUrl={setUrl}
                            register={register}
                            message={errors}
                        />
                    )}
                    {type !== "file" && type !== "changePassword" && (
                        <Button
                            isLoading={isLoading}
                            className={`${styles.wrapperBtn} ${styles.btnPrimary} ${styles.rounded}  `}
                        >
                            {isSocial ? "Lưu lại" : "Cập nhật"}
                        </Button>
                    )}
                </main>
            </div>
        </form>
    );
}

export default ProfileFormItem;
