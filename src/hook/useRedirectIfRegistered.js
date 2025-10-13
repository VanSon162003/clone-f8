import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export function useRedirectIfRegistered(course) {
    const currentUser = useSelector((state) => state.auth.currentUser);
    const [isRegister, setIsRegister] = useState(false);

    useEffect(() => {
        if (course && currentUser) {
            const check = course.users?.some(
                (user) => user.id === currentUser.id
            );
            setIsRegister(check);
        }
    }, [course, currentUser]);

    return isRegister;
}
