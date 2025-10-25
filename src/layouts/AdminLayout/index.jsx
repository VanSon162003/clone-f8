import { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, Link } from 'react-router-dom';
import {
    DashboardOutlined,
    UserOutlined,
    BookOutlined,
    FileTextOutlined,
    CommentOutlined,
    TagOutlined,
    TeamOutlined,
    SettingOutlined,
    BarChartOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: <Link to="/admin">Dashboard</Link>,
        },
        {
            key: 'users',
            icon: <UserOutlined />,
            label: <Link to="/admin/users">Quản lý người dùng</Link>,
        },
        {
            key: 'courses',
            icon: <BookOutlined />,
            label: <Link to="/admin/courses">Quản lý khóa học</Link>,
        },
        {
            key: 'posts',
            icon: <FileTextOutlined />,
            label: <Link to="/admin/posts">Quản lý bài viết</Link>,
        },
        {
            key: 'comments',
            icon: <CommentOutlined />,
            label: <Link to="/admin/comments">Quản lý bình luận</Link>,
        },
        {
            key: 'topics',
            icon: <TagOutlined />,
            label: <Link to="/admin/topics">Quản lý chủ đề</Link>,
        },
        {
            key: 'instructors',
            icon: <TeamOutlined />,
            label: <Link to="/admin/instructors">Quản lý giảng viên</Link>,
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: <Link to="/admin/settings">Cấu hình hệ thống</Link>,
        },
        {
            key: 'statistics',
            icon: <BarChartOutlined />,
            label: <Link to="/admin/statistics">Thống kê nâng cao</Link>,
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
                <Menu
                    theme="dark"
                    defaultSelectedKeys={['dashboard']}
                    mode="inline"
                    items={menuItems}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: '#fff' }} />
                <Content style={{ margin: '16px' }}>
                    <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}

export default AdminLayout;