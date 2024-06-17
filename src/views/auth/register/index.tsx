'use client'
// ** React Imports
import React, { useState } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import { CardContent, Typography, InputAdornment, FormHelperText, OutlinedInput, FormControl, Box, Card, IconButton, InputLabel, TextField, Button } from '@mui/material'
import Icon from '../../../components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks Import
import { useAuth } from '../../../hooks/useAuth'
import axios from 'axios'

const schema = yup.object().shape({
    email: yup.string().email().required(),
    name: yup.string().required(),
    password: yup.string().min(5).required(),
    confirmPassword: yup.string().min(5).required(),
})

const defaultValues = {
    password: '',
    confirmPassword: '',
    email: 'johnD@vercel.com',
    name: 'John Doe '
}

interface FormData {
    email: string
    password: string
    name: string
    confirmPassword: string
}

const RegisterForm = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

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
        if (data.password !== data.confirmPassword) {
            setError('confirmPassword', {
                type: 'manual',
                message: 'Confirm Password is not matches the password'
            })
        } else {
            const { name, email, password } = data
            auth.register({ name, email, password, }, () => {
                setError('email', {
                    type: 'manual',
                    message: 'Email is already registered'
                })
            })
        }
    }

    return (
        <Card sx={{ zIndex: 1 }}>
            <CardContent sx={{ p: theme => `${theme.spacing(13, 7, 6.5)} !important` }}>
                <Box sx={{ mb: 6 }}>
                    <Typography variant='h5' sx={{ mb: 1.5, fontWeight: 600, letterSpacing: '0.18px' }}>
                        {`Welcome to ChatterBox! 👋🏻`}
                    </Typography>
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
                                />
                            )}
                        />
                        {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                            name='name'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange, onBlur } }) => (
                                <TextField
                                    autoFocus
                                    label='Name'
                                    value={value}
                                    onBlur={onBlur}
                                    onChange={onChange}
                                    error={Boolean(errors.name)}
                                />
                            )}
                        />
                        {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                        <InputLabel htmlFor='auth-password' error={Boolean(errors.password)}>
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
                                    id='auth-password'
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
                    <FormControl fullWidth sx={{ mb: 4 }}>
                        <InputLabel htmlFor='auth-password' error={Boolean(errors.confirmPassword)}>
                            Confirm Password
                        </InputLabel>
                        <Controller
                            name='confirmPassword'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange, onBlur } }) => (
                                <OutlinedInput
                                    value={value}
                                    onBlur={onBlur}
                                    label='Confirm Password'
                                    onChange={onChange}
                                    id='auth-password'
                                    error={Boolean(errors.confirmPassword)}
                                    type={showPassword ? 'text' : 'password'}
                                    endAdornment={
                                        <InputAdornment position='end'>
                                            <IconButton
                                                edge='end'
                                                onMouseDown={e => e.preventDefault()}
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                <Icon icon={showConfirmPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20} />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            )}
                        />
                        {errors.confirmPassword && (
                            <FormHelperText sx={{ color: 'error.main' }} id=''>
                                {errors.confirmPassword.message}
                            </FormHelperText>
                        )}
                    </FormControl>
                    <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }}>
                        Register
                    </Button>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Typography sx={{ mr: 2, color: 'text.secondary' }}>Already have an account?</Typography>
                        <Typography href='/login' component={Link} sx={{ color: 'primary.main', textDecoration: 'none' }}>
                            Sign in instead
                        </Typography>
                    </Box>
                </form>
            </CardContent>
        </Card>
    )
}

export default RegisterForm
