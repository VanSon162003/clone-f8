import * as yup from "yup";

const schemaProfile = yup
    .object({
        username: yup.string(),
        email: yup.string().email("Cần nhập đúng định dạng email"),
    })
    .required();

export default schemaProfile;
