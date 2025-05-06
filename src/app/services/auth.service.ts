import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of, switchMap } from 'rxjs';
import { User, LoginRequest, LoginResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {
    // Check if token exists in cookie on initialization
    this.checkToken();
  }

  get currentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  get isLoggedIn(): Observable<boolean> {
    return this.currentUser.pipe(
      switchMap(user => of(!!user))
    );
  }

  login(credentials: LoginRequest): Observable<boolean> {
    return this.http.post<LoginResponse>('/api/login', credentials).pipe(
      tap(response => {
        if (response && response.api_token) {
          this.setToken(response.api_token);
          this.loadUserProfile();
        }
      }),
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  logout(): void {
    this.removeToken();
    this.currentUserSubject.next(null);
  }

  private checkToken(): void {
    const token = this.getToken();
    if (token) {
      this.loadUserProfile();
    }
  }

  private loadUserProfile(): void {
    // For simplicity, we're using a fixed user ID (1)
    this.http.get<User>('/api/user/1').subscribe({
      next: (user) => {
        this.currentUserSubject.next(user);
      },
      error: () => {
        // If we can't load the user profile, log out
        this.logout();
      }
    });
  }

  private setToken(token: string): void {
    // Set token in cookie with expiration of 1 day
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);
    document.cookie = `${this.TOKEN_KEY}=${token}; expires=${expiryDate.toUTCString()}; path=/`;
  }

  private getToken(): string | null {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === this.TOKEN_KEY) {
        return value;
      }
    }
    return null;
  }

  private removeToken(): void {
    // Remove token by setting an expired date
    document.cookie = `${this.TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  }
}
