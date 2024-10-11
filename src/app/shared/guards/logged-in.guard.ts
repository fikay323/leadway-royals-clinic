import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { NotificationService } from '../services/notification.service';

export const loggedInGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)
  const notificationService = inject(NotificationService)
  let userPresent: User
  authService.user$.subscribe(user => {
    userPresent = user
  })
  if (userPresent) return true
  notificationService.alertError('Pls login')
  return router.navigate(['auth', 'login'])
};
