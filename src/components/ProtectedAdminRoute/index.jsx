import { Navigate, useLocation } from "react-router-dom";
import config from "@/config";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const instructorRoles = ["instructor", "intructor"];

const instructorAllowedPaths = [
    "/admin/courses",
    "/admin/tracks",
    "/admin/lessons",
    "/admin/exams",
];

const isInstructorAllowedPath = (pathname) => {
    if (pathname === "/admin") return false;

    return (
        instructorAllowedPaths.includes(pathname) ||
        /^\/admin\/exams\/submissions\/[^/]+\/grade$/.test(pathname)
    );
};

function ProtectedAdminRoute({ children }) {
    const location = useLocation();

    const currentUser = useSelector((state) => state.auth.currentUser);

    if (!currentUser) {
        return (
            <Navigate
                to={config.routes.adminLogin}
                state={{ from: location }}
                replace
            />
        );
    }

    if (currentUser) {
        const isInstructor = instructorRoles.includes(currentUser?.role);

        if (
            currentUser?.role !== "admin" &&
            !isInstructor
        ) {
            localStorage.removeItem("token");
            localStorage.removeItem("refresh_token");
            return (
                <Navigate
                    to={config.routes.adminLogin}
                    state={{ from: location }}
                    replace
                />
            );
        }

        if (isInstructor && !isInstructorAllowedPath(location.pathname)) {
            return <Navigate to={config.routes.adminCourses} replace />;
        }
    }

    return children;
}

ProtectedAdminRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedAdminRoute;
