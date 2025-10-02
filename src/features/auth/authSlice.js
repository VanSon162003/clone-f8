import authService from "@/services/authService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
    authRespone: null,
};

export const getCurrentUser = createAsyncThunk("auth/get-user", async () => {
    const res = await authService.getCurrentUser();

    return res.data;
});

export const logoutCurrentUser = createAsyncThunk(
    "auth/logout-user",
    async () => {
        const res = await authService.logoutUser();

        return res.data;
    }
);

export const accessUser = createAsyncThunk(
    "auth/access-user",
    async ({ data, type }, thunkAPI) => {
        try {
            let res;

            if (type === "register") {
                res = await authService.register(data);
            } else if (type === "login") {
                res = await authService.login(data);
            } else {
                throw new Error(
                    "Invalid action type. Use 'register' or 'login'."
                );
            }

            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthErr(state, action) {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // get user
            .addCase(getCurrentUser.pending, (state) => {
                state.loading = false;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.currentUser = action.payload;
                state.loading = false;
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.currentUser = null;
                state.error = action.payload;
                state.loading = false;
                state.authRespone = null;
            })

            // accessUser (login/register)
            .addCase(accessUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(accessUser.fulfilled, (state, action) => {
                state.authRespone = action.payload;
                state.currentUser = action.payload.user || null;
                state.loading = false;
            })
            .addCase(accessUser.rejected, (state, action) => {
                state.authRespone = null;
                state.error = action.payload;
                state.loading = false;
            })

            // logout user
            .addCase(logoutCurrentUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutCurrentUser.fulfilled, (state) => {
                state.currentUser = null;
                state.authRespone = null;
                state.error = null;

                state.loading = false;
            })
            .addCase(logoutCurrentUser.rejected, (state, action) => {
                state.error = action.payload;

                state.currentUser = null;
                state.authRespone = null;
                state.loading = false;
            });
    },
});

export const { setAuthErr } = authSlice.actions;

export default authSlice.reducer;
