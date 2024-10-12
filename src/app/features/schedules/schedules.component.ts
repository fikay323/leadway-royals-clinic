import { Component } from '@angular/core';
import { IndividualDoctorSchedule, ScheduleService } from '../../shared/services/schedule.service';
import { map, Observable } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrl: './schedules.component.scss'
})
export class SchedulesComponent {
  doctorsSchedules: IndividualDoctorSchedule[]
  schedule$: Observable<IndividualDoctorSchedule[]>
  user: User;
  user$: Observable<User> = this.authService.user$

  constructor(private scheduleService: ScheduleService, private authService: AuthService) {}

  ngOnInit() {
    this.schedule$ = this.scheduleService.getSchedule()
    this.schedule$
    .subscribe(res => {
      this.doctorsSchedules = res
    })
    this.user$.subscribe(currentUser => {
      this.user = currentUser
    })    
  }

}
