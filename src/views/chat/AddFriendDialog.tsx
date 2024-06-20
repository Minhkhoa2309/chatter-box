// ** React Imports
import { Ref, useState, forwardRef, ReactElement } from 'react'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/src/store'
import { useAuth } from '@/src/hooks/useAuth'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import FormHelperText from '@mui/material/FormHelperText'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Icon Imports
import Icon from '@/src/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { getUserByEmail } from '@/src/store/user'
import { addFriend } from '@/src/store/friendship'

const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

interface AddFriendDialogType {
    open: boolean
    toggle: () => void
}

interface UserData {
    email: string
}

const schema = yup.object().shape({
    email: yup.string().email().required()
})

const defaultValues = {
    email: ''
}

const AddFriendDialog = (props: AddFriendDialogType) => {
    // ** Props
    const { open, toggle } = props

    // ** Hooks
    const dispatch = useDispatch<AppDispatch>()
    const store = useSelector((state: RootState) => state.friendship)
    const auth = useAuth()


    const {
        reset,
        control,
        setValue,
        setError,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues,
        mode: 'onChange',
        resolver: yupResolver(schema)
    })
    const onSubmit = async (data: UserData) => {
        const friend = await dispatch(getUserByEmail(data.email));
        if (auth.user?.id && friend.payload.id) {
            const userId = auth.user?.id;
            const friendId = friend.payload.id;
            await dispatch(addFriend({ userId, friendId }));
            toggle()
            reset()
        } else {
            setError('email', {
                message: 'User not exists!'
            })
        }
    }

    const handleClose = () => {
        toggle()
        reset()
    }

    return (
        <Dialog
            fullWidth
            open={open}
            maxWidth='sm'
            scroll='body'
            onClose={handleClose}
            TransitionComponent={Transition}
            onBackdropClick={handleClose}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent
                    sx={{
                        position: 'relative',
                        pb: theme => `${theme.spacing(8)} !important`,
                        px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                        pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                    }}
                >
                    <IconButton
                        size='small'
                        onClick={handleClose}
                        sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
                    >
                        <Icon icon='mdi:close' />
                    </IconButton>
                    <Box sx={{ mb: 9, textAlign: 'center' }}>
                        <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
                            Add New Friends
                        </Typography>
                    </Box>
                    <Grid container spacing={6}>
                        <FormControl fullWidth sx={{ mb: 6 }}>
                            <Controller
                                name='email'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        type='email'
                                        value={value}
                                        label='Email'
                                        onChange={onChange}
                                        placeholder='johndoe@email.com'
                                        error={Boolean(errors.email)}
                                    />
                                )}
                            />
                            {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
                        </FormControl>
                    </Grid>
                </DialogContent>
                <DialogActions
                    sx={{
                        justifyContent: 'center',
                        px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                        pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                    }}
                >
                    <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
                        Submit
                    </Button>
                    <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
                        Cancel
                    </Button>
                </DialogActions>
            </form>

        </Dialog>
    )
}

export default AddFriendDialog
