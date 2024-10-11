import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { InformationForm, ProfileService } from '../../shared/services/profile.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  user$ = this.authService.user$
  personalInformation: InformationForm
  personalInformation$: Observable<InformationForm> = this.profileService.getPersonalInformation(this.user$)

  constructor(private authService: AuthService, private profileService: ProfileService) {}

  ngOnInit() {
    this.personalInformation$.subscribe(info => {
      this.personalInformation = info
    })
  }

  

}
