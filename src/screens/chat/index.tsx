'use client'
import React from 'react'
import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import SideBarLeft from '@/src/views/chat/SideBarLeft'
import ChatContent from '@/src/views/chat/ChatContent'

const ChatScreen = () => {
    const theme = useTheme();

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
                border: `1px solid ${theme.palette.divider}`
            }}
        >
            <SideBarLeft />
            <ChatContent />
        </Box>
    )
}

export default ChatScreen