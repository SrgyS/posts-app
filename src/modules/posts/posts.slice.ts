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
        //   toggleFavorites: (state, action: PayloadAction<number[]>) => {
        //     return action.payload.reduce((acc, id) => {
        //       if (acc.includes(id)) {
        //         return acc.filter(favId => favId !== id);
        //       } else {
        //         return [...acc, id];
        //       }
        //     }, state);
        //   },
    },
});

export default favoritesSlice.reducer;
export const { addToFavorites, removeFromFavorites } = favoritesSlice.actions;
