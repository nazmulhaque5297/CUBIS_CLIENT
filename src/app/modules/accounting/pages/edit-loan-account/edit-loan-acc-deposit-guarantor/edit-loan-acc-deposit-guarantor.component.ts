import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormGroupDirective, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EditLoanAccountService } from 'src/app/services/edit-loan-account.service';
import { LoanApplicationService } from 'src/app/services/loan-application.service';
import { DepositGuarantorDisplayModel, DepositDisplayModel, DepositGuarantorDetailsModel } from '../../../models/loan-application.model';

@Component({
  selector: 'app-edit-loan-acc-deposit-guarantor',
  templateUrl: './edit-loan-acc-deposit-guarantor.component.html',
  styleUrls: ['./edit-loan-acc-deposit-guarantor.component.css']
})
export class EditLoanAccDepositGuarantorComponent implements OnInit {
  @Output() callParentFunction:EventEmitter<any> = new EventEmitter<any>();
  @Input() formGroupName: string;
  depositGuarantorInfoForm: FormGroup;
  public dataList:DepositGuarantorDisplayModel[] = [];
  public totalLien:number = 0;
  public depositAccountDetails:DepositDisplayModel[] = [];
  public depositGuarantorDetails: DepositGuarantorDetailsModel = new DepositGuarantorDetailsModel();
  private destroy$: Subject<void> = new Subject<void>();
  parentForm: FormGroup;
  public depositData = [];
  constructor(
    private rootFormGroup: FormGroupDirective,
    private applicationService: LoanApplicationService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private toaster: ToastrService,
    private editAccountService: EditLoanAccountService,
    ) { }
    

  ngOnInit(): void {
    this.applicationService.currentDeposit.subscribe(data=> this.dataList = data);
    this.applicationService.currentTotalDeposit.subscribe(data=> this.totalLien = data);
    this.parentForm = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
    this.parentForm.controls['DataDepositList'].setValue(this.dataList);
    this.parentForm.controls['TotalDepositGuarantorAmount'].setValue(this.totalLien);
    this.depositGuarantorInfoForm = new FormGroup({
      MemberNo: new FormControl(''),
      MemberName: new FormControl(''),
      AccountType: new FormControl(''),
      AccountNo: new FormControl(''),
      AccountTypeDescription: new FormControl(''),
      LienAmount: new FormControl(''),
      TotalLienAmount: new FormControl(''),
      LedgerBalance: new FormControl(''),
      MemberType: new FormControl(''),
    });
  }

  public onMemberNoChange(){
    this.applicationService.GetDepositGuarantorDetails(this.depositGuarantorInfoForm.value.MemberNo).pipe(takeUntil(this.destroy$)).subscribe(data=>{
      if(data.Success){
        this.depositGuarantorDetails = data;
        this.depositGuarantorInfoForm.controls['MemberName'].setValue(data.MemberName);
        this.depositGuarantorInfoForm.controls['MemberType'].setValue(data.MemType);
        this.depositGuarantorInfoForm.controls['AccountType'].setValue('');
        this.depositGuarantorInfoForm.controls['AccountNo'].setValue('');
        this.depositGuarantorInfoForm.controls['LienAmount'].setValue('');
        this.depositGuarantorInfoForm.controls['TotalLienAmount'].setValue('');
        this.depositGuarantorInfoForm.controls['LedgerBalance'].setValue('');
        this.depositGuarantorInfoForm.controls['AccountTypeDescription'].setValue('');
        this.depositData = [];
      }
      else{
        alert("Invalid Member No.");
        this.depositGuarantorInfoForm.controls['MemberNo'].setValue('');
      }
    });
  }

