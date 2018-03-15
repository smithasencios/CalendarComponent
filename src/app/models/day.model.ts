export class Day {
    constructor(public date: number,
        public year: number,
        public month: number,
        public numberOfDay: number,
        public numberOfWeek: number,
        public id: string = `${numberOfWeek}${month}${year}`,
        public isWeekend: boolean = (numberOfDay == 0 || numberOfDay == 6),
        public isDisabled: boolean = (date == 0)) {

    }
}