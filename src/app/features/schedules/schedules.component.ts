import { Component } from '@angular/core';
import { IndividualDoctorSchedule, ScheduleService } from '../../shared/services/schedule.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrl: './schedules.component.scss'
})
export class SchedulesComponent {
  businessDays: Date[] = [];
  timeSlots = [
    { startTime: '09:00', endTime: '10:00' },
    { startTime: '10:00', endTime: '11:00' },
    { startTime: '11:00', endTime: '12:00' },
  ];
  doctorsSchedules: IndividualDoctorSchedule[]
  schedule$: Observable<IndividualDoctorSchedule[]>

  constructor(private scheduleService: ScheduleService) {}

  ngOnInit() {
    this.schedule$ = this.scheduleService.getSchedule()
    this.schedule$
    .subscribe(res => {
      this.doctorsSchedules = res
    })
    this.getNextBusinessDays(7)
  }

  getNextBusinessDays(days: number) {
    let date = new Date();
    while (this.businessDays.length < days) {
      date.setDate(date.getDate() + 1);
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        this.businessDays.push(new Date(date));
      }
    }
  }

  // Check if the timeslot is booked on a particular day
  isBooked(day: Date, slot: { startTime: string; endTime: string }, doctor: IndividualDoctorSchedule): boolean {
    const dateStr = day.toISOString().split('T')[0];
    return doctor.timeSlots.some(
      (timeSlot) =>
        timeSlot.startTime.split('T')[0] === dateStr && timeSlot.startTime.split('T')[1].slice(0, 5) === slot.startTime && !timeSlot.isAvailable
    );
  }

  bookSlot(day: Date, slot: { startTime: string; endTime: string }, doctor: IndividualDoctorSchedule) {
    // Add your booking logic here
    console.log(`Booking slot for ${doctor.doctorID} on ${day} from ${slot.startTime} to ${slot.endTime}`);
  }

}
