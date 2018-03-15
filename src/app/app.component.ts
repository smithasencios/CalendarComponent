import { Component, OnInit, OnDestroy } from '@angular/core';
import { InputModel } from './models/input.model';
import { Day } from './models/day.model';
import { Week } from './models/week.model';
import { Month } from './models/month.model';
import { Year } from './models/year.model';
import * as moment from 'moment';
import { from } from 'rxjs/observable/from';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {


  title = 'app';
  inputModel: InputModel;

  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  weeks: Week[] = [];
  months: Month[] = [];
  years: Year[] = [];
  showErrors: boolean = false;

  ngOnInit(): void {
    this.inputModel = new InputModel(new Date(), 0, 'US');
  }

  ngOnDestroy(): void {

  }

  cleanObject() {
    this.weeks = [];
    this.months = [];
    this.years = [];
    //this.inputModel = new InputModel(new Date(), 0, 'US');
  }
  generateCalendar(): void {
    this.cleanObject();
    this.showErrors = false;
    if (!this.validate()) {
      this.showErrors = true;
      return;
    }
    let days: Day[] = this.getDays();

    this.getWeeks(days);
    this.getMonths();
    this.getYears();

  }

  validate(): boolean {

    if (this.inputModel.days == null) return false;
    if (this.inputModel.days <= 0) return false;
    return true;
  }
  getDays() {
    const newInput = { ...this.inputModel };
    let currentDate: Date = newInput.startDate;

    let days: Day[] = [];
    for (let index = 0; index < newInput.days; index++) {
      currentDate.setDate(currentDate.getDate() + 1);
      let day: Day = new Day(currentDate.getDate(), currentDate.getFullYear(),
        currentDate.getMonth() + 1, currentDate.getDay(), moment(currentDate).week());
      days.push(day);
    }

    return days;
  }

  getWeeks(days: Day[]): void {
    const dayObservable = from(days);
    const weekObservable = dayObservable.pipe(
      groupBy(x => x.id),
      mergeMap(group => group.pipe(toArray())),
    );

    const subscribe = weekObservable.subscribe(val => {
      let week: Week = new Week(val, val[0].numberOfWeek, val[0].month, val[0].year);
      this.weeks.push(week);
    });

    this.weeks.map(week => {
      if (week.days.length < 7) {
        for (let index = 0; index < 7; index++) {
          if (!week.days.find(x => x.numberOfDay === index)) {
            let defaultDay: Day = new Day(0, week.days[0].year, week.days[0].month, index, week.numberOfWeek)
            week.days.push(defaultDay)
          }
        }
      }
      week.days.sort((a, b) => a.numberOfDay - b.numberOfDay);
    });

    this.weeks.sort((a, b) => a.numberOfWeek - b.numberOfWeek);

  }

  getMonths(): void {
    const weeksObservable = from(this.weeks);
    const monthObservable = weeksObservable.pipe(
      groupBy(x => x.id),
      mergeMap(group => group.pipe(toArray())),
    );

    monthObservable.subscribe(val =>
      this.months.push(new Month(this.monthNames[val[0].numberOfMonth - 1], val[0].numberOfMonth, val[0].year, val)));
  }

  getYears(): void {
    const monthsObservable = from(this.months);
    const yearObservable = monthsObservable.pipe(
      groupBy(x => x.year),
      mergeMap(group => group.pipe(toArray())),
    );

    yearObservable.subscribe(
      val => {
        this.years.push(new Year(val[0].year, val));
        this.inputModel = new InputModel(new Date(), 0, 'US');
      }
    );

    this.years.sort((a, b) => a.numberOfYear - b.numberOfYear);

  }


}
