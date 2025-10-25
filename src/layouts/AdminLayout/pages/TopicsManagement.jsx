import { Table, Space, Button, Modal, Form, Input, Card, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';

function TopicsManagement() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên chủ đề',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
        },
        {
            title: 'Số khóa học',
            dataIndex: 'coursesCount',
            key: 'coursesCount',
        },
        {
            title: 'Số bài viết',
            dataIndex: 'postsCount',
            key: 'postsCount',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                        Sửa
                    </Button>
                    <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)}>
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    const data = [
        {
            id: 1,
            name: 'ReactJS',
            slug: 'reactjs',
            coursesCount: 5,
            postsCount: 12,
        },
        {
            id: 2,
            name: 'Node.js',
            slug: 'nodejs',
            coursesCount: 3,
            postsCount: 8,
        },
        // Thêm dữ liệu mẫu khác
    ];

    const handleEdit = (record) => {
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa chủ đề này?',
            okText: 'Xóa',
            cancelText: 'Hủy',
            okType: 'danger',
            onOk: () => {
                // Xử lý xóa chủ đề
                console.log('Xóa chủ đề:', id);
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
            <h2>Quản lý chủ đề</h2>
            
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col span={6}>
                    <Card>
                        <div>Tổng số chủ đề</div>
                        <h2>25</h2>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <div>Chủ đề có khóa học</div>
                        <h2>18</h2>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <div>Chủ đề có bài viết</div>
                        <h2>20</h2>
                    </Card>
                </Col>
            </Row>

            <div style={{ marginBottom: 16 }}>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => {
                        form.resetFields();
                        setIsModalVisible(true);
                    }}
                >
                    Thêm chủ đề mới
                </Button>
            </div>

            <Table columns={columns} dataSource={data} />

            <Modal
                title={form.getFieldValue('id') ? 'Sửa chủ đề' : 'Thêm chủ đề mới'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
                okText={form.getFieldValue('id') ? 'Cập nhật' : 'Thêm'}
                cancelText="Hủy"
            >
                <Form 
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="name"
                        label="Tên chủ đề"
                        rules={[{ required: true, message: 'Vui lòng nhập tên chủ đề' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="slug"
                        label="Slug"
                        rules={[{ required: true, message: 'Vui lòng nhập slug' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default TopicsManagement;