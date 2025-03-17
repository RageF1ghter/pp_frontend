import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
    name: 'counter',
    initialState: {
        count: 0,
    },
    reducers: {
        increment(state) {
            state.count += 1;
        },
        decrement(state) {
            if(state.count > 0) {
                state.count -= 1;
            }
            
        },
        changeByVal(state, action) {
            state.count += action.payload.value;
        },
        clear(state) {
            state.count = 0;
        },
    },
});

export const { increment, decrement, changeByVal, clear } = counterSlice.actions;
export default counterSlice.reducer;
