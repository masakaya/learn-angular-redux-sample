import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TodoStoreService } from '../../services/todo/todo-store.service';
import { AuthStoreService } from '../../services/auth/auth-store.service';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { Todo } from '../../models/todo.model';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TodoItemComponent],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent implements OnInit, OnDestroy {
  todos: Todo[] = [];
  newTodoTitle = '';
  currentUser: User | null = null;

  private subscriptions: Subscription[] = [];

  constructor(
    private todoStoreService: TodoStoreService,
    private authStoreService: AuthStoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to todos
    this.subscriptions.push(
      this.todoStoreService.selectTodos().subscribe(todos => {
        this.todos = todos;
      })
    );

    // Subscribe to current user
    this.subscriptions.push(
      this.authStoreService.selectUser().subscribe(user => {
        this.currentUser = user;
      })
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  addTodo(): void {
    if (this.newTodoTitle.trim()) {
      this.todoStoreService.addTodo(this.newTodoTitle);
      this.newTodoTitle = '';
    }
  }

  toggleTodo(id: number): void {
    this.todoStoreService.toggleTodo(id);
  }

  deleteTodo(id: number): void {
    this.todoStoreService.deleteTodo(id);
  }

  logout(): void {
    this.authStoreService.logout();
    this.router.navigate(['/login']);
  }
}
