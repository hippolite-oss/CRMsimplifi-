import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  centres: [],          // Tous les centres accessibles
  currentCentre: null,  // Centre actif
};

const centresSlice = createSlice({
  name: 'centres',
  initialState,
  reducers: {
    setCentres: (state, action) => {
      state.centres = action.payload || [];
    },

    setCurrentCentre: (state, action) => {
      state.currentCentre = action.payload;
    },

    resetCentres: () => initialState,
  },
});

export const {
  setCentres,
  setCurrentCentre,
  resetCentres,
} = centresSlice.actions;

export default centresSlice.reducer;
