// store/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  name: '',
  email: '',
  role: '',
  actif: false,
  centre: null,
  createdAt: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {

    setUserDetails: (state, action) => {
      const user = action.payload;

      state.id = user?._id || null;
      state.name = user?.name || '';
      state.email = user?.email || '';
      state.role = user?.role || '';
      state.actif = user?.actif ?? false;
      state.centre = user?.centre || null;
      state.createdAt = user?.createdAt || null;
    },

    logout: () => initialState,

    updateCentre: (state, action) => {
      state.centre = action.payload;
    }

  },
});

export const {
  setUserDetails,
  logout,
  updateCentre
} = userSlice.actions;

export default userSlice.reducer;
