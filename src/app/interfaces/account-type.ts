
import { IdDescription } from "./id-description";

export class ShowHideAccountTypeField{
    ShowAccountType:boolean=true;
    ShowDepositMode:boolean=false;
    ShowWeeklyDay:boolean=false;
    ShowFineMode:boolean=false;
    ShowUpdateButton:boolean;
}

export class AccountTypeInputHelp extends ShowHideAccountTypeField{
    GeneralAccountTypeList: IdDescription[];
    CorrAccountTypeList: IdDescription[];
    AccountTypeList: IdDescription[];
    MemberTypeList: IdDescription[];
    AccountFlagList: IdDescription[];
    AccountModeList: IdDescription[];
    AccountClassList: IdDescription[];
    ProvisionList: IdDescription[];
    TransactionTypeList: IdDescription[];
    PaymentModeList: IdDescription[];
    FineModeList: IdDescription[];
    ShowSubmitButton: boolean;
}

export class AccountTypeViewModel extends ShowHideAccountTypeField{

    Details:AccountTypeDetailsModel=new AccountTypeDetailsModel();
    MendatoryDepartmentFlag:string;
    ProductGLDesc:string;
    ProvisionGLDesc:string;
    InterestGLDesc:string;
    ExcessIntGLDesc:string;
    ExpenseGLDesc:string;
    AccSuretyGLDesc:string;
    AccSuretyIntGLDesc:string;
    AccBonusGLDesc:string;
    AccFineGLDesc:string;
    AccClosingFeeGLDesc:string;
    AccProcessFeeGLDesc:string;
    AccDepositFeeGLDesc:string;
    ExpenseMode:string;
    ProcessFeeGLCodeLabel:string;
    ErrorMessage:string;
    WeeklyModeList:IdDescription[];
}

export class AccountTypeDetailsModel{
    AccTypeCode:number=0;
    AccTypeGuaranty:number;
    AccCorrType:number=0;
    AccTypeDescription:string;
    AccTypeShortDescription:string;
    AccTypeClass:number=0;
    AccTypeClassDesc:string;
    AccFlag:number=0;
    AccTypeMode:number=0;
    AccCertNo:any=0;
    AccDivident: any=0;
    AccessT1:number;
    AccessT2:number;
    AccessT3:number;
    AccProvisionMode:number=0;
    AccDepositMode:number;
    AccDepositModeDesc:string;
    AccExpenseMode:number=0;
    AccWeeklyDay:number=0;
    AccDepRoundingBy:number;
    AccFineMode:number=0;

    AccProductGLCode:number;
    AccProvisionGLCode:number;
    AccInterestGLCode:number;
    AccExcessIntGLCode:number;
    AccExpenseGLCode:number;
    AccFineGLCode:number;
    AccClosingFeeGLCode:number;
    AccProcessFeeGLCode:number;
    AccDepositFeeGLCode:number;
    AccBonusGLCode:number;
    AccSuretyGLCode:number;
    AccSuretyIntGLCode:number;
}

export interface AccountTypeDisplayModel{
    AccountTypeId:number;
    ClassDescription:string;
    TypeDescription:string;
}

export interface AccountTypeGLDetailsModel extends IdDescription{
    Message:string;
    Invalid:boolean;
}

export enum AccountTypeGLType{
        ProductGLCode=1,
        ProvisionGLCode=2,
        InterestGLCode=3,
        ExcessIntGLCode=4,
        ExpenseGLCode=5,
        SuretyGLCode=6,
        SuretyIntGLCode=7,
        BonusGLCode=8,
        FineGLCode=9,
        ClosingFeeGLCode=10,
        ProcessFeeGLCode=11,
        DepositFeeGLCode=12
}
