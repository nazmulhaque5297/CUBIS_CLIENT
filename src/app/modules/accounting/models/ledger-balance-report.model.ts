import { IdDescription } from "src/app/interfaces/id-description"

export class LedgerBalanceReportPageLoadModel{
    ProcessDate:string='';
    FromDate:string='';
    ToDate:string='';
    AllReportHeadDropdown:IdDescription[]=[];
    AllGroupDropdown:IdDescription[]=[];

}


export class AccountLedgerBalanceReport{
    MobileNo: string;
    Balance: string;
}