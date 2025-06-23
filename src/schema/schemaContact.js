import * as yup from "yup";

const schemaContact = yup
    .object({
        fullName: yup.string().required("Vui lòng nhập tên của bạn"),
        email: yup
            .string()
            .required("Vui lòng nhập email của bạn")
            .email("email không đúng định dạng"),
        phone: yup
            .string()
            .notRequired()
            .test(
                "min-length",
                "Số điện thoại không hợp lệ",
                (value) => !value || value.length === 10
            ),
        content: yup.string().required("Vui lòng nhập nội dung"),
    })
    .required();

export default schemaContact;
