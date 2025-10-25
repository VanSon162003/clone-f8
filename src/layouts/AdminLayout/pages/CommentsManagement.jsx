import { Table, Space, Button, Tag, Input, Tabs } from 'antd';
import { SearchOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';

const { Search } = Input;

function CommentsManagement() {
    const commentColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: 'Người đăng',
            dataIndex: 'user',
            key: 'user',
        },
        {
            title: 'Thuộc về',
            dataIndex: 'target',
            key: 'target',
            render: (target) => (
                <span>{target.type === 'course' ? 'Khóa học: ' : 'Bài viết: '}{target.title}</span>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status === 'active' ? 'Hiển thị' : 'Đã ẩn'}
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<DeleteOutlined />} danger>
                        Ẩn
                    </Button>
                </Space>
            ),
        },
    ];

    const reportColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Lý do báo cáo',
            dataIndex: 'reason',
            key: 'reason',
        },
        {
            title: 'Người báo cáo',
            dataIndex: 'reporter',
            key: 'reporter',
        },
        {
            title: 'Nội dung bị báo cáo',
            dataIndex: 'reportedContent',
            key: 'reportedContent',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'pending' ? 'orange' : 'green'}>
                    {status === 'pending' ? 'Chờ xử lý' : 'Đã xử lý'}
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {record.status === 'pending' && (
                        <Button icon={<CheckOutlined />} type="primary">
                            Đánh dấu đã xử lý
                        </Button>
                    )}
                    <Button icon={<DeleteOutlined />} danger>
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    const commentsData = [
        {
            id: 1,
            content: 'Bài học rất hay!',
            user: 'John Doe',
            target: { type: 'course', title: 'React Complete Guide' },
            status: 'active',
        },
        // Thêm dữ liệu mẫu khác
    ];

    const reportsData = [
        {
            id: 1,
            reason: 'Nội dung spam',
            reporter: 'Jane Smith',
            reportedContent: 'Link quảng cáo trong comment',
            status: 'pending',
        },
        // Thêm dữ liệu mẫu khác
    ];

    return (
        <div>
            <h2>Quản lý bình luận và báo cáo</h2>
            <Tabs defaultActiveKey="comments">
                <Tabs.TabPane tab="Bình luận" key="comments">
                    <div style={{ marginBottom: 16 }}>
                        <Search
                            placeholder="Tìm kiếm bình luận"
                            allowClear
                            enterButton={<SearchOutlined />}
                            style={{ width: 300 }}
                        />
                    </div>
                    <Table columns={commentColumns} dataSource={commentsData} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Báo cáo" key="reports">
                    <div style={{ marginBottom: 16 }}>
                        <Search
                            placeholder="Tìm kiếm báo cáo"
                            allowClear
                            enterButton={<SearchOutlined />}
                            style={{ width: 300 }}
                        />
                    </div>
                    <Table columns={reportColumns} dataSource={reportsData} />
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
}

export default CommentsManagement;