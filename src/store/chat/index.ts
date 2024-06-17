// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

// ** Fetch Chats & Contacts
export const fetchRoom = createAsyncThunk('appChat/fetchRoom', async () => {
  const response = await axios.get('/api/chat/rooms')

  return response.data
})

export const appChatSlice = createSlice({
  name: 'appChat',
  initialState: {
    chats: null,
    contacts: null,
    selectedChat: null
  },
  reducers: {
    removeSelectedChat: state => {
      state.selectedChat = null
    }
  }
})

export const { removeSelectedChat } = appChatSlice.actions

export default appChatSlice.reducer
