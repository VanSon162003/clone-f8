import * as yup from "yup";

const schemaLogin = yup
    .object({
        email: yup
            .string()
            .required("trường này là bắt buộc")
            .email("email không đúng định dạng"),
        password: yup
            .string()
            .required("trường này là bắt buộc")
            .min(6, "mật khẩu cần tối thiểu 6 ký tự "),
    })
    .required();

export default schemaLogin;
