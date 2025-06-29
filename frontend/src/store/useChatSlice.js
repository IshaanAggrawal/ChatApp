    import { createSlice } from '@reduxjs/toolkit';

    const initialState = {
        messages: [],
        users: [],
        selectedUser: null,
        isUsersLoading: false,
        isMessagesLoading: false,
    };

    const chatSlice = createSlice({
        name: 'chat',
        initialState,
        reducers: {
            setMessages: (state, action) => {
                state.messages = action.payload;
            },
            setUsers: (state, action) => {
                state.users = action.payload;
            },
            setSelectedUser: (state, action) => {
                state.selectedUser = action.payload;
            },
            setIsUsersLoading: (state, action) => {
                state.isUsersLoading = action.payload;
            },
            setIsMessagesLoading: (state, action) => {
                state.isMessagesLoading = action.payload;
            },
        },
    });

    export const {
        setMessages,
        setUsers,
        setSelectedUser,
        setIsUsersLoading,
        setIsMessagesLoading,
    } = chatSlice.actions;

    export default chatSlice.reducer;
