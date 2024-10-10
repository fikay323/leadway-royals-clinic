import { AbstractControl } from '@angular/forms';

export function passwordValidator(control: AbstractControl): { [key: string]: any } | null {
  const password = control.value;

  // Check for uppercase letter
  const hasUppercase = /[A-Z]/.test(password);

  // Check for lowercase letter
  const hasLowercase = /[a-z]/.test(password);

  // Check for special character
  const hasSpecialChar = /[^\w\s]/.test(password);

  // Check for number
  const hasNumber = /\d/.test(password);

  // Check minimum character length
  const hasMinLength = password.length >= 6;

  // Combine checks and return error if any fail
  if (!hasUppercase || !hasLowercase || !hasSpecialChar || !hasNumber || !hasMinLength) {
    return {
      passwordInvalid: {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one special character, one number, and be at least 6 characters long.'
      }
    };
  }

  return null; // Valid password
}
