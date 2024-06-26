'use client'
import Login from '../../views/auth/login'
import { Box } from '@mui/material'

const Page = () => {

    return (
        <Box sx={{
            display: 'flex',
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            padding: theme => theme.spacing(5)
        }}>
            <Login />
        </Box>
    )
}

export default Page
