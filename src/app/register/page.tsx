'use client'
import Register from '@/src/views/auth/register'
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
            <Register />
        </Box>
    )
}

export default Page
