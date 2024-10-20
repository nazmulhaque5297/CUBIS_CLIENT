export interface IHolidayType{
    HolType?:number
    HolTypeDescription?:string
}

export interface IWeekDay{
    HolWeekDay1?:number
    HolWeekDayName1?:string
    HolWeekDay2?:number
    HolWeekDayName2?:string
}

export interface INationalHolidayCreate{
    HolidayDate?:string
    HolType?:number
    HolNote?:string
}

export interface INationalHolidayViewModel{
    HolDateVw?:string
    HolType?:string
    HolTypeDesc?:string
    HolNote?:string
    HolDayName?:string
}

export class cashCollection{
    RepColumnName: string;
    RepColumns: number;
    CheckedValue:any[];
}