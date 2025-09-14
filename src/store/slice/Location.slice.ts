import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  location: '',
  clientId: '',
}

const LocationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action) => {
      state.location = action.payload
    },
    setClientId: (state, action) => {
      state.clientId = action.payload
    },
  },
})

export const { setLocation, setClientId } = LocationSlice.actions

export default LocationSlice.reducer
