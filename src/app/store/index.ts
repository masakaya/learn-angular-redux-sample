import { configureStore } from '@reduxjs/toolkit';
import { authReducer, AuthState } from './auth/auth.reducer';
import { todoReducer, TodoState } from './todo/todo.reducer';

// Define the root state interface
export interface AppState {
  auth: AuthState;
  todo: TodoState;
}

// Configure the store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    todo: todoReducer
  }
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
