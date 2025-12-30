import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import centresReducer from './centresSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    centres: centresReducer,
  },
});
