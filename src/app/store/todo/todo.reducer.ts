import { Todo } from '../../models/todo.model';
import * as TodoActions from './todo.actions';
import { createReducer } from '@reduxjs/toolkit';

// Define the todo state interface
export interface TodoState {
  todos: Todo[];
  nextId: number;
}

// Define the initial state
const initialState: TodoState = {
  todos: [],
  nextId: 1
};

// Define the todo reducer using createReducer
export const todoReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(TodoActions.loadTodos, (state, action) => {
      state.todos = action.payload.todos;
      state.nextId = action.payload.todos.length > 0
        ? Math.max(...action.payload.todos.map(todo => todo.id)) + 1
        : 1;
    })
    .addCase(TodoActions.addTodo, (state, action) => {
      const newTodo: Todo = {
        id: state.nextId,
        title: action.payload.title.trim(),
        completed: false
      };
      state.todos.push(newTodo);
      state.nextId += 1;
    })
    .addCase(TodoActions.toggleTodo, (state, action) => {
      const todo = state.todos.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.completed = !todo.completed;
      }
    })
    .addCase(TodoActions.deleteTodo, (state, action) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload.id);
    });
});
