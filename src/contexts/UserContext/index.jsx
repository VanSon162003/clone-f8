import authService from "@/services/authService";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [err, setErr] = useState({});

    const [isLoading, setIsloading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                setIsloading(true);
                const res = await authService.getCurrentUser();

                setUser(res.data);
            } catch (error) {
                setErr(error);
            } finally {
                setIsloading(false);
            }
        })();
    }, []);

    const values = {
        user,
        isLoading,
        err,
    };

    return (
        <UserContext.Provider value={values}>{children}</UserContext.Provider>
    );
}

export default UserProvider;
