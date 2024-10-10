import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private router: Router, private notificationService: NotificationService) {}

  handleError(error: any) {
    console.log(error)
    let errorMessage: string;
    
    if (error.code) {
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'User not found.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'Email is already in use.';
          break;
        case 'auth/invalid-credential':
            errorMessage = 'Email or password is incorrect.'
            break;
        case 'auth/configuration-not-found':
            errorMessage = "Configuration not found"
            break;
        default:
          errorMessage = 'An unknown error occurred.';
          break;
      }
    } else {
      errorMessage = 'An unexpected error occurred. Please try again later.';
    }
    this.notificationService.alertError(errorMessage)
  }
}
