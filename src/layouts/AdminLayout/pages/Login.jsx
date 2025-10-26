import { Form, Input, Button, Card, message, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useLoginMutation } from "@/services/admin/authService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "@/features/auth/authSlice";

function Login() {
    const [login, { isLoading }] = useLoginMutation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [errorMessage, setErrorMessage] = useState(null);

    const onFinish = async (values) => {
        try {
            setErrorMessage(null);
            const response = await login(values).unwrap();

            if (response.data.tokenData) {
                localStorage.setItem(
                    "token",
                    response.data.tokenData.access_token
                );

                await dispatch(getCurrentUser()).unwrap();
                navigate("/admin/");
            }
        } catch (error) {
            console.log(error);

            if (error.status === 401) {
                setErrorMessage("Email hoặc mật khẩu không chính xác!");
            } else {
                setErrorMessage("Có lỗi xảy ra khi đăng nhập!");
            }
        }
    };

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f0f2f5",
            }}
        >
            <Card title="Đăng nhập Admin" style={{ width: 400 }}>
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập email!",
                            },
                            {
                                type: "email",
                                message: "Email không hợp lệ!",
                            },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Email"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập mật khẩu!",
                            },
                            {
                                min: 6,
                                message: "Mật khẩu phải có ít nhất 6 ký tự!",
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Mật khẩu"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item rules={[]}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                            style={{ width: "100%" }}
                            size="large"
                        >
                            Đăng nhập
                        </Button>
                    </Form.Item>

                    {errorMessage && (
                        <Form.Item>
                            <Alert
                                message={errorMessage}
                                type="error"
                                showIcon
                            />
                        </Form.Item>
                    )}
                </Form>
            </Card>
        </div>
    );
}

export default Login;
