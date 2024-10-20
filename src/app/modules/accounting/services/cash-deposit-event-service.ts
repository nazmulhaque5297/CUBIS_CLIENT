import { FormGroup } from "@angular/forms";
import { SelectListFilter } from "src/app/filters/select-list-filter";
import { IdDescription } from "src/app/interfaces/id-description";
import { CashDepositInputHelp } from "../models/cash-deposit.model";


export class CashDepositEventService{

    private readonly inputHelpData:CashDepositInputHelp;
    depositForm: FormGroup;
    inputFieldValue:string='';
    ddlValue:number=0;

    constructor(_paymentWithdrawalForm: FormGroup,_inputHelp:CashDepositInputHelp){
        this.inputHelpData=_inputHelp;
        this.depositForm=_paymentWithdrawalForm;
    }

    public setAccountType(value:number){
        var item= new SelectListFilter().getItem(this.inputHelpData.AccountTypeList,value);
        this.checkAndSetValue(item);
        this.depositForm.controls['AccountType'].setValue(this.ddlValue);
        this.depositForm.controls['AccountTypeCode'].setValue(this.inputFieldValue);
    }

    private checkAndSetValue(item:IdDescription){
        this.ddlValue=item!=null?item.Id:0;
        this.inputFieldValue=item!=null?item.Id.toString():'';
    }

}