import config from "@/config";
import useQuery from "@/hook/useQuery";
import authService from "@/services/authService";
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
    const [user, setUser] = useState(undefined);
    const token = localStorage.getItem("token");
    const { path } = useQuery();

    useEffect(() => {
        if (!token) {
            setUser(null);
            return;
        }

        (async () => {
            try {
                const data = await authService.getCurrentUser();
                setUser(data.user);
            } catch (error) {
                console.log(error);
            }
        })();
    }, [token]);

    if (user === undefined) {
        return <p>Đang kiểm tra quyền truy cập...</p>;
    }

    if (!user) {
        return <Navigate to={`${config.routes.login}?continue=${path}`} />;
    }

    return children;
}

export default ProtectedRoute;
