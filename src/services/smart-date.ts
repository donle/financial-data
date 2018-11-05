import * as moment from 'moment';

export namespace SmartDate {
  const dayBreakInMilliSecond = 1000 * 60 * 60 * 24;
  export const getTheNumberOfWeeks = (date: Date) => {
    const year = date.getFullYear();
    const firstDateOfCurrentYear = new Date(year, 0, 1);
    const firstWeekFixed = 6 - firstDateOfCurrentYear.getDay();
    const daysToDate =
      (date.getTime() - firstDateOfCurrentYear.getTime()) /
        dayBreakInMilliSecond -
      firstWeekFixed;
    return Math.floor(daysToDate / 7) + (daysToDate % 7 === 0 ? 0 : 1);
  };

  export const getDays = (from: Date, to: Date) => {
    return (to.getTime() - from.getTime()) / dayBreakInMilliSecond;
  };

  export const getCurrentWeek = (date: Date) => {
    const daysInWeek = date.getDay();
    const days = [];
    for (let i = daysInWeek; i >= 0; i--) {
      days.push(new Date(date.getTime() - i * dayBreakInMilliSecond));
    }
    for (let i = daysInWeek + 1; i <= 6; i++) {
      days.push(new Date(date.getTime() + i * dayBreakInMilliSecond));
    }
    return days;
  };
}
