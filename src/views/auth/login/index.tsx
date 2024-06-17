'use client'
// ** React Imports
import React, { useState, MouseEvent } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import { styled } from '@mui/material/styles'
import { CardContent, Typography, InputAdornment, FormHelperText, OutlinedInput, FormControl, Box, Card, IconButton, InputLabel, TextField, Checkbox, Divider, Button } from '@mui/material'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import Icon from '../../../components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks Import
import { useAuth } from '../../../hooks/useAuth'

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
    '& .MuiFormControlLabel-label': {
        fontSize: '0.875rem',
        color: theme.palette.text.secondary
    }
}))

const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(5).required()
})

const defaultValues = {
    password: '12345678',
    email: 'rauchg@vercel.com'
}

interface FormData {
    email: string
    password: string
}

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [rememberMe, setRememberMe] = useState<boolean>(true)

    // ** Hooks
    const auth = useAuth()

    const {
        control,
        setError,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues,
        mode: 'onBlur',
        resolver: yupResolver(schema)
    })

    const onSubmit = (data: FormData) => {
        const { email, password } = data
        auth.login({ email, password, rememberMe }, () => {
            setError('email', {
                type: 'manual',
                message: 'Email or Password is invalid'
            })
        })
    }

    return (
        <Card sx={{ zIndex: 1 }}>
            <CardContent sx={{ p: theme => `${theme.spacing(13, 7, 6.5)} !important` }}>
                <Box sx={{ mb: 6 }}>
                    <Typography variant='h5' sx={{ mb: 1.5, fontWeight: 600, letterSpacing: '0.18px' }}>
                        {`Welcome to ChatterBox! 👋🏻`}
                    </Typography>
                    <Typography variant='body2'>Please sign-in to your account and start the adventure</Typography>
                </Box>
                <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                            name='email'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange, onBlur } }) => (
                                <TextField
                                    autoFocus
                                    label='Email'
                                    value={value}
                                    onBlur={onBlur}
                                    onChange={onChange}
                                    error={Boolean(errors.email)}
                                    placeholder='admin@materialize.com'
                                />
                            )}
                        />
                        {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                            Password
                        </InputLabel>
                        <Controller
                            name='password'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange, onBlur } }) => (
                                <OutlinedInput
                                    value={value}
                                    onBlur={onBlur}
                                    label='Password'
                                    onChange={onChange}
                                    id='auth-login-v2-password'
                                    error={Boolean(errors.password)}
                                    type={showPassword ? 'text' : 'password'}
                                    endAdornment={
                                        <InputAdornment position='end'>
                                            <IconButton
                                                edge='end'
                                                onMouseDown={e => e.preventDefault()}
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20} />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            )}
                        />
                        {errors.password && (
                            <FormHelperText sx={{ color: 'error.main' }} id=''>
                                {errors.password.message}
                            </FormHelperText>
                        )}
                    </FormControl>
                    <Box
                        sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
                    >
                        <FormControlLabel
                            label='Remember Me'
                            control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
                        />
                        <Typography
                            variant='body2'
                            component={Link}
                            href='/forgot-password'
                            sx={{ color: 'primary.main', textDecoration: 'none' }}
                        >
                            Forgot Password?
                        </Typography>
                    </Box>
                    <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }}>
                        Login
                    </Button>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Typography sx={{ mr: 2, color: 'text.secondary' }}>New on our platform?</Typography>
                        <Typography href='/register' component={Link} sx={{ color: 'primary.main', textDecoration: 'none' }}>
                            Create an account
                        </Typography>
                    </Box>
                </form>
            </CardContent>
        </Card>
    )
}

export default LoginForm
