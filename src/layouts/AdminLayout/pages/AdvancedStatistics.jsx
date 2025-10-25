import { Card, Row, Col, DatePicker, Select, Table } from 'antd';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

const { RangePicker } = DatePicker;

function AdvancedStatistics() {
    // Dữ liệu mẫu cho biểu đồ doanh thu
    const revenueData = [
        { month: 'Jan', revenue: 4000 },
        { month: 'Feb', revenue: 3000 },
        { month: 'Mar', revenue: 2000 },
        { month: 'Apr', revenue: 2780 },
        { month: 'May', revenue: 1890 },
        { month: 'Jun', revenue: 2390 },
    ];

    // Dữ liệu mẫu cho biểu đồ học viên
    const studentData = [
        { month: 'Jan', students: 120 },
        { month: 'Feb', students: 150 },
        { month: 'Mar', students: 180 },
        { month: 'Apr', students: 220 },
        { month: 'May', students: 250 },
        { month: 'Jun', students: 280 },
    ];

    // Dữ liệu mẫu cho biểu đồ phân bố khóa học
    const courseDistributionData = [
        { name: 'Frontend', value: 400 },
        { name: 'Backend', value: 300 },
        { name: 'Mobile', value: 200 },
        { name: 'DevOps', value: 100 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    // Dữ liệu mẫu cho bảng khóa học phổ biến
    const popularCoursesColumns = [
        {
            title: 'Khóa học',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Học viên',
            dataIndex: 'students',
            key: 'students',
            sorter: (a, b) => a.students - b.students,
        },
        {
            title: 'Doanh thu',
            dataIndex: 'revenue',
            key: 'revenue',
            sorter: (a, b) => a.revenue - b.revenue,
        },
        {
            title: 'Đánh giá TB',
            dataIndex: 'rating',
            key: 'rating',
            sorter: (a, b) => a.rating - b.rating,
        },
    ];

    const popularCoursesData = [
        {
            key: '1',
            name: 'React Complete Guide',
            students: 1200,
            revenue: 150000000,
            rating: 4.8,
        },
        {
            key: '2',
            name: 'Node.js Advanced',
            students: 800,
            revenue: 100000000,
            rating: 4.7,
        },
        // Thêm dữ liệu mẫu khác
    ];

    return (
        <div>
            <h2>Thống kê nâng cao</h2>

            <div style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                    <Col>
                        <RangePicker />
                    </Col>
                    <Col>
                        <Select
                            defaultValue="all"
                            style={{ width: 120 }}
                            options={[
                                { value: 'all', label: 'Tất cả' },
                                { value: 'frontend', label: 'Frontend' },
                                { value: 'backend', label: 'Backend' },
                                { value: 'mobile', label: 'Mobile' },
                            ]}
                        />
                    </Col>
                </Row>
            </div>

            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Card title="Biểu đồ doanh thu">
                        <BarChart width={500} height={300} data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="revenue" fill="#8884d8" />
                        </BarChart>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Biểu đồ học viên mới">
                        <LineChart width={500} height={300} data={studentData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="students" stroke="#82ca9d" />
                        </LineChart>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col span={12}>
                    <Card title="Phân bố khóa học theo chủ đề">
                        <PieChart width={500} height={300}>
                            <Pie
                                data={courseDistributionData}
                                cx={250}
                                cy={150}
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {courseDistributionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Khóa học phổ biến">
                        <Table 
                            columns={popularCoursesColumns} 
                            dataSource={popularCoursesData} 
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default AdvancedStatistics;