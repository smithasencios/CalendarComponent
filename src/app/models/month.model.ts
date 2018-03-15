import { Week } from './week.model';

export class Month {
    constructor(public name: string,
        public month:number,
        public year: number,
        public weeks: Week[]
        ) { }
    
    
}