import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'ordinalDateTime'
})
export class OrdinalDateTimePipe implements PipeTransform {

  transform(value: string | Date): string {
    const datePipe = new DatePipe('en-US');
    const date = new Date(value);
    const day = date.getDate();

    const suffix = this.getOrdinalSuffix(day);
    const formattedDate = datePipe.transform(value, 'd MMM'); // Formats date as "6 Nov"
    const formattedTime = datePipe.transform(value, 'h:mm a'); // Formats time as "9:00 AM"

    return `${day}${suffix} of ${formattedDate?.split(' ')[1]} by ${formattedTime}`; // "6th of Nov by 9:00 AM"
  }

  getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return 'th'; // Handles 11th to 20th
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }
}
