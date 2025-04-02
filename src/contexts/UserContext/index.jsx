import authService from "@/services/authService";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsloading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                setIsloading(true);
                const res = await authService.getCurrentUser();
                setUser(res.user);
            } catch (error) {
                console.log(error);
            } finally {
                setIsloading(false);
            }
        })();
    }, []);

    const values = {
        user,
        isLoading,
    };

    return (
        <UserContext.Provider value={values}>{children}</UserContext.Provider>
    );
}

export default UserProvider;
