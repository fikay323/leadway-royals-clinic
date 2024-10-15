import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../../shared/services/auth.service';
import { passwordValidator } from '../../../../shared/validators/password.validator';
import { registerRequest } from '../../../../shared/models/auth.model';
import { mimeType } from '../../../../shared/validators/mime-type.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  hide = true;
  emailErrorMessage = '';
  loading = false;
  imagePreview: string;
  profilePic: File = null

  registerForm = this.formBuilder.group({
    phoneNumber: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['Boss@12345', [Validators.required, passwordValidator]],
    role: ['', [Validators.required]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    profilePicture: [null as File, [Validators.required], [mimeType]]
  });
  
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
  }

  submitForm() {
    this.loading = true;
    const registerFormData = this.registerForm.value as registerRequest
    this.authService.registerUser(registerFormData, this.profilePic).subscribe(res => {
      this.loading = false
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

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.profilePic = (event.target as HTMLInputElement).files![0];
    this.registerForm.get('profilePicture')?.patchValue(file);
    const reader = new FileReader();
    reader.onload = () => {
      const fileBase64 = reader.result as string;
      this.imagePreview = fileBase64;
    };
    reader.readAsDataURL(file);
  }

}
