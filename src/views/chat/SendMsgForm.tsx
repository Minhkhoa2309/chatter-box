// ** React Imports
import { useState, SyntheticEvent } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'

// ** Types
import { SendMsgComponentType } from '@/src/types/chatTypes'
import Icon from '@/src/components/icon'
import { useAuth } from '@/src/hooks/useAuth'
import { sendMsg } from '@/src/store/chat'

// ** Styled Components
const ChatFormWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    display: 'flex',
    borderRadius: 8,
    alignItems: 'center',
    boxShadow: theme.shadows[1],
    padding: theme.spacing(1.25, 4),
    justifyContent: 'space-between',
    backgroundColor: theme.palette.background.paper
}))

const Form = styled('form')(({ theme }) => ({
    padding: theme.spacing(0, 5, 5)
}))

const SendMsgForm = (props: SendMsgComponentType) => {
    // ** Props
    const { store, dispatch } = props

    // ** State
    const [msg, setMsg] = useState<string>('')

    // ** Hooks
    const auth = useAuth()

    const handleSendMsg = (e: SyntheticEvent) => {
        e.preventDefault()
        if (store && store.selectedChat && msg.trim().length && auth.user) {
            dispatch(sendMsg({ chatId: store.selectedChat.chat.id, message: msg, senderId: auth.user.id }))
        }
        setMsg('')
    }

    return (
        <Form onSubmit={handleSendMsg}>
            <ChatFormWrapper>
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                    <TextField
                        fullWidth
                        value={msg}
                        size='small'
                        placeholder='Type your message here…'
                        onChange={e => setMsg(e.target.value)}
                        sx={{ '& .MuiOutlinedInput-input': { pl: 0 }, '& fieldset': { border: '0 !important' } }}
                    />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton size='small' component='label' htmlFor='upload-img' sx={{ mr: 2.75, color: 'text.primary' }}>
                        <Icon icon='mdi:attachment' fontSize='1.375rem' />
                        <input hidden type='file' id='upload-img' />
                    </IconButton>
                    <Button type='submit' variant='contained'>
                        Send
                    </Button>
                </Box>
            </ChatFormWrapper>
        </Form>
    )
}

export default SendMsgForm
