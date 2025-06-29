    import { createSlice } from '@reduxjs/toolkit';

    const initialState = {
    themeSelected: 'light',
    };

    const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setThemeSelected: (state, action) => {
        state.themeSelected = action.payload;
        },
    },
    });

    export const { setThemeSelected } = themeSlice.actions;

    export default themeSlice.reducer;
