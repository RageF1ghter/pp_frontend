import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import counterReducer from "./counterSlice"

const store = configureStore({
    reducer: {
        auth: authReducer,
        counter: counterReducer
    },
});

export default store;