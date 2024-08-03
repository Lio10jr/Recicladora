import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';
@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {

  transform(value: Date | string, format: string = 'dd/MM/yyyy', locale: string = 'es-EC'): string | null {
    if (!value) return null;

    // Convert value to Date object if it's a string
    const date = typeof value === 'string' ? new Date(value) : value;
    
    // Format the date using Angular's formatDate function
    return formatDate(date, format, locale);
  }

}
