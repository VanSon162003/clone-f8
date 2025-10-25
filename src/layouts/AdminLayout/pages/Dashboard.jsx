import { Card, Row, Col, Statistic } from 'antd';
import {
    UserOutlined,
    BookOutlined,
    FileTextOutlined,
    DollarOutlined,
} from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 2000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
];

function Dashboard() {
    return (
        <div>
            <h2>Dashboard</h2>
            <Row gutter={16}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Tổng số người dùng"
                            value={1128}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Tổng số khóa học"
                            value={93}
                            prefix={<BookOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Tổng số bài viết"
                            value={245}
                            prefix={<FileTextOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Doanh thu tháng này"
                            value={234500000}
                            prefix={<DollarOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <div style={{ marginTop: 32 }}>
                <h3>Biểu đồ doanh thu 6 tháng gần nhất</h3>
                <BarChart width={800} height={300} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
            </div>
        </div>
    );
}

export default Dashboard;