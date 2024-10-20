import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoanApplicationService } from 'src/app/services/loan-application.service';
import { DepositGuarantorDetailsModel, LoanAccountTypeViewModel, LoanApplicationInputHelp, LoanMemberViewModel, PropertyGuarantorDetailsModel, ShareGuarantorDetailsModel } from '../../../models/loan-application.model';
import { LoanApplicationEventService } from '../../../services/loan-application-event-service';
import { EditLoanAccountService } from 'src/app/services/edit-loan-account.service';
import { IdDescription } from 'src/app/interfaces/id-description';
import { AccNoDataModel, AccTypeDataDropDown, AccTypeDataModel, EditLoanAccLoadModel, MemberNoDataModel } from '../../../models/edit-loan-account.model';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-edit-loan-account-info',
  templateUrl: './edit-loan-account-info.component.html',
  styleUrls: ['./edit-loan-account-info.component.css']
})
export class EditLoanAccountInfoComponent implements OnInit {
  @Output() callParentFunction:EventEmitter<any> = new EventEmitter<any>();
  @Output() parentFunctionShare:EventEmitter<any> = new EventEmitter<any>();
  @Input() formGroupName: string;
  public inputHelpData:LoanApplicationInputHelp=new LoanApplicationInputHelp();
  editLoanAccountForm: FormGroup;
  private loanAppEventService: LoanApplicationEventService;
  private destroy$: Subject<void> = new Subject<void>();
  public hideShowModel={ShowCorrAccNo:false,ShowInstallment:false,ShowLoanGraceMonth:false,ShowPeriod:true};
  public accountTypeDetails:LoanAccountTypeViewModel=new LoanAccountTypeViewModel();
  public memberDetails: LoanMemberViewModel=new LoanMemberViewModel();
  public shareDataList:ShareGuarantorDetailsModel[] = [];
  public depositDataList:DepositGuarantorDetailsModel[] = [];
  public propertyDataList:PropertyGuarantorDetailsModel[] = [];
  public shareGuaranteeMonth: number;
  public shareGuranteeNo:number;
  public shareAmountNow:number = 0;

  EditLoanAccLoadData:EditLoanAccLoadModel = new EditLoanAccLoadModel();
  LoanCalculationEnum: IdDescription[] = [];
  YesNoEnum: IdDescription[] = [];
  AccTypeDataDropDown: AccTypeDataDropDown[] = [];
  MemberNoData: MemberNoDataModel = new MemberNoDataModel();
  AccNoDropdown:number[]=[];
  AccNoData: AccNoDataModel = new AccNoDataModel();
  AccTypeData: AccTypeDataModel = new AccTypeDataModel();

  constructor(
    private rootFormGroup: FormGroupDirective,
    private applicationService: LoanApplicationService,
    private editAccountService: EditLoanAccountService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private toaster: ToastrService,
    public datepipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.editLoanAccountForm = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
    this.pageLoadData();
  }

  pageLoadData(){
    this.spinner.show();
    this.editAccountService.editLoanAccLoadData().pipe(first()).subscribe((x:any)=>{
      this.spinner.hide();
      console.log(x);
      this.LoanCalculationEnum = x.LoanCalculationEnum;
      this.YesNoEnum = x.YesNoEnum;
      this.EditLoanAccLoadData.OpenDate = x.OpenDate;
      this.EditLoanAccLoadData.ProcDate = x.ProcDate;
      this.editLoanAccountForm.controls['OpenDate'].setValue(x.OpenDate);
    });
  }
  onMemberNoChange(){
    console.log(this.editLoanAccountForm.value.MemberNo);
    this.spinner.show();
    this.editAccountService.editLoanAccMemNoChangeData(this.editLoanAccountForm.value.MemberNo).pipe(first()).subscribe((x:any)=>{
      this.spinner.hide();
      console.log(x);
      if(x.Success){
        this.AccTypeDataDropDown = x.AccTypeData;
        this.MemberNoData = this.editAccountService.setMemberNoData(x);
        if(this.AccTypeDataDropDown.length==1){
          this.editLoanAccountForm.controls['AccountType'].setValue(this.AccTypeDataDropDown[0].AccType);
          this.onAccountTypeChange();
        }
      }else{
        alert(x.Message);
        this.editLoanAccountForm.controls['MemberNo'].setValue('');
      }
    });
  }

