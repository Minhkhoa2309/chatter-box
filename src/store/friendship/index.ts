// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'


// ** Fetch Users Friendships by Id
export const fetchFriend = createAsyncThunk('appUsers/fetchData', async (userId: number) => {
    const response = await axios.get('/api/friend/getFriends', {
        params: { userId }
    })

    return response.data
})

// ** Add Friendships **
export const addFriend = createAsyncThunk('friendship/addFriend', async (data: { userId: number, friendId: number }) => {
    const response = await axios.post('/api/friend/addFriend', {
        userId: data.userId,
        friendId: data.friendId
    })

    return response.data
})

export const friendshipSlice = createSlice({
    name: 'friendship',
    initialState: {
        data: [],
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchFriend.fulfilled, (state, action) => {
            state.data = action.payload.friends
        })
    }
})

export default friendshipSlice.reducer
