import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStoreService } from '../../services/auth/auth-store.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private authStoreService: AuthStoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to loading state
    this.subscriptions.push(
      this.authStoreService.selectAuthLoading().subscribe(loading => {
        this.isLoading = loading;
      })
    );

    // Subscribe to error state
    this.subscriptions.push(
      this.authStoreService.selectAuthError().subscribe(error => {
        if (error) {
          this.errorMessage = 'Invalid email or password';
        }
      })
    );

    // Subscribe to login state
    this.subscriptions.push(
      this.authStoreService.selectIsLoggedIn().subscribe(isLoggedIn => {
        if (isLoggedIn) {
          this.router.navigate(['/todo']);
        }
      })
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    this.errorMessage = '';

    this.authStoreService.login({ email: this.email, password: this.password })
      .subscribe({
        error: () => {
          this.errorMessage = 'An error occurred. Please try again.';
        }
      });
  }
}
