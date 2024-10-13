import { Component, Input } from '@angular/core';

import { InformationForm } from '../../../../shared/services/profile.service';
import { ScheduleService, TimeSlot, TimeSlotWithDoctorID } from '../../../../shared/services/schedule.service';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.scss'
})
export class PatientDashboardComponent {
  @Input() userInformation: InformationForm 
  @Input() patientSchedule: TimeSlotWithDoctorID[]

  constructor(private scheduleService: ScheduleService) {}

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
    this.scheduleService.removeTimeSlot(appointment, null, item.doctorID)
  }

}
