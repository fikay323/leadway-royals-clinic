import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { passwordValidator } from '../../../../shared/validators/password.validator';
import { loginRequest } from '../../../../shared/models/auth.model';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  hide = true;
  loading = false;
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, passwordValidator]]
  });
  emailErrorMessage = '';

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
  ) {}
  
  updateErrorMessage() {
    if (this.loginForm.controls['email'].hasError('required')) {
      this.emailErrorMessage = 'You must enter a value';
    } else if (this.loginForm.controls['email'].hasError('email')) {
      this.emailErrorMessage = 'Not a valid email';
    } else {
      this.emailErrorMessage = '';
    }
  }

  onUserLogin() {
    this.loading = true;
    const loginData = this.loginForm.value as loginRequest;
    this.authService.login(loginData).finally(() => {
      this.loading = false;
    })
  }
}
