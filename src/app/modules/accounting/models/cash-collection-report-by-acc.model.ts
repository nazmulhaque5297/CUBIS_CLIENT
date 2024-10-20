import { IdDescription } from "src/app/interfaces/id-description"

export class CashCollectionAccPageLoadModel{
    AccountTypeDropDown:IdDescription[] = [];
    AllCollectorTypeDropDown:IdDescription[] = [];
    AllGroupNameDropDown:IdDescription[] = [];
    AllUserIdTypeDropDown:IdDescription[] = [];
    FromDate: string = '';
    ToDate: string = '';
    ProcDate: string = '';
    GLCashCode: number;
    CashCodeDesc: number;
    BegFinYear: string = '';
    IdsNo:number;
    IdsName:string='';

}
export class CashCollectionMemberNoChngModel{
    Success: boolean;
    Message: string;
    MemType:number;
    MemName:string;
}