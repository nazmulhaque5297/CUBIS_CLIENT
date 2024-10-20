export class BudgetInputLoadModel{
    BegYear: number;
    EndYear: number;
    BudgetYear: string;
    AccTypeList: BudgetParameterAccType[];
    DataList:BudgetParameterDataList[];
    July: string;
    August: string;
    September: string;
    October: string;
    November: string;
    December: string;
    January: string;
    February: string;
    March: string;
    April: string;
    May: string;
    June: string;
}
export class BudgetParameterAccType{
    AccTypeCode:number;
    AccTypeDescription: string;
}
export class BudgetParameterDataList{
    BudgetYear: string;
    GLCode: number;
    Amount: number;
    For: string;
}

export class ProfitLossGridModel{
    Id: number;
    ExpCode:number;
    ExpCodeDesc:string;
    ProvCode:number;
    ProvCodeDesc:string;
    Rate:number;
    Amount:number;
}