import { Component, OnInit } from '@angular/core';
import { ScheduleService, TimeSlot, TimeSlotWithDoctorID } from '../../shared/services/schedule.service';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-past-schedules',
  templateUrl: './past-schedules.component.html',
  styleUrls: ['./past-schedules.component.scss'],
})
export class PastSchedulesComponent implements OnInit {
  public timeSlots:  Partial<TimeSlotWithDoctorID>[] = [];
  public selectedMonth: number;
  public selectedYear: number;
  public monthYearDisplay: string;
  public months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ];
  user: User
  user$ = this.authService.user$
  today = new Date();

  constructor(
    private scheduleService: ScheduleService,
    private authService: AuthService
  ) {
    this.selectedMonth = this.today.getMonth(); // Current month
    this.selectedYear = this.today.getFullYear(); // Current year
  }

  ngOnInit(): void {
    this.user$.subscribe(user => {
      this.user = user
      this.loadSchedules(user);
    })
  }

  displayName(firstName: string, lastName: string) {
    return `${firstName.charAt(0)} ${lastName}`
  }

  onMonthChange(event: any): void {
    this.selectedMonth = event.target.value;
    this.loadSchedules(this.user);
  }

  onYearChange(event: any): void {
    this.selectedYear = event.target.value;
    this.loadSchedules(this.user);
  }

  loadSchedules(user: User): void {
    this.monthYearDisplay = `Your appointments for ${this.months[this.selectedMonth]} ${this.selectedYear}`;

    if(user.role === 'doctor') {
      this.scheduleService
        .getDoctorSchedules(user.uid, this.selectedYear, this.selectedMonth)
        .subscribe((slots) => {
          this.timeSlots = slots;
        });
      } else {
      this.scheduleService
        .getPatientSchedules(user.uid, this.selectedYear, this.selectedMonth)
        .subscribe((slots) => {
          this.timeSlots = slots;
        });
    }
  }
}
