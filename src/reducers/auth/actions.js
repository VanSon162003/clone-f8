import authService from "@/services/authService";
import { SET_AUTH_ERR, SET_AUTH_LOADING, SET_CURRENT_USER } from "./constants";

export const setCurrentUser = (payload) => ({
    type: SET_CURRENT_USER,
    payload,
});

export const setAuthErr = (payload) => ({
    type: SET_AUTH_ERR,
    payload,
});

export const setAuthLoading = (payload) => ({
    type: SET_AUTH_LOADING,
    payload,
});

export const getCurrentUser = () => {
    return (dispatch) => {
        (async () => {
            try {
                dispatch(setAuthLoading(true));

                const res = await authService.getCurrentUser();

                dispatch(setCurrentUser(res.data));
            } catch (error) {
                dispatch(setAuthErr(error));
            } finally {
                dispatch(setAuthLoading(false));
            }
        })();
    };
};
