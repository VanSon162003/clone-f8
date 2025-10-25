import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import {
    Dashboard,
    UsersManagement,
    CoursesManagement,
    PostsManagement,
    CommentsManagement,
    TopicsManagement,
    InstructorsManagement,
    SystemSettings,
    AdvancedStatistics,
} from "../layouts/AdminLayout/pages";
import ProtectedRoute from "../components/ProtectedRoute";

function AdminRoutes() {
    return (
        <Routes>
            <Route
                path="/admin"
                element={
                    <ProtectedRoute roles={["admin"]}>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Dashboard />} />
                <Route path="users" element={<UsersManagement />} />
                <Route path="courses" element={<CoursesManagement />} />
                <Route path="posts" element={<PostsManagement />} />
                <Route path="comments" element={<CommentsManagement />} />
                <Route path="topics" element={<TopicsManagement />} />
                <Route path="instructors" element={<InstructorsManagement />} />
                <Route path="settings" element={<SystemSettings />} />
                <Route path="statistics" element={<AdvancedStatistics />} />
            </Route>
        </Routes>
    );
}

export default AdminRoutes;
