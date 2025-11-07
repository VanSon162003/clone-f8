import { useState } from "react";
import {
    Form,
    Input,
    Button,
    Card,
    Upload,
    message,
    Tabs,
    Switch,
    Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
    useGetSettingsQuery,
    useUpdateSettingsMutation,
} from "@/services/admin/systemSettingsService";
import isHttps from "@/utils/isHttps";

function SystemSettings() {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    const { data, isLoading } = useGetSettingsQuery();

    const [updateSettings, { isLoading: isUpdating }] =
        useUpdateSettingsMutation();

    const settings = data?.data;
    // Initialize form with current data
    useState(() => {
        if (settings) {
            form.setFieldsValue({
                name: settings.name,
                description: settings.description,
                seo: settings.seo || {},
                email: settings.email || {},
                auth: settings.auth || {},
            });
            if (settings.logo) {
                const url = isHttps(settings.logo)
                    ? settings.logo
                    : `${import.meta.env.VITE_BASE_URL}${settings.logo}`;
                setFileList([
                    {
                        uid: "-1",
                        name: "current-logo.png",
                        status: "done",
                        url: url,
                    },
                ]);
            }
        }
    }, [settings]);

    const handleSubmit = async (values) => {
        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description);

            // Append SEO settings
            if (values.seo) {
                Object.entries(values.seo).forEach(([key, value]) => {
                    formData.append(`seo[${key}]`, value);
                });
            }

            // Append Email settings
            if (values.email) {
                Object.entries(values.email).forEach(([key, value]) => {
                    formData.append(`email[${key}]`, value);
                });
            }

            // Append Auth settings
            if (values.auth) {
                Object.entries(values.auth).forEach(([key, value]) => {
                    formData.append(`auth[${key}]`, value === true ? "1" : "0");
                });
            }

            if (fileList[0]?.originFileObj) {
                formData.append("logo", fileList[0].originFileObj);
            }

            await updateSettings(formData).unwrap();
            message.success("Cập nhật cài đặt thành công");
        } catch (error) {
            message.error(
                error.data?.message || "Có lỗi xảy ra khi cập nhật cài đặt"
            );
        }
    };

    const uploadProps = {
        accept: "image/*",
        maxCount: 1,
        fileList,
        onChange: ({ fileList: newFileList }) => setFileList(newFileList),
        beforeUpload: () => false, // Prevent auto upload
    };

    // Render loading state
    if (isLoading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: "24px" }}>
            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        auth: {
                            enableRegister: true,
                            requireEmailVerification: true,
                            enable2FA: false,
                        },
                    }}
                >
                    <Tabs defaultActiveKey="general">
                        <Tabs.TabPane tab="Cấu hình chung" key="general">
                            <Form.Item
                                name="name"
                                label="Tên hệ thống"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tên hệ thống!",
                                    },
                                ]}
                            >
                                <Input placeholder="Nhập tên hệ thống" />
                            </Form.Item>

                            <Form.Item name="description" label="Mô tả">
                                <Input.TextArea
                                    rows={4}
                                    placeholder="Nhập mô tả về hệ thống"
                                />
                            </Form.Item>

                            <Form.Item label="Logo" required>
                                <Upload {...uploadProps}>
                                    <Button
                                        icon={<UploadOutlined />}
                                        loading={isUpdating}
                                    >
                                        Tải lên logo
                                    </Button>
                                </Upload>
                            </Form.Item>
                        </Tabs.TabPane>
                    </Tabs>

                    <Form.Item style={{ marginTop: 24 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isUpdating}
                            block
                        >
                            Lưu thay đổi
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}

export default SystemSettings;
