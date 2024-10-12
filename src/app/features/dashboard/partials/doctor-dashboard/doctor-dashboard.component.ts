import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { IndividualDoctorSchedule, ScheduleService } from '../../../../shared/services/schedule.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { User } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.scss'
})
export class DoctorDashboardComponent {
  user: User
  user$ = this.authService.user$
  businessDays: Date[] = [];
  doctorSchedule: IndividualDoctorSchedule
  schedule$: Observable<IndividualDoctorSchedule[]>

  constructor(private scheduleService: ScheduleService, private authService: AuthService) {}

  ngOnInit() {
    this.schedule$ = this.scheduleService.getSchedule()
    this.schedule$
    .subscribe(res => {
      this.doctorSchedule = res.find(doctor => doctor.doctorID === this.user.uid)
    })
    this.user$.subscribe(user => {
      this.user = user
    })
  }
}
