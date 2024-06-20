// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

// ** Types
import { Dispatch } from 'redux'
import { SendMsgParamsType } from '@/src/types/chatTypes'

// ** Fetch Chats & Contacts
export const fetchChatsAndFriend = createAsyncThunk('appChat/fetchChatsAndFriend', async (userId: number) => {
  const response = await axios.get('/api/chat/getChatsAndFriendship', {
    params: {
      userId
    }
  })

  return response.data
})

// ** Select Chat
export const selectChat = createAsyncThunk(
  'appChat/selectChat',
  async ({ id, userId }: { id: number, userId: number }, { dispatch }: { dispatch: Dispatch<any> }) => {
    const response = await axios.get('/api/chat/getSingleChat', {
      params: {
        id,
        userId
      }
    })
    await dispatch(fetchChatsAndFriend(userId))

    return response.data
  }
)

// ** Send Msg
export const sendMsg = createAsyncThunk('appChat/sendMessage', async (obj: SendMsgParamsType, { dispatch }) => {
  const response = await axios.post('/api/chat/sendMessage', {
    data: {
      chatId: obj.chatId,
      senderId: obj.senderId,
      message: obj.message
    }
  })
  await dispatch(selectChat({ id: obj.chatId, userId: obj.senderId }))
  await dispatch(fetchChatsAndFriend(obj.senderId))

  return response.data
})

// ** Add Friendships **
export const addChat = createAsyncThunk('appChat/addChat', async (data: { userIds: number[], isGroupChat: boolean, name: string }) => {
  const response = await axios.post('/api/chat/addChat', {
    userIds: data.userIds,
    isGroupChat: data.isGroupChat,
    name: data.name
  })

  return response.data
})

export const appChatSlice = createSlice({
  name: 'appChat',
  initialState: {
    chats: null,
    friends: null,
    selectedChat: null
  },
  reducers: {
    removeSelectedChat: state => {
      state.selectedChat = null
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchChatsAndFriend.fulfilled, (state, action) => {
      state.friends = action.payload.userFriends
      state.chats = action.payload.chats
    })
    builder.addCase(selectChat.fulfilled, (state, action) => {
      state.selectedChat = action.payload
    })
  }
})

export const { removeSelectedChat } = appChatSlice.actions

export default appChatSlice.reducer
