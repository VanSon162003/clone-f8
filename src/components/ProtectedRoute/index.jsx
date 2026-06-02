import config from "@/config";
import authService from "@/services/authService";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
    const [user, setUser] = useState(undefined);
    const token = localStorage.getItem("token");
    const location = useLocation();
    const continuePath = `${location.pathname}${location.search}`;

    useEffect(() => {
        let isMounted = true;

        if (!token) {
            setUser(null);
            return;
        }

        (async () => {
            try {
                const data = await authService.getCurrentUser();
                const currentUser = data?.user || data?.data?.user || data?.data;
                if (isMounted) {
                    setUser(currentUser || null);
                }
            } catch (error) {
                console.log(error);
                if (isMounted) {
                    setUser(null);
                }
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [token]);

    if (user === undefined) {
        return <p>Đang kiểm tra quyền truy cập...</p>;
    }

    if (!user) {
        return (
            <Navigate
                to={`${config.routes.login}?continue=${encodeURIComponent(
                    continuePath
                )}`}
                replace
            />
        );
    }

    return children;
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
