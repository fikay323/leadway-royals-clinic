import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { InformationForm, ProfileService } from '../../../../shared/services/profile.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { User } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.scss'
})
export class PatientDashboardComponent {
  user: User
  user$ = this.authService.user$
  personalInformation: InformationForm
  personalInformation$: Observable<InformationForm> = this.profileService.getPersonalInformation(this.user$)

  constructor(private authService: AuthService, private profileService: ProfileService) {}

  ngOnInit() {
    this.personalInformation$.subscribe(info => {
      this.personalInformation = info
    })
    this.user$.subscribe(user => {
      this.user = user
    })
  }

}
