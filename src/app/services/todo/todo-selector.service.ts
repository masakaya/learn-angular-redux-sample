import { Injectable, inject, runInInjectionContext, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { injectSelector } from '@reduxjs/angular-redux';
import { AppState } from '../../store';
import { Todo } from '../../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoSelectorService {
  private injector = inject(Injector);

  // Selectors
  private todosSignal = injectSelector<AppState, Todo[]>(state => state.todo.todos);

  selectTodos(): Observable<Todo[]> {
    return runInInjectionContext(this.injector, () => toObservable(this.todosSignal));
  }
}
