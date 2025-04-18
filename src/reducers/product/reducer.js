import { ADD_PRODUCT } from "./constants";

const initState = {
    list: [],
};

function reducer(state = initState, action) {
    switch (action.type) {
        case ADD_PRODUCT:
            return {
                ...state,
                list: [...state.list, action.payload],
            };
        default:
            return state;
    }
}

export default reducer;