  onAccountTypeChange(){
    //console.log(event.target.value);
    var val = this.editLoanAccountForm.value.AccountType;
    let selectedCode = this.AccTypeDataDropDown.find(x=>x.AccType==val);
    if(selectedCode){
      this.editLoanAccountForm.controls['AccountType'].setValue(val);
      let data = {
        MemType:this.MemberNoData.MemType,
        MemNo:this.editLoanAccountForm.value.MemberNo,
        AccType:this.editLoanAccountForm.value.AccountType,
      }
      this.spinner.show();
      this.editAccountService.setAccTypeData(this.editLoanAccountForm.value.AccountType);
      this.editAccountService.editLoanAccTypeChangeData(data).pipe(first()).subscribe((x:any)=>{
        this.spinner.hide();
        console.log(x);
        this.AccNoDropdown = x.AccountNo;
        this.AccNoData = this.editAccountService.setLoanAccTypeChangeData(x);
        if(this.AccNoDropdown.length==1){
          this.editLoanAccountForm.controls['AccountNo'].setValue(this.AccNoDropdown[0]);
          this.onAccountNoChange();
        }
      });
    }
    else{
      alert("Not Allowed Open an Account");
      this.editLoanAccountForm.controls['AccountType'].setValue('0');
    }
  }

  onAccountNoChange(){
    var val = this.editLoanAccountForm.value.AccountNo;
    let data = {
      AccountNo: val,
      AccType: this.editLoanAccountForm.value.AccountType,
      MemberNo: this.editLoanAccountForm.value.MemberNo,
    }
    this.spinner.show();
    this.editAccountService.editLoanAccNoChangeData(data).pipe(first()).subscribe((x:any)=>{
      console.log(x);
      this.AccTypeData = this.editAccountService.setAccTypeData(x);
      this.editAccountService.setLoanApplicationNo(this.AccTypeData.LoanAppNo);
      this.setFormData();
      this.spinner.hide();
      if(x.ShareGuarantorList!=null && x.ShareGuarantorList != undefined){
        this.applicationService.changeLoanMemberNo(x.ShareGuarantorList);
        var tot = 0;
        for(var i=0;i<x.ShareGuarantorList.length;i++)
        {
          tot+=Number(x.ShareGuarantorList[i].AccAmount);
        }
        this.applicationService.changeTotalShare(tot);
        this.shareDataList.push(x.ShareGuarantorList);
        if(this.shareAmountNow!=0){
          let sendData = {
            singleValue:1,
            Data:this.shareAmountNow * -1,
          }
          this.callParentFunction.emit(sendData);
        }
        this.shareAmountNow = Number(tot);
        let sendData = {
          singleValue:0,
          Data:x.ShareGuarantorList,
        }
        this.callParentFunction.emit(sendData);
      }

      if(x.DepositGuarantorList!=null && x.DepositGuarantorList != undefined){
        this.applicationService.changeDepositData(x.DepositGuarantorList);
        var tot = 0;
        for(var i=0;i<x.DepositGuarantorList.length;i++)
        {
          tot+=Number(x.DepositGuarantorList[i].AccAmount);
        }
        this.applicationService.changeTotalDeposit(tot);
        this.depositDataList.push(x.DepositGuarantorList);
      }

      if(x.PropertyGuarantorList!=null && x.PropertyGuarantorList != undefined){
        this.applicationService.changePropertyData(x.PropertyGuarantorList);
        var tot = 0;
        for(var i=0;i<x.PropertyGuarantorList.length;i++)
        {
          tot+=Number(x.PropertyGuarantorList[i].PrAmount);
        }
        this.applicationService.changeTotalProperty(tot);
        this.propertyDataList.push(x.PropertyGuarantorList);
      }

    });
  }
  setFormData(){
    this.editLoanAccountForm.controls['Status'].setValue(this.AccTypeData.Stat);
    this.editLoanAccountForm.controls['LedgerBalance'].setValue(this.AccTypeData.Balance);
    this.editLoanAccountForm.controls['SanctionDate'].setValue(this.AccTypeData.SancDate);
    this.editLoanAccountForm.controls['DisbursementDate'].setValue(this.AccTypeData.DisbDate);
    this.editLoanAccountForm.controls['SanctionAmount'].setValue(this.AccTypeData.SancAmount);
    this.editLoanAccountForm.controls['LoanExpiryDate'].setValue(this.AccTypeData.LoanExpiryDate);
    this.editLoanAccountForm.controls['LoanGraceMonth'].setValue(this.AccTypeData.LoanGrace);
    this.editLoanAccountForm.controls['DisburesementAmount'].setValue(this.AccTypeData.DisbAmount);
    this.editLoanAccountForm.controls['LastTransactionDate'].setValue(this.AccTypeData.LastTrnDate);
    this.editLoanAccountForm.controls['NoOfInstallment'].setValue(this.AccTypeData.NoInstl);
    this.editLoanAccountForm.controls['InterestRate'].setValue(this.AccTypeData.IntRate);
    this.editLoanAccountForm.controls['InstallmentAmount'].setValue(this.AccTypeData.InstlAmount);
    this.editLoanAccountForm.controls['LoanCalMethod'].setValue(this.AccTypeData.LoanCalMethod);
    this.editLoanAccountForm.controls['LastInstallmentAmount'].setValue(this.AccTypeData.LastInstlAmount);
    this.editLoanAccountForm.controls['FirstInstallmentDate'].setValue(this.AccTypeData.FirstInstlDt);
    this.editLoanAccountForm.controls['SecondInstallmentDate'].setValue(this.AccTypeData.SecondInstlDt);
    this.editLoanAccountForm.controls['CurrentEffectingDate'].setValue(this.AccTypeData.EffectDate);
    this.editLoanAccountForm.controls['NextEffectingDate'].setValue(this.AccTypeData.NextEffectDate);
    this.editLoanAccountForm.controls['ODIntPostDate'].setValue(this.AccTypeData.ODIntDate);
    this.editLoanAccountForm.controls['DueODInterestAmt'].setValue(this.AccTypeData.ODIDueIntAmt);
    this.editLoanAccountForm.controls['ODPeriod'].setValue(this.AccTypeData.Period);
    this.editLoanAccountForm.controls['LoanSuretyMemberNo'].setValue(this.AccTypeData.SuretyMemNo);
    this.editLoanAccountForm.controls['CurrPrincipalDue'].setValue(this.AccTypeData.DuePrinc);
    this.editLoanAccountForm.controls['CurrInterestDue'].setValue(this.AccTypeData.DueInt);
    this.editLoanAccountForm.controls['CorrAccountNo'].setValue(this.AccTypeData.CorrAccNo);
    this.editLoanAccountForm.controls['AutoTrfCorrAC'].setValue(this.AccTypeData.AutoTrf);
    this.editLoanAccountForm.controls['OldAccountNo'].setValue(this.AccTypeData.OldAccNo);
    this.editLoanAccountForm.controls['SMSService'].setValue(this.AccTypeData.SMSService);
    this.editLoanAccountForm.controls['RebatePaid'].setValue(this.AccTypeData.RebatePaid);
    this.editLoanAccountForm.controls['MemberType'].setValue(this.AccTypeData.MemType);
    this.editLoanAccountForm.controls['LoanFirstInstlDt'].setValue(this.AccTypeData.LoanFirstInstlDt);
    this.editLoanAccountForm.controls['LoanSecondInstlDt'].setValue(this.AccTypeData.LoanSecondInstlDt);
    this.editLoanAccountForm.controls['AccCorrType'].setValue(this.AccTypeData.AccCorrType);
    this.editLoanAccountForm.controls['OpenDate'].setValue(this.AccTypeData.OpenDate);
    this.editLoanAccountForm.controls['ProcDate'].setValue(this.EditLoanAccLoadData.ProcDate);
    this.editLoanAccountForm.controls['EffectDate'].setValue(this.AccTypeData.EffectDate);
    this.editLoanAccountForm.controls['PaidPrincAmt'].setValue(this.AccTypeData.PaidPrincAmt);
    this.editLoanAccountForm.controls['PaidIntAmt'].setValue(this.AccTypeData.PaidIntAmt);
    this.editLoanAccountForm.controls['ID'].setValue(this.AccTypeData.ID);
    this.editLoanAccountForm.controls['LoanAppNo'].setValue(this.AccTypeData.LoanAppNo);
    this.editLoanAccountForm.controls['AtyClass'].setValue(this.AccNoData.AtyClass);
    this.editLoanAccountForm.controls['LoanSuretyMemberType'].setValue(this.AccTypeData.SuretyMemType);
    this.AccNoData.FirstInstlDtVisible = this.AccTypeData.FirstInstlDtVisible;
    this.AccNoData.SecondInstlDtVisible = this.AccTypeData.SecondInstlDtVisible;
  }

