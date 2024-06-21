'use client'
import React, { useEffect } from 'react'

// ** MUI Components
import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import SideBarLeft from '@/src/views/chat/SideBarLeft'
import ChatContent from '@/src/views/chat/ChatContent'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/src/store'
import { useAuth } from '@/src/hooks/useAuth'

// ** Type
import { fetchChatsAndFriend, removeSelectedChat } from '@/src/store/chat'

const ChatScreen = () => {
    // ** Hooks
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>()
    const store = useSelector((state: RootState) => state.chat)
    const auth = useAuth()

    // ** Vars
    const sidebarWidth = 370

    useEffect(() => {
        if (auth.user?.id) {
            dispatch(fetchChatsAndFriend(auth.user?.id))
        }
    }, [dispatch])

    return (
        <Box
            className='app-chat'
            sx={{
                width: '100%',
                display: 'flex',
                borderRadius: 1,
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: 'background.paper',
                boxShadow: 6,
                border: `1px solid ${theme.palette.divider}`,
                height: '100vh'
            }}
        >
            <SideBarLeft
                store={store}
                dispatch={dispatch}
                sidebarWidth={sidebarWidth}
                removeSelectedChat={removeSelectedChat}
            />
            <ChatContent
                store={store}
                dispatch={dispatch}
            />
        </Box>
    )
}

export default ChatScreen