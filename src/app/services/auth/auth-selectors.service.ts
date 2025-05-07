import { Injectable, inject, runInInjectionContext, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { injectSelector } from '@reduxjs/angular-redux';
import { AppState } from '../../store';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthSelectorsService {
  private injector = inject(Injector);

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
}
