import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly durationInSeconds = 5;
  constructor(private snackBar: MatSnackBar) {}

  alertSuccess(message: string) {
    return this.snackBar.open(message, undefined, {
      panelClass: 'success-snackbar-popup',
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: this.durationInSeconds * 1000
    });
  }

  alertError(message: string) {
    return this.snackBar.open(message, undefined, {
      panelClass: 'error-snackbar-popup',
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: this.durationInSeconds * 1000
    });
  }
}
