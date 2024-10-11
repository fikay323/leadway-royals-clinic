import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { filter } from 'rxjs';
import { UtilityService } from '../../shared/services/utility.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  isEditProfileRoute: boolean = false;

  constructor(
    private router: Router,
    private utilityService: UtilityService
  ) {}

  isMobile$ = this.utilityService.isMobile$

  ngOnInit(): void {
    this.checkURL(this.router.url);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkURL(event.url);
    });
  }

  checkURL(url: string){
    this.isEditProfileRoute = url === '/main-app/settings/edit-profile';
  }
}
