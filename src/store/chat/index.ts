// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

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
