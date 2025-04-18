import { ADD_PRODUCT } from "./constants";

export const addProduct = (payload) => ({
    type: ADD_PRODUCT,
    payload,
});
