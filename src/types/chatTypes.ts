// ** Types
import { Dispatch } from 'redux'

export type StatusType = 'busy' | 'away' | 'online' | 'offline'

export const statusObj = {
  busy: 'error',
  away: 'warning',
  online: 'success',
  offline: 'secondary'
}



export type MsgFeedbackType = {
  isSent: boolean
  isSeen: boolean
  isDelivered: boolean
}

export type ChatType = {
  message: string
  senderId: number
  time: Date | string
  feedback: MsgFeedbackType
}

export type ChatsObj = {
  id: number
  userId: number
  chat: ChatType[]
  unseenMsgs: number
  lastMessage?: ChatType
}

export type ContactType = {
  id: number
  avatar?: string
  name: string
  status: StatusType
}

export type ChatsArrType = {
  id: number
  chat: ChatsObj
  avatar?: string
  name: string
  status: StatusType
}

export type SelectedChatType = null | {
  chat: ChatsObj
  contact: ChatsArrType
}

export type ChatStoreType = {
  chats: ChatsArrType[] | null
  contacts: ContactType[] | null
  selectedChat: SelectedChatType
}

export type SendMsgParamsType = {
  chat?: ChatsObj
  message: string
  contact?: ChatsArrType
}

export type ChatContentType = {
  store: ChatStoreType
  sidebarWidth: number
  dispatch: Dispatch<any>
}

export type ChatSidebarLeftType = {
  store: ChatStoreType
  sidebarWidth: number
  userStatus: StatusType
  dispatch: Dispatch<any>
  leftSidebarOpen: boolean
  removeSelectedChat: () => void
  handleLeftSidebarToggle: () => void
}

