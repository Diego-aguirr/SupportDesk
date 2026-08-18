import { createSlice } from '@reduxjs/toolkit';
import type { SettingsState } from '@/types';

const initialState: SettingsState = {
  theme: 'system',
  shortcuts: [],
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
});

export default settingsSlice.reducer;
