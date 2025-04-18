import { SET_AUTH_ERR, SET_AUTH_LOADING, SET_CURRENT_USER } from "./constants";

const initState = {
    currentUser: null,
    error: null,
    loading: false,
};

function reducer(state = initState, action) {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                currentUser: action.payload,
            };
        case SET_AUTH_ERR:
            return {
                ...state,
                error: action.payload,
            };
        case SET_AUTH_LOADING:
            return {
                ...state,
                loading: action.payload,
            };

        default:
            return state;
    }
}

export default reducer;
