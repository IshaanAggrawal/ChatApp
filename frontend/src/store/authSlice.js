    import { createSlice } from '@reduxjs/toolkit';

    const initialState = {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,
    };

    const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthUser: (state, action) => {
        state.authUser = action.payload;
        },
        setIsSigningUp: (state, action) => {
        state.isSigningUp = action.payload;
        },
        setIsLoggingIn: (state, action) => {
        state.isLoggingIn = action.payload;
        },
        setIsUpdatingProfile: (state, action) => {
        state.isUpdatingProfile = action.payload;
        },
        setIsCheckingAuth: (state, action) => {
        state.isCheckingAuth = action.payload;
        },
        setOnlineUsers: (state, action) => {
        state.onlineUsers = action.payload;
        },
        setSocket: (state, action) => {
        state.socket = action.payload;
        },
        disconnectSocket: (state) => {
        if (state.socket?.connected) {
            state.socket.disconnect();
        }
        state.socket = null;
        },
    },
    });

    export const {setAuthUser,setIsSigningUp,setIsLoggingIn,setIsUpdatingProfile,setIsCheckingAuth,setOnlineUsers, setSocket, disconnectSocket,} = authSlice.actions;

    export default authSlice.reducer;
