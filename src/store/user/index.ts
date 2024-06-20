// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

// ** Fetch Users by Email
export const getUserByEmail = createAsyncThunk('appUsers/getUsersByEmail', async (email: string) => {
  const response = await axios.get(`/api/user/getUserByEmail?email=${encodeURIComponent(email)}`)
  console.log(response);


  return response.data
})

export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    data: []
  },
  reducers: {}
})

export default usersSlice.reducer
