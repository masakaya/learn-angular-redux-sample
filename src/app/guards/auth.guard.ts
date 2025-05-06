import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthStoreService } from '../services/auth/auth-store.service';

export const authGuard = () => {
  const authStoreService = inject(AuthStoreService);
  const router = inject(Router);

  return authStoreService.selectIsLoggedIn().pipe(
    take(1),
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
