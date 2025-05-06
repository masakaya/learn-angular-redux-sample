import { Injectable, inject, runInInjectionContext, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { injectStore, injectDispatch, injectSelector } from '@reduxjs/angular-redux';
import { AppState } from '../../store';
import { User, LoginRequest } from '../../models/user.model';
import * as AuthActions from '../../store/auth/auth.actions';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthStoreService {
  private readonly TOKEN_KEY = 'auth_token';

  private store = injectStore<AppState>();
  private dispatch = injectDispatch();
  private injector = inject(Injector);

  constructor(
    private http: HttpClient
  ) {
    this.initializeStore();
  }

  // Auth methods
  login(credentials: LoginRequest): Observable<boolean> {
    this.dispatch(AuthActions.loginRequest(credentials));

    return this.http.post<{ api_token: string }>('/api/login', credentials).pipe(
      tap(response => {
        if (response && response.api_token) {
          this.setToken(response.api_token);
          this.dispatch(AuthActions.loginSuccess({ token : response.api_token} ));
          this.loadUserProfile();
        }
      }),
      map(() => true),
      catchError(() => {
        this.dispatch(AuthActions.loginFailure({ error: 'Login failed'}));
        return of(false);
      })
    );
  }

  logout(): void {
    this.removeToken();
    this.dispatch(AuthActions.logout());
  }

  loadUserProfile(): void {
    this.dispatch(AuthActions.loadUserRequest());

    this.http.get<User>('/api/user/1').pipe(
      tap(user => {
        this.dispatch(AuthActions.loadUserSuccess({user}));
      }),
      catchError(error => {
        this.dispatch(AuthActions.loadUserFailure(error));
        this.logout();
        return of(null);
      })
    ).subscribe();
  }

  // Selectors
  private userSignal = injectSelector<AppState, User | null>(state => state.auth.user);
  private isLoggedInSignal = injectSelector<AppState, boolean>(state => !!state.auth.token);
  private authLoadingSignal = injectSelector<AppState, boolean>(state => state.auth.loading);
  private authErrorSignal = injectSelector<AppState, any>(state => state.auth.error);

  selectUser(): Observable<User | null> {
    return runInInjectionContext(this.injector, () => toObservable(this.userSignal));
  }

  selectIsLoggedIn(): Observable<boolean> {
    return runInInjectionContext(this.injector, () => toObservable(this.isLoggedInSignal));
  }

  selectAuthLoading(): Observable<boolean> {
    return runInInjectionContext(this.injector, () => toObservable(this.authLoadingSignal));
  }

  selectAuthError(): Observable<any> {
    return runInInjectionContext(this.injector, () => toObservable(this.authErrorSignal));
  }

  // Private methods
  private initializeStore(): void {
    // Check for auth token in cookie
    const token = this.getToken();
    if (token) {
      this.dispatch(AuthActions.loginSuccess({token: token}));
      this.loadUserProfile();
    }
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
