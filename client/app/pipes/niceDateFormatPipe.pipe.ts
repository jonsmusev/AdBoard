import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'niceDateFormatPipe',
})
export class niceDateFormatPipe implements PipeTransform {
  transform(value: string) {

    var _value = new Date(value);
    var dif = ((((new Date()).getTime() - _value.getTime()) / 1000) /86400);

//    var _value = new Number(value);
//    var dif = Math.floor(((Date.now() - _value)/1000)/86400);
//      var dif = 20;

    if ( dif < 30 ){
      return convertToNiceDate(value);
    }else{
      var datePipe = new DatePipe("en-US");
      value = datePipe.transform(value, 'dd MMM yyyy');
      return value;
    }
  }
}

function convertToNiceDate(time: string) {
  var date = new Date(time),
    diff = (((new Date()).getTime() - date.getTime()) / 1000),
    daydiff = Math.floor(diff / 86400);

  if (isNaN(daydiff) || daydiff < 0 || daydiff >= 31)
    return '';

  return daydiff == 0 && (
    diff < 60 && "Только что" ||
    diff < 120 && "1 минуту назад" ||
    diff < 300 && Math.floor(diff / 60) + " минуты назад" ||
    diff < 1260 && Math.floor(diff / 60) + " минут назад" ||
    diff < 1500 && Math.floor(diff / 60) + " минуты назад" ||
    diff < 1860 && Math.floor(diff / 60) + " минут назад" ||
    diff < 1920 && Math.floor(diff / 60) + " минута назад" ||
    diff < 2100 && Math.floor(diff / 60) + " минуты назад" ||
    diff < 2460 && Math.floor(diff / 60) + " минут назад" ||
    diff < 2520 && Math.floor(diff / 60) + " минута назад" ||
    diff < 2700 && Math.floor(diff / 60) + " минуты назад" ||
    diff < 3060 && Math.floor(diff / 60) + " минут назад" ||
    diff < 3120 && Math.floor(diff / 60) + " минута назад" ||
    diff < 3300 && Math.floor(diff / 60) + " минуты назад" ||
    diff < 3600 && Math.floor(diff / 60) + " минут назад" ||
    diff < 7200 && "1 час назад" ||
    diff < 18000 && Math.floor(diff / 3600) + " часа назад" ||
    diff < 86400 && Math.floor(diff / 3600) + " часов назад") ||
    daydiff == 1 && "Вчера" ||
    daydiff < 5 && daydiff + " дня назад" ||
    daydiff < 7 && daydiff + " дней назад" ||
    daydiff < 35 && Math.ceil(daydiff / 7) + " недели назад";
}
