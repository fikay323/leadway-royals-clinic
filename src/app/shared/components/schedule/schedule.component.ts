import { Component, Input, input } from '@angular/core';
import { from, map, Observable, of } from 'rxjs';

import { IndividualDoctorSchedule, ScheduleService, TimeSlot } from '../../services/schedule.service';
import { User } from '../../models/user.model';
import { NotificationService } from '../../services/notification.service';
import { ChatService } from '../../services/chat.service';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';

interface name {
  firstName: string,
  lastName: string,
}
@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent {
  @Input() doctorSchedule: IndividualDoctorSchedule
  @Input() isDashboard: boolean
  @Input() booker: User
  businessDays: Date[] = [];
  timeSlots = [
    { startTime: '09:00', endTime: '10:00' },
    { startTime: '10:00', endTime: '11:00' },
    { startTime: '11:00', endTime: '12:00' },
  ];

  constructor(
    private scheduleService: ScheduleService, 
    private notificationService: NotificationService,
    private profileService: ProfileService,
    private chatService: ChatService,
    private router: Router,
  ) {}
  
  ngOnInit() {
    this.getNextBusinessDays(7)
    this.profileService.getPersonalInformation(of(this.booker)).subscribe(info => {
      this.booker.personalInformation = info
    })
  }

  chatDoctor(doctor: IndividualDoctorSchedule) {
    const doctorName: name = {
      firstName: doctor.doctorFirstName,
      lastName: doctor.doctorLastName
    }
    const userName: name = {
      firstName: this.booker.firstName,
      lastName: this.booker.lastName,
    }
    this.chatService.initializeChat(doctor.doctorID, this.booker.uid, doctorName, userName, 'Hello').subscribe(res => {
      this.router.navigate(['/main-app', 'chats'])
    })
  }

  getFirstLetter(name: string) {
    return name.substring(0,1)
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
        timeSlot.startTime.split('T')[0] === dateStr && timeSlot.startTime.split('T')[1].slice(0, 5) === slot.startTime && !timeSlot.isAvailable && timeSlot.bookerID !== this.booker.uid
    );
  }
  
  isBookedByCurrentUser(day: Date, slot: { startTime: string; endTime: string }, doctor: IndividualDoctorSchedule) {
    const dateStr = day.toISOString().split('T')[0];
    return doctor.timeSlots.some(
      (timeSlot) =>
        timeSlot.startTime.split('T')[0] === dateStr && timeSlot.startTime.split('T')[1].slice(0, 5) === slot.startTime && !timeSlot.isAvailable && timeSlot.bookerID === this.booker.uid
    );
  }
  
  getTheClickedSlotDetailsAndRemove(day: Date, slot: { startTime: string; endTime: string }, doctor: IndividualDoctorSchedule) {
    const dateStr = day.toISOString().split('T')[0];
    const clickedSlot = doctor.timeSlots.find(
      (timeSlot) =>
        timeSlot.startTime.split('T')[0] === dateStr && timeSlot.startTime.split('T')[1].slice(0, 5) === slot.startTime && !timeSlot.isAvailable && timeSlot.bookerID === this.booker.uid
    );
    this.scheduleService.removeTimeSlot(clickedSlot, doctor).subscribe()
  }

  bookSlot(day: Date, slot: any,  doctor: IndividualDoctorSchedule, isBooked: boolean, isBookedByCurrentUser: boolean) {
    if(this.booker.role === 'doctor') {
      this.notificationService.alertError('Pls login as a patient to book an appointment with a doctor')
      return
    } else if(isBooked && !isBookedByCurrentUser) {
      this.notificationService.alertError('This session has been booked by another patient, pls book another session')
      return
    } else if(Object.keys(this.booker.personalInformation).length === 0) {
      this.notificationService.alertError('Pls set your personal information in the settings before booking an appointment')
      return
    }
    const datePart = day.toISOString().split('T')[0]
    const clickedSlot: TimeSlot = { 
      startTime: `${datePart}T${slot.startTime}:00.000Z`,
      endTime: `${datePart}T${slot.endTime}:00.000Z`,
      bookerID: this.booker.uid,
      bookerName: {
        firstName: this.booker.firstName,
        lastName: this.booker.lastName
      },
      bookerPersonalInformation: this.booker.personalInformation,
      isAvailable: false,
      slotID: this.scheduleService.generateUUID()
    }
    if(!isBookedByCurrentUser) {
      this.scheduleService.bookTimeSlot(clickedSlot, doctor, this.booker.email).subscribe()
    } else {
      this.getTheClickedSlotDetailsAndRemove(day, slot, doctor)
    }
  }

}