  public onAccountTypeChange(){
    if(this.depositGuarantorDetails.MemberNo!=null){
      let selectAcc = this.dataList.find((x)=> x.MemberNo == this.depositGuarantorInfoForm.value.MemberNo && x.AccountType == this.depositGuarantorInfoForm.value.AccountType);
      if(Number(this.depositGuarantorInfoForm.value.AccountType)==111){
        this.depositGuarantorInfoForm.controls['AccountNo'].setValue('');
        this.depositGuarantorInfoForm.controls['LienAmount'].setValue('');
        this.depositGuarantorInfoForm.controls['TotalLienAmount'].setValue('');
        this.depositGuarantorInfoForm.controls['LedgerBalance'].setValue('');
        this.depositGuarantorInfoForm.controls['AccountTypeDescription'].setValue('');
      }
      else if(selectAcc){
        alert("Duplicate Account No.");
        this.depositGuarantorInfoForm.controls['AccountType'].setValue('');
      }
      else{
        this.spinner.show();
        this.applicationService.GetDepositAccountAll(this.depositGuarantorDetails.BranchNo,this.depositGuarantorDetails.MemberNo,this.depositGuarantorDetails.MemType,this.depositGuarantorInfoForm.value.AccountType).pipe(takeUntil(this.destroy$)).subscribe(data=>{
          if(Number(data.AccountNo)==0){
            alert("Account not in File");
            this.depositGuarantorInfoForm.controls['AccountType'].setValue('');
          }
          else{
            console.log(data);
            this.depositData = data;
            this.spinner.hide();
            console.log(this.depositData);
            if(this.depositData.length==1){
              this.depositGuarantorInfoForm.controls['AccountTypeDescription'].setValue(data[0].AccountTypeDescription);
              this.depositGuarantorInfoForm.controls['AccountNo'].setValue(data[0].AccountNo);
              this.depositGuarantorInfoForm.controls['TotalLienAmount'].setValue(data[0].TotalLienAmount);
              this.depositGuarantorInfoForm.controls['LedgerBalance'].setValue(data[0].LedgerBalance);
            }
            else{
              this.depositGuarantorInfoForm.controls['AccountNo'].setValue(0);
            }
          }
        });
      }
    }
    else{
      alert("Please input the Member No.");
      this.depositGuarantorInfoForm.controls['AccountType'].setValue('');
    }
  }

  public onAccountNoChange(data){
    if(data==0){
      this.depositGuarantorInfoForm.controls['AccountTypeDescription'].setValue('');
      this.depositGuarantorInfoForm.controls['TotalLienAmount'].setValue('');
      this.depositGuarantorInfoForm.controls['LedgerBalance'].setValue('');
    }
    else{
      if(this.depositData.length==1){
        if(data==this.depositData[0].AccountNo){
          this.depositGuarantorInfoForm.controls['AccountTypeDescription'].setValue(this.depositData[0].AccountTypeDescription);
          this.depositGuarantorInfoForm.controls['AccountNo'].setValue(this.depositData[0].AccountNo);
          this.depositGuarantorInfoForm.controls['TotalLienAmount'].setValue(this.depositData[0].TotalLienAmount);
          this.depositGuarantorInfoForm.controls['LedgerBalance'].setValue(this.depositData[0].LedgerBalance);
        }
        else{
          alert("Account Type not found.");
          this.depositGuarantorInfoForm.controls['AccountTypeDescription'].setValue('');
          this.depositGuarantorInfoForm.controls['TotalLienAmount'].setValue('');
          this.depositGuarantorInfoForm.controls['LedgerBalance'].setValue('');
        }
      }
      else{
        let selectAcc = this.depositData.find((x)=> x.AccountNo == data);
        if(selectAcc!=null){
          this.depositGuarantorInfoForm.controls['AccountTypeDescription'].setValue(selectAcc.AccountTypeDescription);
          this.depositGuarantorInfoForm.controls['TotalLienAmount'].setValue(selectAcc.TotalLienAmount);
          this.depositGuarantorInfoForm.controls['LedgerBalance'].setValue(selectAcc.LedgerBalance);
        }
        else{
          alert("Account Type not found.");
          this.depositGuarantorInfoForm.controls['AccountTypeDescription'].setValue('');
          this.depositGuarantorInfoForm.controls['TotalLienAmount'].setValue('');
          this.depositGuarantorInfoForm.controls['LedgerBalance'].setValue('');
        }
      }
    }
  }

