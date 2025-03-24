import config from "@/config";
import useQuery from "@/hook/useQuery";
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

        fetch("https://api01.f8team.dev/api/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Token không hợp lệ");
                return res.json();
            })
            .then((data) => {
                setUser(data.user);
            })
            .catch(() => {
                localStorage.removeItem("token");
                setUser(null);
            });
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
