// ** React Imports
import { useRef, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'


// ** Types Imports
import {
    ChatLogType,
    MessageType,
    ChatLogChatType,
    MessageGroupType,
    FormattedChatsType
} from '@/src/types/chatTypes'
import { useAuth } from '@/src/hooks/useAuth'
import { getInitials } from '@/lib/utils'
import { Avatar } from '@mui/material'

const ChatLog = (props: ChatLogType) => {
    // ** Props
    const { data } = props

    // ** Ref
    const chatArea = useRef(null)

    // ** Hooks
    const auth = useAuth()

    // ** Scroll to chat bottom
    const scrollToBottom = () => {
        if (chatArea.current) {
            // @ts-ignore
            chatArea.current.scrollTop = chatArea.current.scrollHeight
        }
    }

    // ** Formats chat data based on sender
    const formattedChatData = () => {
        let chatLog: MessageType[] | [] = []
        if (data.chat) {
            chatLog = data.chat.messages
        }

        const formattedChatLog: FormattedChatsType[] = []
        let chatMessageSenderId = chatLog[0] ? chatLog[0].senderId : 11
        let msgGroup: MessageGroupType = {
            senderId: chatMessageSenderId,
            messages: []
        }
        chatLog.forEach((msg: MessageType, index: number) => {
            if (chatMessageSenderId === msg.senderId) {
                msgGroup.messages.push({
                    time: msg.time,
                    msg: msg.message
                })
            } else {
                chatMessageSenderId = msg.senderId

                formattedChatLog.push(msgGroup)
                msgGroup = {
                    senderId: msg.senderId,
                    messages: [
                        {
                            time: msg.time,
                            msg: msg.message
                        }
                    ]
                }
            }

            if (index === chatLog.length - 1) formattedChatLog.push(msgGroup)
        })

        return formattedChatLog
    }


    useEffect(() => {
        if (data && data.chat && data.chat.messages.length) {
            scrollToBottom()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    // ** Renders user chat
    const renderChats = () => {
        return formattedChatData().map((item: FormattedChatsType, index: number) => {
            const isSender = item.senderId === auth.user?.id;
            let senderInfo = data.chat.users.find(user => user.userId === item.senderId)?.user

            return (
                <Box
                    key={index}
                    sx={{
                        display: 'flex',
                        flexDirection: !isSender ? 'row' : 'row-reverse',
                        mb: index !== formattedChatData().length - 1 ? 9.75 : undefined
                    }}
                >
                    <div>
                        <Avatar
                            sx={{
                                width: '2rem',
                                height: '2rem',
                                fontSize: '0.875rem',
                                ml: isSender ? 4 : undefined,
                                mr: !isSender ? 4 : undefined
                            }}
                            {...(senderInfo && senderInfo.avatar
                                ? {
                                    src: senderInfo.avatar,
                                    alt: senderInfo.name
                                }
                                : {})}
                    
                        >
                            {getInitials(data.friend.name)}
                        </Avatar>
                    </div>

                    <Box className='chat-body' sx={{ maxWidth: ['calc(100% - 5.75rem)', '75%', '65%'] }}>
                        {item.messages.map((chat: ChatLogChatType, index: number, { length }: { length: number }) => {
                            const time = new Date(chat.time)

                            return (
                                <Box key={index} sx={{ '&:not(:last-of-type)': { mb: 3.5 } }}>
                                    <div>
                                        <Typography
                                            sx={{
                                                boxShadow: 1,
                                                borderRadius: 1,
                                                maxWidth: '100%',
                                                width: 'fit-content',
                                                fontSize: '0.875rem',
                                                wordWrap: 'break-word',
                                                p: theme => theme.spacing(3, 4),
                                                ml: isSender ? 'auto' : undefined,
                                                borderTopLeftRadius: !isSender ? 0 : undefined,
                                                borderTopRightRadius: isSender ? 0 : undefined,
                                                color: isSender ? 'common.white' : 'text.primary',
                                                backgroundColor: isSender ? 'primary.main' : 'background.paper'
                                            }}
                                        >
                                            {chat.msg}
                                        </Typography>
                                    </div>
                                    {index + 1 === length ? (
                                        <Box
                                            sx={{
                                                mt: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: isSender ? 'flex-end' : 'flex-start'
                                            }}
                                        >
                                            <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                                                {time
                                                    ? new Date(time).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, day: 'numeric', month: 'numeric', year: 'numeric' })
                                                    : null}
                                            </Typography>
                                        </Box>
                                    ) : null}
                                </Box>
                            )
                        })}
                    </Box>
                </Box>
            )
        })
    }

    return (
        <Box sx={{ height: 'calc(100% - 10rem)' }}>
            <Box ref={chatArea} sx={{ p: 5, height: '80%', overflowY: 'auto', overflowX: 'hidden' }}>
                {renderChats()}
            </Box>
        </Box>
    )
}

export default ChatLog
