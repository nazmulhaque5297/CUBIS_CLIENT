import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoanApplicationService } from 'src/app/services/loan-application.service';
import { LoanApplicationCreateModel } from '../../models/loan-application.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { EditLoanAccountService } from 'src/app/services/edit-loan-account.service';
import { EditLoanAccFullUpdateModel } from '../../models/edit-loan-account.model';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-edit-loan-account',
  templateUrl: './edit-loan-account.component.html',
  styleUrls: ['./edit-loan-account.component.css']
})
export class EditLoanAccountComponent implements OnInit {
  showOtherComponent:boolean = false;
  loanApplicationForm:FormGroup;
  totalGuaranty:number = 0;
  newLoanApplication: LoanApplicationCreateModel;
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private applicationService: LoanApplicationService,
    private editAccountService: EditLoanAccountService,
    private router: Router,
    public datepipe: DatePipe,
  ) { }


  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit(): void {
      this.initializeForm();
  }

  private initializeForm() {
    this.loanApplicationForm = this.fb.group({
      editLoanAccountForm: this.fb.group({
          MemberNo: new FormControl(''),
          AccountType: new FormControl('0'),
          WeeklyDay: new FormControl('0'),
          AccountNo:new FormControl('0'),
          Status: new FormControl(''),
          OpenDate: new FormControl(''),
          LedgerBalance:new FormControl(''),
          SanctionDate:new FormControl(''),
          LoanGraceMonth:new FormControl(''),
          DisbursementDate: new FormControl(''),
          SanctionAmount:new FormControl(''),
          LoanExpiryDate: new FormControl(''),
          DisburesementAmount: new FormControl(''),
          LastTransactionDate: new FormControl(''),
          NoOfInstallment: new FormControl(''),
          InterestRate: new FormControl(''),
          InstallmentAmount:new FormControl(''),
          LoanCalMethod: new FormControl('0'),
          LastInstallmentAmount:new FormControl(''),
          FirstInstallmentDate: new FormControl(''),
          SecondInstallmentDate: new FormControl(''),
          CurrentEffectingDate: new FormControl(''),
          NextEffectingDate: new FormControl(''),
          ODIntPostDate:new FormControl(''),
          DueODInterestAmt: new FormControl(''),
          ODPeriod: new FormControl(''),
          LoanSuretyMemberNo: new FormControl(''),
          CurrPrincipalDue: new FormControl(''),
          CurrInterestDue: new FormControl(''),
          CorrAccountNo: new FormControl(''),
          AutoTrfCorrAC: new FormControl(false),
          OldAccountNo: new FormControl(''),
          SMSService: new FormControl('0'),
          RebatePaid:new FormControl('1'),
          MemberType: new FormControl(''),
          LoanFirstInstlDt: new FormControl(''),
          LoanSecondInstlDt: new FormControl(''),
          AccCorrType: new FormControl(''),
          ProcDate: new FormControl(''),
          EffectDate: new FormControl(''),
          PaidPrincAmt: new FormControl(''),
          PaidIntAmt: new FormControl(''),
          ID: new FormControl(''),
          LoanAppNo: new FormControl(''),
          AtyClass: new FormControl(''),
          LoanSuretyMemberType: new FormControl(''),
        }),
      shareGuarantorInfo: this.fb.group({
        DataShareList: [],
        TotalShareGuarantorAmount: new FormControl(''),
      }),
      depositGuarantorInfo: this.fb.group({
        DataDepositList:[],
        TotalDepositGuarantorAmount: new FormControl(''),
      }),
      propertyGuarantorInfo: this.fb.group({
        DataPropertyList:[],
        TotalPropertyGuarantorAmount: new FormControl(''),
      })
    });
  }


  public onCreate():void{

    var fv=this.loanApplicationForm.value.editLoanAccountForm;
    console.log('this is fv value',fv);
    if(fv.MemberNo==""||fv.AccountType==0||fv.AccountNo==0){
      alert("Please fillup all the required filed.");
    }
    else{
      this.spinner.show();
      var data = new EditLoanAccFullUpdateModel();
      data = this.editAccountService.UpdateDataSet(fv);
      console.log(data);
      this.editAccountService.UpdateData(data).pipe(takeUntil(this.destroy$)).subscribe((x:any)=>{
        this.spinner.hide();
        if(x==1){
          alert("Data Updated Successfully.");
          location.reload();
        }
        else{
          alert("Data did not updated.");
        }
        this.spinner.hide();
      });
    }
    
    // this.newLoanApplication = this.newLoanApplicationService.setNewLoanApplication(fv);    
    // console.log(this.newLoanApplication);
    // if(confirm("Are you you want to submit information?")){
    //   this.applicationService.Insert(this.newLoanApplication).pipe(takeUntil(this.destroy$)).subscribe(data=>{
    //     if(data.Success){
    //       this.toaster.success(data.Message + data.LastApplicationNo, "Success");
    //       this.ngOnInit();
    //     }
    //     else{
    //       this.toaster.error(data.Message, "Error");
    //     }
    //   });
    // }
    
  }

  parentFunction(data){
    this.showOtherComponent = true;
    if(data.singleValue==0){
      this.loanApplicationForm.value.shareGuarantorInfo.DataShareList = data.Data;
      this.loanApplicationForm.value.TotalShareGuarantorAmount = (data.Data.Length!=undefined && data.Data.Length!=0)?data.Data[0].ShareAmount:0;
    }
    else{
      this.totalGuaranty+=Number(data.Data);
      //this.loanApplicationForm.controls['TotalGaurantyAmount'].setValue(this.totalGuaranty);
    }
  }

  exitPage(){
    this.router.navigate(['accounting/']);
  }

}


