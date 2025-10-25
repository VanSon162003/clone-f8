import { Table, Space, Button, Tag, Modal, Form, Input, Upload, Card, Row, Col } from 'antd';
import { 
    EditOutlined, 
    DeleteOutlined, 
    CheckCircleOutlined, 
    UploadOutlined,
    UserOutlined,
    BookOutlined,
    StarOutlined
} from '@ant-design/icons';
import { useState } from 'react';

function InstructorsManagement() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên giảng viên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Chuyên môn',
            dataIndex: 'specialties',
            key: 'specialties',
            render: (specialties) => (
                <>
                    {specialties.map((specialty) => (
                        <Tag color="blue" key={specialty}>
                            {specialty}
                        </Tag>
                    ))}
                </>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'orange'}>
                    {status === 'active' ? 'Đang hoạt động' : 'Chờ duyệt'}
                </Tag>
            ),
        },
        {
            title: 'Số khóa học',
            dataIndex: 'coursesCount',
            key: 'coursesCount',
        },
        {
            title: 'Đánh giá TB',
            dataIndex: 'rating',
            key: 'rating',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {record.status === 'pending' && (
                        <Button 
                            icon={<CheckCircleOutlined />} 
                            type="primary"
                            onClick={() => handleApprove(record.id)}
                        >
                            Duyệt
                        </Button>
                    )}
                    <Button 
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Sửa
                    </Button>
                    <Button 
                        icon={<DeleteOutlined />} 
                        danger
                        onClick={() => handleDelete(record.id)}
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    const data = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            specialties: ['React', 'JavaScript'],
            status: 'active',
            coursesCount: 5,
            rating: 4.8,
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            specialties: ['Node.js', 'Python'],
            status: 'pending',
            coursesCount: 0,
            rating: 0,
        },
        // Thêm dữ liệu mẫu khác
    ];

    const handleApprove = (id) => {
        Modal.confirm({
            title: 'Xác nhận duyệt',
            content: 'Bạn có chắc chắn muốn duyệt giảng viên này?',
            okText: 'Duyệt',
            cancelText: 'Hủy',
            onOk: () => {
                console.log('Duyệt giảng viên:', id);
            },
        });
    };

    const handleEdit = (record) => {
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa giảng viên này?',
            okText: 'Xóa',
            cancelText: 'Hủy',
            okType: 'danger',
            onOk: () => {
                console.log('Xóa giảng viên:', id);
            },
        });
    };

    const handleSubmit = (values) => {
        console.log('Form values:', values);
        setIsModalVisible(false);
        form.resetFields();
    };

    return (
        <div>
            <h2>Quản lý giảng viên</h2>

            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col span={8}>
                    <Card>
                        <Space>
                            <UserOutlined style={{ fontSize: 24 }} />
                            <div>
                                <div>Tổng số giảng viên</div>
                                <h2>25</h2>
                            </div>
                        </Space>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Space>
                            <BookOutlined style={{ fontSize: 24 }} />
                            <div>
                                <div>Tổng số khóa học</div>
                                <h2>150</h2>
                            </div>
                        </Space>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Space>
                            <StarOutlined style={{ fontSize: 24 }} />
                            <div>
                                <div>Đánh giá trung bình</div>
                                <h2>4.5</h2>
                            </div>
                        </Space>
                    </Card>
                </Col>
            </Row>

            <Table columns={columns} dataSource={data} />

            <Modal
                title={form.getFieldValue('id') ? 'Sửa thông tin giảng viên' : 'Thêm giảng viên mới'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
                okText={form.getFieldValue('id') ? 'Cập nhật' : 'Thêm'}
                cancelText="Hủy"
                width={600}
            >
                <Form 
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="name"
                        label="Tên giảng viên"
                        rules={[{ required: true, message: 'Vui lòng nhập tên giảng viên' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email' },
                            { type: 'email', message: 'Email không hợp lệ' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="bio"
                        label="Tiểu sử"
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item
                        name="avatar"
                        label="Ảnh đại diện"
                    >
                        <Upload>
                            <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default InstructorsManagement;