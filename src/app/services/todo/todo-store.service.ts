import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { injectStore, injectDispatch } from '@reduxjs/angular-redux';
import { AppState } from '../../store';
import { Todo } from '../../models/todo.model';
import * as TodoActions from '../../store/todo/todo.actions';
import { TodoSelectorService } from './todo-selector.service';

@Injectable({
  providedIn: 'root'
})
export class TodoStoreService {
  private readonly TODOS_KEY = 'todos';

  private store = injectStore<AppState>();
  private dispatch = injectDispatch();
  private todoSelector = inject(TodoSelectorService);

  constructor() {
    this.loadTodos();
  }

  // Todo methods
  loadTodos(): void {
    const storedTodos = localStorage.getItem(this.TODOS_KEY);
    const todos: Todo[] = storedTodos ? JSON.parse(storedTodos) : [];
    this.dispatch(TodoActions.loadTodos({ todos }));
  }

  addTodo(title: string): void {
    if (title.trim()) {
      this.dispatch(TodoActions.addTodo({ title }));
      this.saveTodosToLocalStorage();
    }
  }

  toggleTodo(id: number): void {
    this.dispatch(TodoActions.toggleTodo({ id }));
    this.saveTodosToLocalStorage();
  }

  deleteTodo(id: number): void {
    this.dispatch(TodoActions.deleteTodo({ id }));
    this.saveTodosToLocalStorage();
  }

  // Selectors
  selectTodos(): Observable<Todo[]> {
    return this.todoSelector.selectTodos();
  }

  // Private methods
  private saveTodosToLocalStorage(): void {
    const state = this.store.getState();
    localStorage.setItem(this.TODOS_KEY, JSON.stringify(state.todo.todos));
  }
}
