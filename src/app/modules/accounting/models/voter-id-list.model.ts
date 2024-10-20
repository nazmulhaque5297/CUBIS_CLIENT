import { IdDescription } from "src/app/interfaces/id-description"

export class VoterIdListPageLoadModel{
    AccountType1DropDown:IdDescription[] = [];
    AccountType2DropDown:IdDescription[] = [];
    GenderDropDown:IdDescription[] = [];
    WithWithoutPicDropDown:IdDescription[] = [];
    FromDate: string = '';
    ToDate: string = '';
    ProcDate:string='';
    FDateMemStatReport: string ="";

}