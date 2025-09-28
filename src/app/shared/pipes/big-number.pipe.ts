import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'bigNumber',
  standalone: true
})
export class BigNumberPipe implements PipeTransform {
  transform(value: string | bigint, separator: string = '.'): string {
    if (!value) return '';
    const str = value.toString();
    const regex = /\B(?=(\d{3})+(?!\d))/g;
    return str.replace(regex, separator);
  }
}
