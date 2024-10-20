import { FormGroup } from "@angular/forms";
import { SelectListFilter } from "src/app/filters/select-list-filter";
import { IdDescription } from "src/app/interfaces/id-description";
import { WithdrawalInputHelpViewModel } from "../models/payment-withdrawal.model";


export class PaymentWithdrawalEventService{

    private readonly inputHelpData:WithdrawalInputHelpViewModel;
    paymentWithdrawalForm: FormGroup;
    inputFieldValue:string='';
    ddlValue:number=0;

    constructor(_paymentWithdrawalForm: FormGroup,_inputHelp:WithdrawalInputHelpViewModel){
        this.inputHelpData=_inputHelp;
        this.paymentWithdrawalForm=_paymentWithdrawalForm;
    }

    public setAccountType(value:number){
        var item= new SelectListFilter().getItem(this.inputHelpData.AccountTypeList,value);
        this.checkAndSetValue(item);
        this.paymentWithdrawalForm.controls['AccountTypeId'].setValue(this.ddlValue);
        this.paymentWithdrawalForm.controls['AccountTypeCode'].setValue(this.inputFieldValue);
    }

    public setTransactionType(value:number){
        var item= new SelectListFilter().getItem(this.inputHelpData.TransactionTypeList,value);
        this.checkAndSetValue(item);
        this.paymentWithdrawalForm.controls['TransactionType'].setValue(this.ddlValue);
        this.paymentWithdrawalForm.controls['TransactionTypeCode'].setValue(this.inputFieldValue);
    }

    private checkAndSetValue(item:IdDescription){
        this.ddlValue=item!=null?item.Id:0;
        this.inputFieldValue=item!=null?item.Id.toString():'';
    }

}