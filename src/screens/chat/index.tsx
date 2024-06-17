'use client'
import React, { useState } from 'react'

// ** MUI Components
import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import SideBarLeft from '@/src/views/chat/SideBarLeft'
import ChatContent from '@/src/views/chat/ChatContent'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/src/store'

// ** Type
import { StatusType } from '@/src/types/chatTypes'
import { removeSelectedChat } from '@/src/store/chat'

const ChatScreen = () => {
    // ** States
    const [userStatus, setUserStatus] = useState<StatusType>('online')
    const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
    // ** Hooks
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>()
    const store = useSelector((state: RootState) => state.chat)

    // ** Vars
    const sidebarWidth = 370

    const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)

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
                userStatus={userStatus}
                leftSidebarOpen={leftSidebarOpen}
                handleLeftSidebarToggle={handleLeftSidebarToggle}
                removeSelectedChat={removeSelectedChat}
            />
            <ChatContent
                store={store}
                dispatch={dispatch}
                sidebarWidth={sidebarWidth}
            />
        </Box>
    )
}

export default ChatScreen