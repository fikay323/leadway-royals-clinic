import { Component } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-settings-menu-mobile',
  templateUrl: './settings-menu-mobile.component.html',
  styleUrl: './settings-menu-mobile.component.scss'
})
export class SettingsMenuMobileComponent {
  user$ = this.authService.user$

  get userNameAndEmail(): {name: string, email: string, phoneNumber: string}{
    let firstName;
    let lastName;
    let email;
    let phoneNumber;
    this.authService.user$.subscribe(user => {
      firstName = user.firstName || "";
      lastName = user.lastName || "";
      email = user.email || ""
      phoneNumber = user.phoneNumber || ""
    })
    return {
      name: !!firstName || !!lastName ? `${firstName} ${lastName}` : "",
      email: email,
      phoneNumber: phoneNumber
    };
  }

  constructor(
    private authService: AuthService
  ){}
}
