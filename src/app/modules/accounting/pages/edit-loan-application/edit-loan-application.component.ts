import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { EditLoanAccountService } from 'src/app/services/edit-loan-account.service';
import { LoanApplicationService } from 'src/app/services/loan-application.service';
import { EditLoanAccFullUpdateModel } from '../../models/edit-loan-account.model';
import { LoanApplicationCreateModel } from '../../models/loan-application.model';
import { EditLoanApplicationService } from '../../services/edit-loan-application.service';

@Component({
  selector: 'app-edit-loan-application',
  templateUrl: './edit-loan-application.component.html',
  styleUrls: ['./edit-loan-application.component.css']
})
export class EditLoanApplicationComponent implements OnInit {
  module:string = "1";
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
    private editLoanApplication: EditLoanApplicationService,
    private applicationService: LoanApplicationService,
    private editAccountService: EditLoanAccountService,
    private route: ActivatedRoute,
    private router: Router,
    public datepipe: DatePipe,
  ) { }


  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  getResolvedUrl(route: ActivatedRouteSnapshot): string {
    let url = route.pathFromRoot.map((v) => v.url.map((segment) => segment.toString()).join('/')).join('/');
    const queryParam = route.queryParamMap;
    if (queryParam.keys.length > 0) {
      url += '?' + queryParam.keys.map(key => queryParam.getAll(key).map(value => key + '=' + value).join('&')).join('&');
    }
    return url;
  }
  getModuleName(urlData:any){
    console.log(urlData)
    var result = '';
    for(var i=1;i<urlData.length;i++){
      if(urlData[i]=='/') return result;
      result+=urlData[i];
    }
  }
  ngOnInit(): void {
      this.initializeForm();
      var urlData = this.getResolvedUrl(this.route.snapshot);
      urlData = this.getModuleName(urlData);
      console.log(urlData)
      if(urlData=='booth') this.module = '3'
      else if(urlData=='accounting') this.module = '1';
  }

  private initializeForm() {
    this.loanApplicationForm = this.fb.group({
      TotalGaurantyAmount : new FormControl(''),
      loanInfo: this.fb.group({
                ApplicationID: new FormControl(''),
                ApplicationNo: new FormControl(''),
                ApplicationDate: new FormControl(''),
                MemType: new FormControl('0'),
                LoanAccountTypeCode:new FormControl('', [Validators.required]),
                LoanAccountType: new FormControl('0'),
                LoanAccCorrType: new FormControl(null), //as a hidden for correct account type get
                CorrAccountNo:new FormControl(''),
                CorrAccountTitle:new FormControl(''),
                IsAutoTrfCorrAccount:new FormControl(false),
                OldMemberCheckBox: new FormControl(false),
                LoanMemberNo: new FormControl('',[Validators.required]),
                LoanMemberName:new FormControl('', [Validators.required]),
                LoanApplicationAmount: new FormControl('', [Validators.required]),
                LoanInterestRate: new FormControl(''),
                LoanCategoryCode: new FormControl('1'),
                LoanCategory: new FormControl('1'),
                LoanExpDate: new FormControl(''),
                LoanPurposeCode:new FormControl(''),
                LoanPurpose: new FormControl('0'),
                LoanInterestCalMethodCode:new FormControl('1'),
                LoanInterestCalMethod: new FormControl('1'),
                LoanSuretyMemNo: new FormControl(''),
                LoanSuretyMemName:new FormControl(''),
                AccPeriod: new FormControl(''),
                StepsOfLoan: new FormControl(''),
                LoanPerformance: new FormControl(''),
                TotalDepAmount: new FormControl(''),
                InputBy: new FormControl('0'),
                ApproveBy: new FormControl('0'),
                InputByDate: new FormControl(''),
                ApproveByDate: new FormControl(''),
                WeeklyDay: new FormControl(''),

                LoanNoInstallment: new FormControl(''),
                LoanInstallmentAmount: new FormControl(''),
                LoanLastInstallmentAmount: new FormControl(''),
                LoanFirstInstallmentdate: new FormControl(''),
                LoanGracePeriod:new FormControl(''),
                AccTypeMode: new FormControl(''),
                LoanSecondInstallmentdate: new FormControl(''),
                LoanSuretyMemType: new FormControl(''),
                DepositMode: new FormControl(''),
                LoanCalculationMethod: new FormControl(''),
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

    var fv=this.loanApplicationForm.value.loanInfo;
    console.log('this is fv value',fv);
    if(fv.MemberNo==""||fv.AccountType==0||fv.AccountNo==0){
      alert("Please fillup all the required filed.");
    }
    else if(this.loanApplicationForm.value.TotalGaurantyAmount==0){
      alert("Please add Guarantor Info.");
    }
    else{
      this.spinner.show();
      var data = this.updateDataSet(fv);
      console.log(data);
      this.editLoanApplication.editLoanAppUpdate(data).pipe(first()).subscribe((x:any)=>{
        this.spinner.hide();
        if(x==1){
          alert('Data Updated Successfully.');
          location.reload();
        }
        else{
          alert('Something went wrong.');
        }
      })
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
      this.totalGuaranty+=Number(data.Data);
      this.loanApplicationForm.controls['TotalGaurantyAmount'].setValue(this.totalGuaranty);
    }
    else{
      this.totalGuaranty+=Number(data.Data);
      this.loanApplicationForm.controls['TotalGaurantyAmount'].setValue(this.totalGuaranty);
    }
  }

  exitPage(){
    this.router.navigate(['accounting/']);
  }

  onReturnSchedule(){
    let checkData = this.loanApplicationForm.value;
    console.log(checkData)
    if(checkData.loanInfo.LoanAccountTypeCode!=''){
      if(checkData.loanInfo.LoanAccountTypeCode=='670'){
        alert('Return Schedule is not possible on Credit Celling Loan Type.');
      }
      else{
        if(checkData.loanInfo.LoanApplicationAmount==''){
          alert('Please Input Loan Application Amount');
        }
        else if(checkData.loanInfo.LoanNoInstallment==''){
          alert('Please Input No of Insatallment.');
        }
        else if(checkData.loanInfo.LoanInterestRate==''){
          alert('Please Input Interest Rate.')
        }
        else{
          localStorage.setItem('returnScheduleData',JSON.stringify(this.loanApplicationForm.value.loanInfo));
          const url: string = String(this.router.createUrlTree(['accounting/loan-return-schedule']));
          window.open(url,'_blank');
        }
      }
    }
    else{
      alert('Please Select Loan A/C Type');
    }

  }

  updateDataSet(x:any){
    let data = {
      ApplicationID: x.ApplicationID,
      LoanApplicationNo: x.ApplicationNo,
      ApplicationDate: x.ApplicationDate,
      MemType: x.MemType,
      LoanAccountType: x.LoanAccountType,
      LoanAccCorrType: x.LoanAccCorrType,
      CorrAccountNo: x.CorrAccountNo,
      CorrAccountTitle:x.CorrAccountTitle,
      LoanMemberNo:x.LoanMemberNo,
      LoanMemberName:x.LoanMemberName,
      LoanApplicationAmount:x.LoanApplicationAmount,
      LoanInterestRate:x.LoanInterestRate,
      LoanCategoryCode:x.LoanCategoryCode,
      LoanExpDate:x.LoanExpDate,
      LoanPurposeCode:x.LoanPurposeCode,
      LoanSuretyMemNo:x.LoanSuretyMemNo,
      LoanSuretyMemName:x.LoanSuretyMemName,
      AccPeriod:x.AccPeriod,
      LoanNoInstallment:x.LoanNoInstallment,
      LoanInstallmentAmount:x.LoanInstallmentAmount,
      LoanLastInstallmentAmount:x.LoanLastInstallmentAmount,
      LoanFirstInstallmentdate:x.LoanFirstInstallmentdate,
      LoanGracePeriod:x.LoanGracePeriod,
      LoanSecondInstallmentdate:x.LoanSecondInstallmentdate,
      LoanSuretyMemType:x.LoanSuretyMemType,
      DepositMode:x.DepositMode,
      LoanCalculationMethod:x.LoanCalculationMethod,
      InputBy:x.InputBy,
      ApproveBy:x.ApproveBy,
      InputByDate:x.InputByDate,
      ApproveByDate:x.ApproveByDate,
      LoanTotGurarantorAmount: this.loanApplicationForm.value.TotalGaurantyAmount,
      AutoTrfFlag:x.IsAutoTrfCorrAccount,
      WeeklyDay: x.WeeklyDay,

    }
    return data;
  }

}