  openDateChange(){
    console.log(this.editLoanAccountForm.value.OpenDate)
    var fv = this.editLoanAccountForm.value;
    var value = this.datepipe.transform(fv.OpenDate, 'dd-MM-yyyy');
    fv.OpenDate = this.editAccountService.convertDateToString(value);
  }

  sanctionDateChange(){
    var fv = this.editLoanAccountForm.value;
    var value = this.datepipe.transform(fv.SanctionDate, 'dd-MM-yyyy');
    fv.SanctionDate = this.editAccountService.convertDateToString(value);
  }

  disbursementDateChange(){
    var fv = this.editLoanAccountForm.value;
    var value = this.datepipe.transform(fv.DisbursementDate, 'dd-MM-yyyy');
    fv.DisbursementDate = this.editAccountService.convertDateToString(value);
  }

  loanExpiryDateChange(){
    var fv = this.editLoanAccountForm.value;
    var value = this.datepipe.transform(fv.LoanExpiryDate, 'dd-MM-yyyy');
    fv.LoanExpiryDate = this.editAccountService.convertDateToString(value);
  }

  lastTransactionDateChange(){
    var fv = this.editLoanAccountForm.value;
    var value = this.datepipe.transform(fv.LastTransactionDate, 'dd-MM-yyyy');
    fv.LastTransactionDate = this.editAccountService.convertDateToString(value);
  }

