import { IdDescription } from "src/app/interfaces/id-description"

export class csLoanApplicationReportPageLoadModel{
    AllAccDropdown:IdDescription[] = [];
    AllMemberDropdown:IdDescription[] = [];
    AllCollectorDropdown:IdDescription[] = [];
    AllGroupDropdown:IdDescription[] = [];
    AllUserDropdown:IdDescription[] = [];
    AllLoanDropdown:IdDescription[] = [];
    ProcessDate:string='';
    FromDate:string='';
    ToDate:string='';

}