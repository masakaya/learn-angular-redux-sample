import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { AuthStoreService } from './services/auth/auth-store.service';
import { TodoStoreService } from './services/todo/todo-store.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'TODO App';

  constructor(
    private authStoreService: AuthStoreService,
    private todoStoreService: TodoStoreService
  ) {}

  ngOnInit(): void {
    // The store will be initialized in the AuthStoreService and TodoStoreService constructors
  }
}
