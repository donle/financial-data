import * as moment from 'moment';

export abstract class SmartDate {
  public static getTheNumberOfWeeks = (date: Date) => {
    const year = date.getFullYear();
    const firstDateOfCurrentYear = new Date(year, 0, 1);
    const firstWeekFixed = 6 - firstDateOfCurrentYear.getDay();
    const daysToDate =
      (date.getTime() - firstDateOfCurrentYear.getTime()) /
        SmartDate.dayBreakInMilliSecond -
      firstWeekFixed;
    return Math.floor(daysToDate / 7) + (daysToDate % 7 === 0 ? 0 : 1);
  }

  public static getDays = (from: Date, to: Date) => {
    return (to.getTime() - from.getTime()) / SmartDate.dayBreakInMilliSecond;
  }

  public static getCurrentWeek = (date: Date) => {
    const daysInWeek = date.getDay();
    const days = [];
    for (let i = daysInWeek; i >= 0; i--) {
      days.push(new Date(date.getTime() - i * SmartDate.dayBreakInMilliSecond));
    }
    for (let i = daysInWeek + 1; i <= 6; i++) {
      days.push(new Date(date.getTime() + i * SmartDate.dayBreakInMilliSecond));
    }
    return days;
  }

  private static dayBreakInMilliSecond = 1000 * 60 * 60 * 24;
  private constructor() {}
}
