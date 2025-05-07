import { createAction } from '@reduxjs/toolkit';
import { User, LoginRequest } from '../../models/user.model';

// Action Creators with createAction
export const loginRequest = createAction<LoginRequest>('LOGIN_REQUEST');
export const loginSuccess = createAction<{ token: string }>('LOGIN_SUCCESS');
export const loginFailure = createAction<{ error: any }>('LOGIN_FAILURE');
export const logout = createAction('LOGOUT');
export const loadUserRequest = createAction('LOAD_USER_REQUEST');
export const loadUserSuccess = createAction<{ user: User }>('LOAD_USER_SUCCESS');
export const loadUserFailure = createAction<{ error: any }>('LOAD_USER_FAILURE');

// Union type for all auth actions (for compatibility with existing code)
export type AuthActionTypes =
  | ReturnType<typeof loginRequest>
  | ReturnType<typeof loginSuccess>
  | ReturnType<typeof loginFailure>
  | ReturnType<typeof logout>
  | ReturnType<typeof loadUserRequest>
  | ReturnType<typeof loadUserSuccess>
  | ReturnType<typeof loadUserFailure>;
