import { IdDescription } from "src/app/interfaces/id-description"

export class LoanDefaulterReportPageLoadModel{
    AllAccountDropdown:IdDescription[] = [];
    AllCollectorDropdown:IdDescription[] = [];
    AllGroupDropdown:IdDescription[] = [];
    AllYearDropdown:IdDescription[] = [];
    AllMonthDropdown:IdDescription[] = [];
    ProcessDate:string='';
}

export class AccDescModel
{
    AccTypeModeDesc:string='';
}


export class MemNameModel
{
    MemName:string='';
}