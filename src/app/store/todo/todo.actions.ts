import { createAction } from '@reduxjs/toolkit';
import { Todo } from '../../models/todo.model';

// Action Creators with createAction
export const loadTodos = createAction<{ todos: Todo[] }>('LOAD_TODOS');
export const addTodo = createAction<{ title: string }>('ADD_TODO');
export const toggleTodo = createAction<{ id: number }>('TOGGLE_TODO');
export const deleteTodo = createAction<{ id: number }>('DELETE_TODO');

// Union type for all todo actions (for compatibility with existing code)
export type TodoActionTypes =
  | ReturnType<typeof loadTodos>
  | ReturnType<typeof addTodo>
  | ReturnType<typeof toggleTodo>
  | ReturnType<typeof deleteTodo>;
