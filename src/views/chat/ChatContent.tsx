'use client'
import React, { Fragment } from 'react'
import { ChatContentType } from '@/src/types/chatTypes'
import MuiAvatar from '@mui/material/Avatar'
import { Avatar, Badge, Box, Typography, IconButton } from '@mui/material'
import Icon from '@/src/components/icon'
import { formatDateToMonthShort, getInitials } from '@/lib/utils'
import { useAuth } from '@/src/hooks/useAuth'
import ChatLog from './ChatLog'
import SendMsgForm from './SendMsgForm'

const ChatContent = (props: ChatContentType) => {
  // ** Props
  const {
    store,
    dispatch,
    sidebarWidth
  } = props

  // ** Hooks
  const auth = useAuth()


  const renderContent = () => {
    if (store) {
      const selectedChat = store.selectedChat


      if (!selectedChat) {
        return (
          <Box
            sx={{
              flexGrow: 1,
              height: '100%',
              display: 'flex',
              borderRadius: 1,
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
              backgroundColor: theme => theme.palette.action.hover,
              ...({ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 })
            }}
          >
            <MuiAvatar
              sx={{
                mb: 5,
                pt: 8,
                pb: 7,
                px: 7.5,
                width: 110,
                height: 110,
                boxShadow: 3,
                '& svg': { color: 'action.active' },
                backgroundColor: 'background.paper'
              }}
            >
              <Icon icon='mdi:message-outline' fontSize='3.125rem' />
            </MuiAvatar>
          </Box>
        )
      } else {
        
        return (
          <Box
            sx={{
              width: 0,
              flexGrow: 1,
              height: '100%',
              backgroundColor: 'action.hover'
            }}
          >
            <Box
              sx={{
                py: 3,
                px: 5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: theme => `1px solid ${theme.palette.divider}`
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                  <Badge
                    overlap='circular'
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right'
                    }}
                    sx={{ mr: 4.5 }}
                  >
                    {selectedChat.friend.avatar ? (
                      <MuiAvatar
                        src={selectedChat.friend.avatar}
                        alt={selectedChat.friend.name}
                        sx={{ width: 40, height: 40 }}
                      />
                    ) : (
                      <Avatar>
                        {getInitials(selectedChat.friend.name)}
                      </Avatar>
                    )}

                  </Badge>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ color: 'text.secondary' }}>{selectedChat.friend.name}</Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Fragment>
                  <IconButton size='small' sx={{ color: 'text.secondary' }}>
                    <Icon icon='mdi:phone-outline' />
                  </IconButton>
                  <IconButton size='small' sx={{ color: 'text.secondary' }}>
                    <Icon icon='mdi:video-outline' fontSize='1.5rem' />
                  </IconButton>
                  <IconButton size='small' sx={{ color: 'text.secondary' }}>
                    <Icon icon='mdi:magnify' />
                  </IconButton>
                </Fragment>
              </Box>
            </Box>

            {selectedChat && auth.user ? (
              <ChatLog data={{ ...selectedChat }} />
            ) : null}

            <SendMsgForm store={store} dispatch={dispatch} />
          </Box>
        )
      }
    } else {
      return null
    }
  }

  return renderContent()
}

export default ChatContent