import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { InformationForm, ProfileService } from '../../shared/services/profile.service';
import { Observable } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { ScheduleService, TimeSlotWithDoctorID } from '../../shared/services/schedule.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  user: User = null
  user$ = this.authService.user$
  personalInformation: InformationForm
  personalInformation$: Observable<InformationForm> = this.profileService.getPersonalInformation(this.user$)
  userSchedulesWithDoctors: TimeSlotWithDoctorID[] = []
  userSchedulesWithDoctors$: Observable<TimeSlotWithDoctorID[]>
  today = new Date();
  public selectedMonth: number;
  public selectedYear: number;

  constructor(
    private authService: AuthService, 
    private profileService: ProfileService, 
    private scheduleService: ScheduleService,
  ) {}

  ngOnInit() {
    this.selectedMonth = this.today.getMonth(); // Current month
    this.selectedYear = this.today.getFullYear(); // Current year
    this.personalInformation$.subscribe(info => {
      this.personalInformation = info
    })
    this.user$.subscribe(user => {
      this.user = user
      if(user.role === 'patient') {
        this.userSchedulesWithDoctors$ = this.scheduleService.getFuturePatientSchedules(this.user.uid, this.selectedYear, this.selectedMonth)
        this.userSchedulesWithDoctors$.subscribe(res => {
          if(res) {
            this.userSchedulesWithDoctors = res
          }
        })
      }
    })
  }

  

}
