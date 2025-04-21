import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "@/features/auth/authSlice";

function UserProvider() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCurrentUser());
    }, [dispatch]);

    return null;
}

export default UserProvider;
