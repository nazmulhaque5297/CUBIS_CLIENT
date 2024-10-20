import { IdDescription } from "src/app/interfaces/id-description"

export class GLAccountStatementPageLoadModel{
    AllUnitDropDown:IdDescription[] = [];
    AllHeaderCodeDropDown:IdDescription[]=[];
    MainHeadCodeDropDown:IdDescription[]=[];
    AllGLCodeDropDown:IdDescription[] = [];
    SubHeadCodeDropDown:IdDescription[]=[];
    SelectDetailsDropDown:IdDescription[]=[];
    FromDate: string = '';
    ToDate: string = '';
    // ProcDate: string = '';
    // GLCashCode: number;
    // CashCodeDesc: number;


}
// export class CashCollectionMemberNoChngModel{
//     Success: boolean;
//     Message: string;
//     MemType:number;
//     MemName:string;
// }