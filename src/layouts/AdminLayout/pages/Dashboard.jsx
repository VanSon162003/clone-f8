import { Card, Row, Col, Statistic, Spin } from "antd";
import {
    UserOutlined,
    BookOutlined,
    FileTextOutlined,
    DollarOutlined,
} from "@ant-design/icons";
import { Area } from "@ant-design/plots";
import { useGetDashboardStatsQuery } from "@/services/admin/dashboardService";
import numeral from "numeral";

function Dashboard() {
    const { data, isLoading } = useGetDashboardStatsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    const chartData =
        data?.data?.monthly_revenue?.map((item) => ({
            name: `Tháng ${item.month}`,
            revenue: item.revenue,
        })) || [];

    if (isLoading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            <h2>Tổng quan</h2>
            <Row gutter={16}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Tổng số người dùng"
                            value={data?.data?.stats?.total_users || 0}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Tổng số khóa học"
                            value={data?.data?.stats?.total_courses || 0}
                            prefix={<BookOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Tổng số bài viết"
                            value={data?.data?.stats?.total_posts || 0}
                            prefix={<FileTextOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Tổng doanh thu"
                            value={
                                data?.data?.monthly_revenue?.reduce(
                                    (acc, item) => acc + item.revenue,
                                    0
                                ) || 0
                            }
                            prefix={<DollarOutlined />}
                            formatter={(value) => numeral(value).format("0,0")}
                            suffix="đ"
                        />
                    </Card>
                </Col>
            </Row>

            <div style={{ marginTop: 32 }}>
                <Card title="Biểu đồ doanh thu theo tháng">
                    <Area
                        data={chartData}
                        xField="name"
                        yField="revenue"
                        meta={{
                            revenue: {
                                formatter: (value) =>
                                    `${numeral(value).format("0,0")}đ`,
                            },
                        }}
                        tooltip={{
                            formatter: (data) => {
                                return {
                                    name: "Doanh thu",
                                    value:
                                        numeral(data.revenue).format("0,0") +
                                        "đ",
                                };
                            },
                        }}
                    />
                </Card>
            </div>
        </div>
    );
}

export default Dashboard;
