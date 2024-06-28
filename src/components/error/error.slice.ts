import { PayloadAction, createSlice } from '@reduxjs/toolkit/react';

export type ErrorState = {
    message: string;
    status: number | string;
};

const initialState: ErrorState = {
    message: '',
    status: '',
};

export const errorSlice = createSlice({
    name: 'error',
    initialState,
    reducers: {
        setError(
            state,
            action: PayloadAction<{ message: string; status: number | string }>
        ) {
            state.message = action.payload.message;
            state.status = action.payload.status;
        },
        clearError(state) {
            state.message = '';
            state.status = '';
        },
    },
});

export const { setError, clearError } = errorSlice.actions;

export default errorSlice.reducer;
