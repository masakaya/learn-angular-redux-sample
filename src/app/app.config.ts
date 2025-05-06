import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRedux } from '@reduxjs/angular-redux';

import { routes } from './app.routes';
import { AuthStoreService } from './services/auth/auth-store.service';
import { TodoStoreService } from './services/todo/todo-store.service';
import { store } from './store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideRedux({ store }),
    AuthStoreService,
    TodoStoreService
  ]
};
