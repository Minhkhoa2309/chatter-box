// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'

// ** Icon Imports
import Icon from '@/src/components/icon'

// ** Custom Component Imports
import Sidebar from '@/src/components/sidebar'

// ** Hooks 
import { useAuth } from '@/src/hooks/useAuth'

// ** Types
import { UserProfileBarType } from '@/src/types/chatTypes'
import AddFriendDialog from './AddFriendDialog'

const UserProfileBar = (props: UserProfileBarType) => {
  const {
    sidebarWidth,
    userProfileBarOpen,
    handleUserProfileBarToggle
  } = props

  const auth = useAuth();
  
  const [addFriendDialog, setAddFriendDialog] = useState<boolean>(false)

  
  const handleAddFriendDialogToogle = () => setAddFriendDialog(!addFriendDialog)

  return (
    <Sidebar
      show={userProfileBarOpen}
      backDropClick={handleUserProfileBarToggle}
      sx={{
        zIndex: 9,
        height: '100%',
        width: sidebarWidth,
        borderTopLeftRadius: theme => theme.shape.borderRadius,
        borderBottomLeftRadius: theme => theme.shape.borderRadius,
        '& + .MuiBackdrop-root': {
          zIndex: 8,
          borderRadius: 1
        }
      }}
    >
      {auth.user ? (
        <Fragment>
          <IconButton
            size='small'
            onClick={handleUserProfileBarToggle}
            sx={{ top: '.7rem', right: '.7rem', position: 'absolute' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>

          <Box sx={{ px: 5, pb: 7, pt: 9.5, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 4.25, display: 'flex', justifyContent: 'center' }}>
              <Badge
                overlap='circular'
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
              >
                <Avatar
                  sx={{ width: 84, height: 84 }}
                  src={auth.user.avatar}
                  alt={auth.user.name}
                />
              </Badge>
            </Box>
            <Typography sx={{ mb: 0.75, fontWeight: 600, textAlign: 'center' }}>
              {auth.user.name}
            </Typography>
          </Box>

          <Box sx={{ height: 'calc(100% - 13.375rem)' }}>
            <Box sx={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
              <Box sx={{ p: 5 }}>
                <List dense sx={{ p: 0, mb: 6 }}>
                  <ListItem disablePadding>
                    <ListItemButton sx={{ px: 2 }} onClick={handleAddFriendDialogToogle}>
                      <ListItemIcon sx={{ mr: 2 }}>
                        <Icon icon='mdi:account-outline' fontSize='1.25rem' />
                      </ListItemIcon>
                      <ListItemText secondary='Add Friends' />
                    </ListItemButton>
                  </ListItem>
                </List>
                <Button variant='contained' onClick={() => auth.logout()}>Logout</Button>
              </Box>
            </Box>
          </Box>
        </Fragment>
      ) : null}
      <AddFriendDialog open={addFriendDialog} toggle={handleAddFriendDialogToogle} />
    </Sidebar>
  )
}

export default UserProfileBar
