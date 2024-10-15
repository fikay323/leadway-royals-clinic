import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  @Output() openSidenav = new EventEmitter<void>()
  profilePic: string

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.profilePic = user.profilePic
    })
  }

  openNav() {
    this.openSidenav.emit()
  }
}
