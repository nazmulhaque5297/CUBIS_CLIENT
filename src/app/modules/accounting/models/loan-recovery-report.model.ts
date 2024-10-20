import { IdDescription } from "src/app/interfaces/id-description"

export class LoanRecoveryReportPageLoadModel{
    AllAccountDropdown:IdDescription[] = [];
    AllMonthDropdown:IdDescription[] = [];
    AllYearDropdown:IdDescription[] = [];
    AllCollectorDropdown:IdDescription[] = [];
    AllGroupDropdown:IdDescription[] = [];
    ProcessDate:string='';

}