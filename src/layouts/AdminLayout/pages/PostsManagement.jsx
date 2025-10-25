import { Table, Space, Button, Tag, Input } from 'antd';
import { SearchOutlined, CheckCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Search } = Input;

function PostsManagement() {
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            key: 'author',
        },
        {
            title: 'Chủ đề',
            dataIndex: 'topics',
            key: 'topics',
            render: (topics) => (
                <>
                    {topics.map((topic) => (
                        <Tag color="blue" key={topic}>
                            {topic}
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
                <Tag color={status === 'published' ? 'green' : 'orange'}>
                    {status === 'published' ? 'Đã duyệt' : 'Chờ duyệt'}
                </Tag>
            ),
        },
        {
            title: 'Lượt xem',
            dataIndex: 'views',
            key: 'views',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {record.status === 'pending' && (
                        <Button icon={<CheckCircleOutlined />} type="primary">
                            Duyệt
                        </Button>
                    )}
                    <Button icon={<EditOutlined />}>Sửa</Button>
                    <Button icon={<DeleteOutlined />} danger>
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    const data = [
        {
            id: 1,
            title: 'Giới thiệu về React Hooks',
            author: 'John Doe',
            topics: ['React', 'Frontend'],
            status: 'published',
            views: 1200,
        },
        {
            id: 2,
            title: 'Tối ưu hiệu năng Node.js',
            author: 'Jane Smith',
            topics: ['Node.js', 'Backend'],
            status: 'pending',
            views: 0,
        },
        // Add more sample data as needed
    ];

    return (
        <div>
            <h2>Quản lý bài viết</h2>
            <div style={{ marginBottom: 16 }}>
                <Search
                    placeholder="Tìm kiếm bài viết"
                    allowClear
                    enterButton={<SearchOutlined />}
                    style={{ width: 300 }}
                />
            </div>
            <Table columns={columns} dataSource={data} />
        </div>
    );
}

export default PostsManagement;