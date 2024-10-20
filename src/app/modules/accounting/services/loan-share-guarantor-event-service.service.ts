import { Injectable } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { SelectListFilter } from "src/app/filters/select-list-filter";
import { IdDescription } from "src/app/interfaces/id-description";
import { ShareGuarantorDetailsModel, LoanAccountTypeViewModel, LoanAmountViewModel, LoanApplicationInputHelp, LoanMemberViewModel, MemberNameModel } from "../models/loan-application.model";


@Injectable({
  providedIn: 'root'
})
export class LoanShareGuarantorEventServiceService {
  shareGuarantorInfoForm: FormGroup;

  constructor(_shareGuarantorInfoForm:FormGroup) {
    this.shareGuarantorInfoForm = _shareGuarantorInfoForm;
  }

  public setShareGuarantorDetails(item:ShareGuarantorDetailsModel):void{
    console.log('coming here ' , item)
    this.shareGuarantorInfoForm.controls['MemberNo'].setValue(item.MemberNo);
    this.shareGuarantorInfoForm.controls['MemberName'].setValue(item.MemberName);
    this.shareGuarantorInfoForm.controls['ShareAmount'].setValue(item.ShareAmount);
    this.shareGuarantorInfoForm.controls['NoOfGuarantor'].setValue(item.NoOfGuarantor);
    this.shareGuarantorInfoForm.controls['MemberType'].setValue(item.MemberType);
  }

}
