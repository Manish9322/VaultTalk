
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  isSubmitting: false,
  error: null,
};

export const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    setSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
      if(action.payload) {
        state.error = null;
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isSubmitting = false;
    },
    clearForm: () => initialState,
  },
});

export const { setField, setSubmitting, setError, clearForm } = registerSlice.actions;

export const selectRegisterState = (state) => state.register;

export default registerSlice.reducer;
