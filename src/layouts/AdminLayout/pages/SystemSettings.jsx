import { Form, Input, Button, Card, Tabs, Upload, Switch } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

function SystemSettings() {
    const [form] = Form.useForm();

    const handleSubmit = (values) => {
        console.log('Form values:', values);
    };

    const generalSettings = (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
                siteName: 'F8 Clone',
                siteDescription: 'Học lập trình để đi làm',
                contactEmail: 'contact@f8clone.com',
            }}
        >
            <Form.Item
                name="siteName"
                label="Tên website"
                rules={[{ required: true, message: 'Vui lòng nhập tên website' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="siteDescription"
                label="Mô tả website"
            >
                <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item
                name="logo"
                label="Logo"
            >
                <Upload>
                    <Button icon={<UploadOutlined />}>Tải logo lên</Button>
                </Upload>
            </Form.Item>

            <Form.Item
                name="favicon"
                label="Favicon"
            >
                <Upload>
                    <Button icon={<UploadOutlined />}>Tải favicon lên</Button>
                </Upload>
            </Form.Item>

            <Form.Item
                name="contactEmail"
                label="Email liên hệ"
                rules={[
                    { required: true, message: 'Vui lòng nhập email liên hệ' },
                    { type: 'email', message: 'Email không hợp lệ' }
                ]}
            >
                <Input />
            </Form.Item>

            <Button type="primary" htmlType="submit">
                Lưu cấu hình
            </Button>
        </Form>
    );

    const seoSettings = (
        <Form
            layout="vertical"
            onFinish={handleSubmit}
        >
            <Form.Item
                name="metaTitle"
                label="Meta Title"
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="metaDescription"
                label="Meta Description"
            >
                <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item
                name="metaKeywords"
                label="Meta Keywords"
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="googleAnalytics"
                label="Google Analytics ID"
            >
                <Input />
            </Form.Item>

            <Button type="primary" htmlType="submit">
                Lưu cấu hình SEO
            </Button>
        </Form>
    );

    const emailSettings = (
        <Form
            layout="vertical"
            onFinish={handleSubmit}
        >
            <Form.Item
                name="smtpHost"
                label="SMTP Host"
                rules={[{ required: true }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="smtpPort"
                label="SMTP Port"
                rules={[{ required: true }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="smtpUsername"
                label="SMTP Username"
                rules={[{ required: true }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="smtpPassword"
                label="SMTP Password"
                rules={[{ required: true }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                name="smtpEncryption"
                label="Sử dụng SSL/TLS"
            >
                <Switch />
            </Form.Item>

            <Button type="primary" htmlType="submit">
                Lưu cấu hình Email
            </Button>
        </Form>
    );

    const authSettings = (
        <Form
            layout="vertical"
            onFinish={handleSubmit}
        >
            <Card title="Google OAuth">
                <Form.Item
                    name="googleClientId"
                    label="Client ID"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="googleClientSecret"
                    label="Client Secret"
                >
                    <Input.Password />
                </Form.Item>
            </Card>

            <Card title="Facebook OAuth" style={{ marginTop: 16 }}>
                <Form.Item
                    name="facebookAppId"
                    label="App ID"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="facebookAppSecret"
                    label="App Secret"
                >
                    <Input.Password />
                </Form.Item>
            </Card>

            <Button type="primary" htmlType="submit" style={{ marginTop: 16 }}>
                Lưu cấu hình Auth
            </Button>
        </Form>
    );

    return (
        <div>
            <h2>Cấu hình hệ thống</h2>
            
            <Tabs defaultActiveKey="general">
                <Tabs.TabPane tab="Cấu hình chung" key="general">
                    {generalSettings}
                </Tabs.TabPane>
                <Tabs.TabPane tab="Cấu hình SEO" key="seo">
                    {seoSettings}
                </Tabs.TabPane>
                <Tabs.TabPane tab="Cấu hình Email" key="email">
                    {emailSettings}
                </Tabs.TabPane>
                <Tabs.TabPane tab="Cấu hình Auth" key="auth">
                    {authSettings}
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
}

export default SystemSettings;