  currentEffectingDateChange(){
    var fv = this.editLoanAccountForm.value;
    var value = this.datepipe.transform(fv.CurrentEffectingDate, 'dd-MM-yyyy');
    fv.CurrentEffectingDate = this.editAccountService.convertDateToString(value);
  }

  nextEffectingDateChange(){
    var fv = this.editLoanAccountForm.value;
    var value = this.datepipe.transform(fv.NextEffectingDate, 'dd-MM-yyyy');
    fv.NextEffectingDate = this.editAccountService.convertDateToString(value);
  }

  firstInstallmentDateChange(){
    var fv = this.editLoanAccountForm.value;
    var value = this.datepipe.transform(fv.FirstInstallmentDate, 'dd-MM-yyyy');
    fv.FirstInstallmentDate = this.editAccountService.convertDateToString(value);
  }

  secondInstallmentDateChange(){
    var fv = this.editLoanAccountForm.value;
    var value = this.datepipe.transform(fv.SecondInstallmentDate, 'dd-MM-yyyy');
    fv.SecondInstallmentDate = this.editAccountService.convertDateToString(value);
  }

  oDIntPostDateChange(){
    var fv = this.editLoanAccountForm.value;
    var value = this.datepipe.transform(fv.ODIntPostDate, 'dd-MM-yyyy');
    fv.ODIntPostDate = this.editAccountService.convertDateToString(value);
  }

