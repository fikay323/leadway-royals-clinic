import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../../../shared/services/auth.service';
import { passwordValidator } from '../../../../shared/validators/password.validator';
import { Router } from '@angular/router';
import { registerRequest } from '../../../../shared/models/auth.model';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  hide = true;
  emailErrorMessage = '';
  isIndividual = false;
  loading = false;

  registerForm = this.formBuilder.group({
    phoneNumber: ['', [Validators.required, Validators.minLength(11)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['Boss@12345', [Validators.required, passwordValidator]],
    role: ['', [Validators.required]]
  });
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const currentUrl  = this.router.url;
    this.isIndividual = currentUrl.includes('individual');
  }

  submitForm() {
    this.loading = true;
    const registerFormData = this.registerForm.value as registerRequest
    this.authService.registerUser(registerFormData).subscribe({
      next: (res) => {
        console.log(res)
        this.loading = false
        this.notificationService.alertSuccess('Account Registered Successfully')
      }, 
      error: (error) => {
        this.loading = false
      }
    })
  }

  updateErrorMessage() {
    if (this.registerForm.controls['email'].hasError('required')) {
      this.emailErrorMessage = 'You must enter a value';
    } else if (this.registerForm.controls['email'].hasError('email')) {
      this.emailErrorMessage = 'Not a valid email';
    } else {
      this.emailErrorMessage = '';
    }
  }

}
