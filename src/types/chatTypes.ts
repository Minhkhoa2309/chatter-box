// ** Types
import { Dispatch } from 'redux'

export type ChatType = {
  message: string
  senderId: number
  time: Date | string
}

export type ChatsObj = {
  id: number
  userId: number
  messages: ChatType[]
  lastMessage?: ChatType
}

export type FriendType = {
  id: number
  avatar?: string
  name: string
}

export type ChatsArrType = {
  id: number
  chat: ChatsObj
  avatar?: string
  name: string
}

export type SelectedChatType = null | {
  chat: ChatsObj
  friend: ChatsArrType
}

export type ChatStoreType = {
  chats: ChatsArrType[] | null
  friends: FriendType[] | null
  selectedChat: SelectedChatType
}

export type SendMsgParamsType = {
  chatId: number
  message: string
  senderId: number
}

export type ChatContentType = {
  store: ChatStoreType
  sidebarWidth: number
  dispatch: Dispatch<any>
}

export type ChatSidebarLeftType = {
  store: ChatStoreType
  sidebarWidth: number
  dispatch: Dispatch<any>
  removeSelectedChat: () => void
}

export type UserProfileBarType = {
  sidebarWidth: number
  userProfileBarOpen: boolean
  handleUserProfileBarToggle: () => void
}

export type SendMsgComponentType = {
  store: ChatStoreType
  dispatch: Dispatch<any>
}

export type ChatLogType = {
  data: {
    chat: ChatsObj
    friend: FriendType
  }
}

export type MessageType = {
  time: string | Date
  message: string
  senderId: number
}

export type ChatLogChatType = {
  msg: string
  time: string | Date
}

export type FormattedChatsType = {
  senderId: number
  messages: ChatLogChatType[]
}

export type MessageGroupType = {
  senderId: number
  messages: ChatLogChatType[]
}
