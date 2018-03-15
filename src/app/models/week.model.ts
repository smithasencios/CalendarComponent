import { Day } from './day.model';

export class Week {
    constructor(public days: Day[],
        public numberOfWeek: number,
        public numberOfMonth: number,
        public year: number,
        public id:string = `${numberOfMonth}${year}`) { }
}