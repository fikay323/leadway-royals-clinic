import { Component, Input } from '@angular/core';

import { InformationForm } from '../../../../shared/services/profile.service';
import { ScheduleService, TimeSlot, TimeSlotWithDoctorID } from '../../../../shared/services/schedule.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { User } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.scss'
})
export class PatientDashboardComponent {
  @Input() user: User
  @Input() userInformation: InformationForm 
  @Input() patientSchedule: TimeSlotWithDoctorID[]

  constructor(
    private scheduleService: ScheduleService,
    private notificationService: NotificationService,
  ) {}

  greet() {
    const now = new Date();
    const hour = now.getHours();
  
    if (hour >= 0 && hour < 12) {
      return "Good Morning";
    } else if (hour >= 12 && hour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";   
    }
  }

  isPersonalInformationPresent() {
    return Object.keys(this.userInformation).length > 0
  }

  getFirstLetter(word: string) {
    return word.substr(0,1)
  }

  cancelAppointment(item: TimeSlotWithDoctorID) {
    const appointment: TimeSlot = {
      slotID: item.slotID,
      isAvailable: item.isAvailable,
      startTime: item.startTime,
      endTime: item.endTime,
      bookerID: item.bookerID,
      bookerName: item.bookerName,
      bookerPersonalInformation: item.bookerPersonalInformation
    }
    console.log(item)
    this.scheduleService.removeTimeSlot(appointment, null, item.doctorID).subscribe(res => {
      this.notificationService.alertSuccess('Appointment cancelled successfully')
    })
  }

}
