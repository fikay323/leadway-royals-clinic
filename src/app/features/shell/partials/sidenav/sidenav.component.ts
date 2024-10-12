import { Component, EventEmitter, Output } from '@angular/core';
import { UtilityService } from '../../../../shared/services/utility.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {
  @Output() closeSidenav = new EventEmitter<void>();
  isMobile: boolean = false;
  user$ = this.authService.user$

  get userNameAndEmail(): {name: string, email: string}{
    let firstName;
    let lastName;
    let email;
    this.authService.user$.subscribe(user => {
      firstName = user.firstName || "";
      lastName = user.lastName || "";
      email = user.email || ""
    })
    return {
      name: !!firstName || !!lastName ? `${firstName} ${lastName}` : "",
      email: email
    };
  }

  readonly LOG_OUT_ID = "log-out";

  readonly routes = [
    {
      label: "Dashboard",
      iconSrc: "assets/svg/dashboard-icon.svg",
      route: ["/main-app", "dashboard"]
    },
    {
      label: "Chats",
      iconSrc: "assets/svg/user-icon.svg",
      route: ["/main-app", "chats"]
    },
    {
      label: "Schedules",
      iconSrc: "assets/svg/support-icon.svg",
      route: ["/main-app", "schedules"]
    },
    {
      label: "Logout",
      id: this.LOG_OUT_ID,
      iconSrc: "assets/svg/logout-icon.svg",
      route: ["/auth", "login"]
    }
  ];

  constructor(
    private utilityService: UtilityService,
    private authService: AuthService
  ) { }

  isMobile$ = this.utilityService.isMobile$.subscribe((res: any) => {
    this.isMobile = res;
  })
  
  closeNav(id?: string) {
    if (this.isMobile) {
      this.closeSidenav.emit()
    }
    id == this.LOG_OUT_ID && this.authService.logout()
  }

}
