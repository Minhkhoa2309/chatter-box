// ** React Imports
import { Ref, forwardRef, ReactElement, useState, SyntheticEvent, useEffect } from 'react'

// ** Redux
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/src/store'
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
import { Autocomplete, Checkbox } from '@mui/material'
import { fetchFriend } from '@/src/store/friendship'
import { UserDataType } from '@/src/context/types'
import { addChat } from '@/src/store/chat'

const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

interface AddChatDialogType {
    open: boolean
    toggle: () => void
}

interface ChatData {
    name: string
    userIds: number[]
}

const schema = yup.object().shape({
    name: yup.string().required(),
    userIds: yup.array().of(yup.number().required()).required(),
})

const defaultValues = {
    name: '',
    userIds: []
}

const AddChatDialog = (props: AddChatDialogType) => {
    // ** Props
    const { open, toggle } = props

    // ** States
    const [userFriends, setUserFriends] = useState<UserDataType[]>([]);
    const [selectedFriends, setSelectedFriends] = useState<UserDataType[]>([]);

    // ** Hooks
    const dispatch = useDispatch<AppDispatch>()
    const auth = useAuth()

    useEffect(() => {
        const fetchUserFriend = async () => {
            if (auth.user?.id) {
                const res = await dispatch(fetchFriend(auth.user?.id))
                if (res.payload) {
                    setUserFriends(res.payload.userFriends)
                }
            }
        }
        fetchUserFriend();
    }, [])

    const {
        reset,
        control,
        setError,
        setValue,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues,
        mode: 'onChange',
        resolver: yupResolver(schema)
    })

    const onSubmit = async (data: ChatData) => {
        if (auth.user?.id) {
            await dispatch(addChat({
                userIds: [...data.userIds, auth.user?.id],
                name: data.name,
                isGroupChat: true
            }))
            toggle()
            reset()
        } 
    }

    const handleClose = () => {
        toggle()
        reset()
    }

    const handleChange = (event: SyntheticEvent, newValue: any | null) => {
        setSelectedFriends(newValue)
        setValue('userIds', newValue.map((value: any) => value.id))
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
                            Add New Group
                        </Typography>
                    </Box>
                    <Grid container spacing={6}>
                        <FormControl fullWidth sx={{ mb: 6 }}>
                            <Controller
                                name='name'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        type='name'
                                        value={value}
                                        label='Group Name'
                                        onChange={onChange}
                                        placeholder='Group 101'
                                        error={Boolean(errors.name)}
                                    />
                                )}
                            />
                            {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
                        </FormControl>
                        <FormControl fullWidth>
                            <Controller
                                name='userIds'
                                control={control}
                                rules={{ required: true }}
                                render={() => (
                                    <Autocomplete
                                        value={selectedFriends}
                                        multiple
                                        disableCloseOnSelect
                                        limitTags={2}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        options={userFriends}
                                        onChange={handleChange}
                                        getOptionLabel={option => option.name || ''}
                                        renderInput={params => (
                                            <TextField
                                                error={Boolean(errors.userIds)}
                                                {...params}
                                                label='Members'
                                            />
                                        )}
                                        renderOption={(props, option, { selected }) => (
                                            <li {...props}>
                                                <Checkbox checked={selected} sx={{ mr: 2 }} />
                                                {option.name}
                                            </li>
                                        )}
                                    />
                                )}
                            />
                            {errors.userIds && (
                                <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors.userIds?.message}
                                </FormHelperText>
                            )}
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

export default AddChatDialog
