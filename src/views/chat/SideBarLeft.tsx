'use client'
import React, { ChangeEvent, useEffect, useState, } from 'react'

// ** MUI Components
import { IconButton, Avatar, Badge, Box, Drawer, InputAdornment, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, TextField, Typography } from '@mui/material'
import MuiAvatar from '@mui/material/Avatar'
import Icon from '@/src/components/icon'

// ** Types
import { ChatSidebarLeftType, ChatsArrType, FriendType } from '@/src/types/chatTypes'
import { useAuth } from '@/src/hooks/useAuth'
import { getInitials } from '@/lib/utils'
import { selectChat } from '@/src/store/chat'
import AddChatDialog from './AddChatDialog'
import UserProfileBar from './UserProfileBar'


const SideBarLeft = (props: ChatSidebarLeftType) => {
  // ** Props
  const {
    store,
    dispatch,
    sidebarWidth,
    removeSelectedChat
  } = props

  // ** States
  const [query, setQuery] = useState<string>('')
  const [filteredChat, setFilteredChat] = useState<ChatsArrType[]>([])
  const [filteredFriends, setFilteredFriends] = useState<FriendType[]>([])
  const [addChatDialog, setAddChatDialog] = useState<boolean>(false)
  const [userProfileBarOpen, setUserProfileBarOpen] = useState<boolean>(false)
  const [active, setActive] = useState<null | { type: string; id: string | number }>(null)

  // ** Hooks
  const auth = useAuth()

  const handleAddChatDialogToogle = () => setAddChatDialog(!addChatDialog)
  const handleUserProfileBarToggle = () => setUserProfileBarOpen(!userProfileBarOpen)

  useEffect(() => {

    return () => {
      setActive(null)
      dispatch(removeSelectedChat())
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChatClick = (type: 'chat' | 'friend', id: number) => {
    auth.user?.id && dispatch(selectChat({ id, userId: auth.user?.id }))
    setActive({ type, id })
  }

  useEffect(() => {
    if (store && store.chats) {
      if (active !== null) {
        if (active.type === 'Friend' && active.id === store.chats[0].id) {
          setActive({ type: 'chat', id: active.id })
        }
      }
    }
  }, [store, active])


  const hasActiveId = (id: number | string) => {
    if (store.chats !== null) {
      const arr = store.chats.filter(i => i.id === id)

      return !!arr.length
    }
  }

  const handleFilter = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    if (store.chats !== null && store.friends !== null) {
      const searchFilterFunction = (friend: ChatsArrType | FriendType) =>
        friend.name.toLowerCase().includes(e.target.value.toLowerCase())
      const filteredChatsArr = store.chats.filter(searchFilterFunction)
      const filteredFriendsArr = store.friends.filter(searchFilterFunction)
      setFilteredChat(filteredChatsArr)
      setFilteredFriends(filteredFriendsArr)
    }
  }

  const renderChats = () => {
    if (store && store.chats && store.chats.length) {
      if (query.length && !filteredChat.length) {
        return (
          <ListItem>
            <Typography sx={{ color: 'text.secondary' }}>No Chats Found</Typography>
          </ListItem>
        )
      } else {
        const arrToMap = query.length && filteredChat.length ? filteredChat : store.chats

        return arrToMap.map((chat: ChatsArrType, index: number) => {

          return (
            <ListItem key={index} disablePadding sx={{ '&:not(:last-child)': { mb: 1.5 } }}>
              <ListItemButton
                disableRipple
                onClick={() => handleChatClick('chat', chat.id)}
                sx={{
                  px: 2.5,
                  py: 2.5,
                  width: '100%',
                  borderRadius: 1,
                  alignItems: 'flex-start'
                }}
              >
                <ListItemAvatar sx={{ m: 0 }}>
                  <Badge
                  >
                    {chat.avatar ? (
                      <MuiAvatar
                        src={chat.avatar}
                        alt={chat.name}
                        sx={{
                          width: 40,
                          height: 40,
                          outline: 'transparent'
                        }}
                      />
                    ) : (
                      <Avatar>
                        {getInitials(chat.name)}
                      </Avatar>
                    )}
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  sx={{
                    my: 0,
                    ml: 4,
                    mr: 1.5,
                  }}
                  primary={
                    <Typography noWrap sx={{ color: 'text.secondary' }}>
                      {chat.name}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          )
        })
      }
    }
  }

  const renderFriends = () => {
    if (store && store.friends && store.friends.length) {
      if (query.length && !filteredFriends.length) {
        return (
          <ListItem>
            <Typography sx={{ color: 'text.secondary' }}>No Friends Found</Typography>
          </ListItem>
        )
      } else {
        const arrToMap = query.length && filteredFriends.length ? filteredFriends : store.friends

        return arrToMap !== null
          ? arrToMap.map((friend: FriendType, index: number) => {
            const activeCondition =
              active !== null && active.id === friend.id && active.type === 'friend' && !hasActiveId(friend.id)

            return (
              <ListItem key={index} disablePadding sx={{ '&:not(:last-child)': { mb: 1.5 } }}>
                <ListItemButton
                  disableRipple
                  onClick={() => handleChatClick(hasActiveId(friend.id) ? 'chat' : 'friend', friend.id)}
                  sx={{
                    px: 2.5,
                    py: 2.5,
                    width: '100%',
                    borderRadius: 1,
                    ...(activeCondition && { backgroundColor: theme => `${theme.palette.primary.main} !important` })
                  }}
                >
                  <ListItemAvatar sx={{ m: 0 }}>
                    {friend.avatar ? (
                      <MuiAvatar
                        alt={friend.name}
                        src={friend.avatar}
                        sx={{
                          width: 40,
                          height: 40,
                          outline: theme =>
                            `2px solid ${activeCondition ? theme.palette.common.white : 'transparent'}`
                        }}
                      />
                    ) : (
                      <Avatar>
                        {getInitials(friend.name)}
                      </Avatar>
                    )}
                  </ListItemAvatar>
                  <ListItemText
                    sx={{
                      my: 0,
                      ml: 4,
                      ...(activeCondition && { '& .MuiTypography-root': { color: 'common.white' } })
                    }}
                    primary={
                      <Typography sx={{ ...(!activeCondition ? { color: 'text.secondary' } : {}) }}>
                        {friend.name}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            )
          })
          : null
      }
    }
  }

  return (
    <div>
      <Drawer
        variant={'permanent'}
        ModalProps={{
          disablePortal: true,
          keepMounted: true // Better open performance on mobile.
        }}
        sx={{
          zIndex: 7,
          height: '100%',
          display: 'block',
          position: 'static',
          '& .MuiDrawer-paper': {
            boxShadow: 'none',
            overflow: 'hidden',
            width: sidebarWidth,
            position: 'static',
            borderTopLeftRadius: theme => theme.shape.borderRadius,
            borderBottomLeftRadius: theme => theme.shape.borderRadius
          },
          '& > .MuiBackdrop-root': {
            borderRadius: 1,
            position: 'absolute',
            zIndex: theme => theme.zIndex.drawer - 1
          }
        }}
      >
        <Box
          sx={{
            px: 5.5,
            py: 3.5,
            display: 'flex',
            alignItems: 'center',
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          {auth.user ? (
            <Badge
              overlap='circular'
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              sx={{ mr: 4.5 }}
              onClick={handleUserProfileBarToggle}
            >
              <MuiAvatar
                src={auth.user.avatar}
                alt={auth.user.name}
                sx={{ width: 40, height: 40, cursor: 'pointer' }}
              />
            </Badge>
          ) : null}
          <TextField
            fullWidth
            size='small'
            value={query}
            onChange={handleFilter}
            placeholder='Search friend...'
            sx={{ '& .MuiInputBase-root': { borderRadius: 5 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Icon icon='mdi:magnify' fontSize='1.25rem' />
                </InputAdornment>
              )
            }}
          />
          <IconButton onClick={handleAddChatDialogToogle}>
            <Icon icon='material-symbols:group-add' fontSize='1.25rem' />
          </IconButton>
        </Box>
        <Box sx={{ height: `calc(100% - 4.125rem)` }}>
          <Box sx={{ height: '100%', overflow: 'auto' }}>
            <Box sx={{ p: theme => theme.spacing(5, 3, 3) }}>
              <Typography variant='h6' sx={{ ml: 2, mb: 4, color: 'primary.main' }}>
                Chats
              </Typography>
              <List sx={{ mb: 7.5, p: 0 }}>{renderChats()}</List>
              <Typography variant='h6' sx={{ ml: 2, mb: 4, color: 'primary.main' }}>
                Friends
              </Typography>
              <List sx={{ p: 0 }}>{renderFriends()}</List>
            </Box>
          </Box>
        </Box>
        <AddChatDialog open={addChatDialog} toggle={handleAddChatDialogToogle} />
        <UserProfileBar
          sidebarWidth={sidebarWidth}
          userProfileBarOpen={userProfileBarOpen}
          handleUserProfileBarToggle={handleUserProfileBarToggle}
        />
      </Drawer>
    </div>
  )
}

export default SideBarLeft