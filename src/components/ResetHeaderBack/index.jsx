import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setHeaderBack, setSlideBack } from "@/features/auth/headerSlice";

function ResetHeaderBack() {
    const location = useLocation();
    const navigationType = useNavigationType();
    const dispatch = useDispatch();

    useEffect(() => {
        if (navigationType === "POP") {
            dispatch(setHeaderBack(false));
            dispatch(setSlideBack(false));
        }

        if (location.pathname === "/") {
            dispatch(setHeaderBack(false));
            dispatch(setSlideBack(false));
        }
    }, [location, navigationType, dispatch]);
    return null;
}

export default ResetHeaderBack;
