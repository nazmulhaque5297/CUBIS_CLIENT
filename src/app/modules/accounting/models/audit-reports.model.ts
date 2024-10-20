import { IdDescription } from "src/app/interfaces/id-description"

export class AuditReportPageLoadModel{
    AllUserIdDropdown:IdDescription[] = [];
    AllFieldsDropdown:IdDescription[] = [];
    AllMemberDropdown:IdDescription[] = [];
    AllAccTypeDropdown:IdDescription[] = [];
    ProcessDate:string='';
    FromDate:string='';
    ToDate:string='';

}