  public onLienAmountChange(){
    if(Number(this.depositGuarantorInfoForm.value.LienAmount) + Number(this.depositGuarantorInfoForm.value.TotalLienAmount)>Number(this.depositGuarantorInfoForm.value.LedgerBalance)){
      alert("Lien Amount + Total Lien Amount should be less than Ledger Balance!");
      this.depositGuarantorInfoForm.controls['LienAmount'].setValue('');
    }
  }

  public addDepositData(){
    var fValue = this.depositGuarantorInfoForm.value;
    if(fValue.MemberNo.length==0 || fValue.AccountType.length==0 || fValue.LienAmount.length==0 || fValue.AccountType.length==0|| fValue.TotalLienAmount.length==0|| fValue.LedgerBalance.length==0){
      alert("Should be filled up Empty Fields!");
    }
    else{
      let data = {
        MemberNo: this.depositGuarantorInfoForm.value.MemberNo,
        MemberType:this.depositGuarantorInfoForm.value.MemberType,
        LoanApplicationNo:this.editAccountService.getLoanApplicationNo(),
        AccountNo:this.depositGuarantorInfoForm.value.AccountNo,
        DepositAmount:this.depositGuarantorInfoForm.value.LienAmount,
        AccountType:this.depositGuarantorInfoForm.value.AccountType,
      }
      this.dataList = [];
      this.totalLien = 0;
      this.editAccountService.editLoanAccAddAndGetDepositDataToTemp(data).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
        for(var i=0;i<data.length;i++){
          this.dataList.push(data[i]);
          this.totalLien+=data[i].AccAmount;
        }
        let sendData = {
          singleValue:1,
          Data:this.depositGuarantorInfoForm.value.LienAmount,
        }
        this.callParentFunction.emit(sendData);
      })
      this.parentForm.controls['DataDepositList'].setValue(this.dataList);
      this.parentForm.controls['TotalDepositGuarantorAmount'].setValue(this.totalLien);
      this.removeShareData();
    }
  }

  public deleteData(data:any){
    var neg = Number(data.AccAmount) * -1;
    console.log(data);
    this.dataList = [];
      this.totalLien = 0;
      let sendData = {
        LoanApplicationNo: this.editAccountService.getLoanApplicationNo(),
        MemberType: data.MemType,
        MemberNo: data.MemNo,
        AccType:data.AccType,
        AccNo:data.AccNo,
      }
      this.editAccountService.editLoanRemoveAndGetDepositDataToTemp(sendData).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
        for(var i=0;i<data.length;i++){
          this.dataList.push(data[i]);
          this.totalLien+=data[i].AccAmount;
        }
      })
      let sendDataP = {
        singleValue:1,
        Data:neg,
      }
      this.callParentFunction.emit(sendDataP);
    this.parentForm.controls['DataDepositList'].setValue(this.dataList);
    this.parentForm.controls['TotalDepositGuarantorAmount'].setValue(this.totalLien);
  }

  public removeShareData(){
    this.depositGuarantorInfoForm.controls['MemberNo'].setValue('');
    this.depositGuarantorInfoForm.controls['MemberName'].setValue('');
    this.depositGuarantorInfoForm.controls['AccountType'].setValue('');
    this.depositGuarantorInfoForm.controls['AccountNo'].setValue('');
    this.depositGuarantorInfoForm.controls['LienAmount'].setValue('');
    this.depositGuarantorInfoForm.controls['TotalLienAmount'].setValue('');
    this.depositGuarantorInfoForm.controls['LedgerBalance'].setValue('');
    this.depositGuarantorInfoForm.controls['AccountTypeDescription'].setValue('');
    this.depositData = [];
  }

}
