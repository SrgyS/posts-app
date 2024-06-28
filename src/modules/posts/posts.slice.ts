import { PayloadAction, createSlice } from '@reduxjs/toolkit/react';

export type Post = {
    author?: string;
    userId: number;
    id: number;
    title: string;
    body: string;
};

export const favoritesSlice = createSlice({
    name: 'favorites',
    initialState: [] as number[],
    reducers: {
        addToFavorites: (state, action: PayloadAction<number[]>) => {
            return [...new Set([...state, ...action.payload])];
        },
        removeFromFavorites: (state, action: PayloadAction<number[]>) => {
            return state.filter((id) => !action.payload.includes(id));
        },
    },
});

export default favoritesSlice.reducer;
export const { addToFavorites, removeFromFavorites } = favoritesSlice.actions;
