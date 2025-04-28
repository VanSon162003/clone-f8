import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    back: false,
    slideBack: false,
};

export const headerSlice = createSlice({
    name: "header",
    initialState,
    reducers: {
        setHeaderBack(state, action) {
            state.back = action.payload;
        },
        setSlideBack(state, action) {
            state.slideBack = action.payload;
        },
    },
});

export const { setHeaderBack, setSlideBack } = headerSlice.actions;

export default headerSlice.reducer;
