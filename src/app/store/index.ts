import { configureStore } from '@reduxjs/toolkit';
import { Store } from 'redux';
import { thunk } from 'redux-thunk';
import { authReducer, AuthState } from './auth/auth.reducer';
import { todoReducer, TodoState } from './todo/todo.reducer';

// Define the root state interface
export interface AppState {
  auth: AuthState;
  todo: TodoState;
}

// Configure the store
export function configureAppStore(): Store<AppState> {
  return configureStore({
    reducer: {
      auth: authReducer,
      todo: todoReducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(thunk)
  });
}

// Create a singleton store instance
export const store = configureAppStore();
