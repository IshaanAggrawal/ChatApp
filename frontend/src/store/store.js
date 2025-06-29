    import { configureStore } from '@reduxjs/toolkit';
    import authReducer from './authSlice';
    import themeReducer from './themeSlice'
    import chatReducer from './useChatSlice'

    const store = configureStore({
    reducer: {
        auth: authReducer,
        theme: themeReducer,
        chat:chatReducer
    },
    });

    export default store;
