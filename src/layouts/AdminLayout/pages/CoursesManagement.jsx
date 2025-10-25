import { Table, Space, Button, Tag, Input } from 'antd';
import { SearchOutlined, CheckCircleOutlined, StopOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Search } = Input;

function CoursesManagement() {
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên khóa học',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Giảng viên',
            dataIndex: 'instructor',
            key: 'instructor',
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
            title: 'Học viên',
            dataIndex: 'students',
            key: 'students',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {record.status === 'pending' ? (
                        <Button icon={<CheckCircleOutlined />} type="primary">
                            Duyệt
                        </Button>
                    ) : (
                        <Button icon={<StopOutlined />} danger>
                            Hủy duyệt
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
            title: 'React Complete Guide',
            instructor: 'John Doe',
            topics: ['React', 'JavaScript'],
            status: 'published',
            students: 120,
        },
        {
            id: 2,
            title: 'Node.js Advanced',
            instructor: 'Jane Smith',
            topics: ['Node.js', 'Backend'],
            status: 'pending',
            students: 0,
        },
        // Add more sample data as needed
    ];

    return (
        <div>
            <h2>Quản lý khóa học</h2>
            <div style={{ marginBottom: 16 }}>
                <Search
                    placeholder="Tìm kiếm khóa học"
                    allowClear
                    enterButton={<SearchOutlined />}
                    style={{ width: 300 }}
                />
            </div>
            <Table columns={columns} dataSource={data} />
        </div>
    );
}

export default CoursesManagement;