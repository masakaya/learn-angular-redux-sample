import { User } from '../../models/user.model';
import * as AuthActions from './auth.actions';
import { createReducer } from '@reduxjs/toolkit';

// Define the auth state interface
export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: any;
}

// Define the initial state
const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null
};

// Define the auth reducer using createReducer
export const authReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(AuthActions.loginRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(AuthActions.loginSuccess, (state, action) => {
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
    })
    .addCase(AuthActions.loginFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
    })
    .addCase(AuthActions.loadUserRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(AuthActions.loadUserSuccess, (state, action) => {
      state.user = action.payload.user;
      state.loading = false;
      state.error = null;
    })
    .addCase(AuthActions.loadUserFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
    })
    .addCase(AuthActions.logout, (state) => {
      // Reset to initial state
      return initialState;
    });
});
