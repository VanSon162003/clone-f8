import * as yup from "yup";

const schemaRegister = yup
    .object({
        firstName: yup.string().required("trường này là bắt buộc"),
        lastName: yup.string().required("trường này là bắt buộc"),
        email: yup
            .string()
            .required("trường này là bắt buộc")
            .email("email không đúng định dạng"),
        password: yup
            .string()
            .required("trường này là bắt buộc")
            .min(6, "mật khẩu cần tối thiểu 6 ký tự "),
        password_confirmation: yup
            .string()
            .required("trường này là bắt buộc")
            .oneOf([yup.ref("password")], "mật khẩu nhập lại không khớp"),
    })
    .required();

export default schemaRegister;
