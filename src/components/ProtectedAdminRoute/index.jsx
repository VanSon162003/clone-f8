import { Navigate, useLocation } from "react-router-dom";
import config from "@/config";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

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
        if (
            currentUser?.role !== "admin" &&
            currentUser?.role !== "instructor"
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
    }

    return children;
}

ProtectedAdminRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedAdminRoute;
