import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoanApplicationService } from 'src/app/services/loan-application.service';
import { DepositGuarantorDisplayModel, DepositGuarantorDetailsModel,DepositDisplayModel } from '../../../models/loan-application.model';

@Component({
  selector: 'app-loan-deposit-guarantor',
  templateUrl: './loan-deposit-guarantor.component.html',
  styleUrls: ['./loan-deposit-guarantor.component.css']
})
export class LoanDepositGuarantorComponent implements OnInit {
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
  constructor(private rootFormGroup: FormGroupDirective,
    private applicationService: LoanApplicationService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private toaster: ToastrService) { }


  ngOnInit(): void {
    this.parentForm = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
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
        this.toaster.warning("Invalid Member No.");
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
        this.toaster.warning("Duplicate Account No.");
        this.depositGuarantorInfoForm.controls['AccountType'].setValue('');
      }
      else{
        this.spinner.show();
        this.applicationService.GetDepositAccountAll(this.depositGuarantorDetails.BranchNo,this.depositGuarantorDetails.MemberNo,this.depositGuarantorDetails.MemType,this.depositGuarantorInfoForm.value.AccountType).pipe(takeUntil(this.destroy$)).subscribe(data=>{
          if(Number(data.AccountNo)==0){
            this.toaster.warning("Account not in File");
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
              this.toaster.warning("Account not in File");
              this.depositGuarantorInfoForm.controls['AccountType'].setValue('');
            }
          }
        });
      }
    }
    else{
      this.toaster.warning("Please input the Member No.");
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
          this.toaster.warning("Account Type not found.");
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
          this.toaster.warning("Account Type not found.");
          this.depositGuarantorInfoForm.controls['AccountTypeDescription'].setValue('');
          this.depositGuarantorInfoForm.controls['TotalLienAmount'].setValue('');
          this.depositGuarantorInfoForm.controls['LedgerBalance'].setValue('');
        }
      }
    }
  }

  public onLienAmountChange(){
    if(Number(this.depositGuarantorInfoForm.value.LienAmount) + Number(this.depositGuarantorInfoForm.value.TotalLienAmount)>Number(this.depositGuarantorInfoForm.value.LedgerBalance)){
      this.toaster.warning("Lien Amount + Total Lien Amount should be less than Ledger Balance!");
      this.depositGuarantorInfoForm.controls['LienAmount'].setValue('');
    }
  }

  public addDepositData(){
    var fValue = this.depositGuarantorInfoForm.value;
    if(fValue.MemberNo.length==0 || fValue.AccountType.length==0 || fValue.LienAmount.length==0 || fValue.AccountType.length==0|| fValue.TotalLienAmount.length==0|| fValue.LedgerBalance.length==0){
      this.toaster.warning("Should be filled up Empty Fields!");
    }
    else{
      this.totalLien+=Number(this.depositGuarantorInfoForm.value.LienAmount);
      this.parentForm.controls['TotalDepositGuarantorAmount'].setValue(this.totalLien);
      let sendData = {
        singleValue:1,
        Data:Number(this.depositGuarantorInfoForm.value.LienAmount),
      }
      this.callParentFunction.emit(sendData);
      this.dataList.push(this.depositGuarantorInfoForm.value);
      this.parentForm.controls['DataDepositList'].setValue(this.dataList);
      this.removeShareData();
    }
  }

  public deleteData(data:any){
    this.dataList = this.dataList.filter(item=> item!=data);
    this.parentForm.controls['DataDepositList'].setValue(this.dataList);
    this.totalLien -= Number(data.LienAmount);
    data.LienAmount = Number(data.LienAmount) * -1;
    this.parentForm.controls['TotalDepositGuarantorAmount'].setValue(this.totalLien);
    let sendData = {
      singleValue:1,
      Data:data.LienAmount,
    }
    this.callParentFunction.emit(sendData);
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

  onlyNumberKey(evt) {
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
        return false;
    return true;
}
}
