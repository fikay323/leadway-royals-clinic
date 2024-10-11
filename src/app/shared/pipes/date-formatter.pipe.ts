import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatterPipe implements PipeTransform {

  transform(value: Date | string): string {
    const date = new Date(value);

    // Extract day, month, and year
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();

    // Format the final string
    return `${day} ${month} ${year}`;
  }

}