  noOfInstallmentChange(){
    let data = {
      SancAmount: this.editLoanAccountForm.value.SanctionAmount,
      NoOfInstallment: this.editLoanAccountForm.value.NoOfInstallment,
      AccountType: this.editLoanAccountForm.value.AccountType,
      GraceFlag: this.AccTypeData.GraceFlag,
      LoanGrace: this.AccTypeData.LoanGrace,
      DisbDate: this.editLoanAccountForm.value.DisbursementDate,
      DepositMode: this.AccTypeData.DepositMode,
      WeeklyDays: this.AccTypeData.WeeklyDay,
    }
    this.spinner.show();
    this.editAccountService.NoOfInstallmentChange(data).pipe(first()).subscribe((x:any)=>{
      this.editLoanAccountForm.controls['InstallmentAmount'].setValue(x.InstallmentAmount);
      this.editLoanAccountForm.controls['LastInstallmentAmount'].setValue(x.LastInstallmentAmount);
      this.editLoanAccountForm.controls['LoanExpiryDate'].setValue(x.ExpireDate);
      this.editLoanAccountForm.controls['LoanFirstInstlDt'].setValue(x.FirstInstallmentDate);
      this.spinner.hide();
    });

  }

  installmentAmountChange(){
    let data = {
      SancAmount: this.editLoanAccountForm.value.SanctionAmount,
      InstallmentAmount: this.editLoanAccountForm.value.InstallmentAmount,
      NoOfInstallment: this.editLoanAccountForm.value.NoOfInstallment,
      GraceFlag: this.AccTypeData.GraceFlag,
      LoanGrace: this.AccTypeData.LoanGrace,
      DisbDate: this.editLoanAccountForm.value.DisbursementDate,
      DepositMode: this.AccTypeData.DepositMode,
      WeeklyDays: this.AccTypeData.WeeklyDay,
    }
    this.spinner.show();
    this.editAccountService.InstallmentAmountChange(data).pipe(first()).subscribe((x:any)=>{
      this.editLoanAccountForm.controls['InstallmentAmount'].setValue(x.InstallmentAmount);
      this.editLoanAccountForm.controls['LastInstallmentAmount'].setValue(x.LastInstallmentAmount);
      this.editLoanAccountForm.controls['LoanExpiryDate'].setValue(x.ExpireDate);
      this.editLoanAccountForm.controls['LoanFirstInstlDt'].setValue(x.FirstInstallmentDate);
      this.spinner.hide();
    });
  }

  loanSuretyMemberNoChange(){
    this.spinner.show();
    this.editAccountService.LoanSuretyMemberNoChange(this.editLoanAccountForm.value.LoanSuretyMemberNo).pipe(first()).subscribe((x:any)=>{
      if(x.Success){
        this.AccTypeData.SuretyMemName = x.SuretyMemName;
      }
      else{
        alert(x.Message);
      }
      this.spinner.hide();
    });
  }

  corrAccountNoChange(){
    let data = {
      MemberType: this.MemberNoData.MemType,
      MemberNo: this.editLoanAccountForm.value.MemberNo,
      AccountNo: this.editLoanAccountForm.value.CorrAccountNo,
    }
    this.editAccountService.CorrAccountNoChange(data).pipe(first()).subscribe((x:any)=>{
      if(x.Success){
        this.AccTypeData.CorrAccTitle = x.AccountTitile;
      }
      else{
        alert(x.Message);
      }
      this.spinner.hide();
    })
  }

}
