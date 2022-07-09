import { configureStore } from '@reduxjs/toolkit';
import appSlice from './app-slice';

const store = configureStore({
    reducer: appSlice.reducer
});

export const appActions = appSlice.actions;

export default store;