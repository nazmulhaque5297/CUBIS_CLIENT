import { IdDescription } from "src/app/interfaces/id-description"

export class AccountOpenCloseReportPageLoadModel{
    AllAccountDropdown:IdDescription[] = [];
    AllCollectorCodeDropdown:IdDescription[] = [];
    AllGroupCodeDropdown:IdDescription[] = [];
    AllGenderDropdown:IdDescription[] = [];
    ProcessDate:string='';
    FromDate:string='';
    ToDate:string='';

}