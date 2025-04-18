import { useSelector } from "react-redux";

function useCurrentUser() {
    const user = useSelector((state) => state.auth.currentUser);
    const err = useSelector((state) => state.auth.error);

    const token = localStorage.getItem("token");

    if (!token) return { user: null, err: null };

    return { user, err };
}

export default useCurrentUser;
