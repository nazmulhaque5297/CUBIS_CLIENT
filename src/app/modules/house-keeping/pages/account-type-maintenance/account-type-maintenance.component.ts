import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AccountTypeDisplayModel,
  AccountTypeGLDetailsModel,
  AccountTypeGLType,
  AccountTypeInputHelp,
  AccountTypeViewModel,
} from 'src/app/interfaces/account-type';
import { AccountTypeService } from 'src/app/services/account-type.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-account-type-maintenance',
  templateUrl: './account-type-maintenance.component.html',
  styleUrls: ['./account-type-maintenance.component.css'],
})
export class AccountTypeMaintenanceComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public inputHelpData: AccountTypeInputHelp = new AccountTypeInputHelp();
  public dataList: AccountTypeDisplayModel[] = [];
  public detailsData: AccountTypeViewModel = new AccountTypeViewModel();
  accountTypeForm: FormGroup;
  public hasData: boolean = false;

  constructor(
    private accountTypeService: AccountTypeService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.hasData = false;
    this.accountTypeService
      .getInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        console.log("PageLoad===>",data)
        this.inputHelpData = data;
      });

  }

  private initializeForm() {
    var data = this.detailsData;
    if(this.detailsData.Details.AccTypeDescription!=null) this.hasData = true;
    else this.hasData = false;
    console.log(this.detailsData.Details.AccTypeDescription)
    this.accountTypeForm = new FormGroup({
      AccTypeCode: new FormControl(data.Details.AccTypeCode, [
        Validators.required,
      ]),
      AccTypeDescription: new FormControl(data.Details.AccTypeDescription),
      AccTypeShortDescription: new FormControl(
        data.Details.AccTypeShortDescription
      ),
      AccTypeClass: new FormControl(data.Details.AccTypeClass),
      AccTypeClassDesc: new FormControl(data.Details.AccTypeClassDesc),
      AccFlag: new FormControl(data.Details.AccFlag),
      AccTypeMode: new FormControl(data.Details.AccTypeMode),
      AccCorrType: new FormControl(data.Details.AccCorrType),
      AccDepRoundingBy: new FormControl(data.Details.AccDepRoundingBy),
      AccProvisionMode: new FormControl(data.Details.AccProvisionMode),
      AccDepositMode: new FormControl(data.Details.AccDepositMode),
      AccExpenseMode: new FormControl(data.Details.AccExpenseMode),
      AccWeeklyDay: new FormControl('1'),
      AccFineMode: new FormControl(data.Details.AccFineMode),
      AccCertNo: new FormControl(data.Details.AccCertNo == 1 ? true : false),
      AccDivident: new FormControl(
        data.Details.AccDivident == 1 ? true : false
      ),
      AccessT1: new FormControl(data.Details.AccessT1 == 1 ? true : false),
      AccessT2: new FormControl(data.Details.AccessT2 == 1 ? true : false),

      AccProductGLCode: new FormControl(data.Details.AccProductGLCode),
      AccProvisionGLCode: new FormControl(data.Details.AccProvisionGLCode),
      AccInterestGLCode: new FormControl(data.Details.AccInterestGLCode),
      AccExcessIntGLCode: new FormControl(data.Details.AccExcessIntGLCode),
      AccExpenseGLCode: new FormControl(data.Details.AccExpenseGLCode),
      AccSuretyGLCode: new FormControl(data.Details.AccSuretyGLCode),
      AccSuretyIntGLCode: new FormControl(data.Details.AccSuretyIntGLCode),
      AccBonusGLCode: new FormControl(data.Details.AccBonusGLCode),
      AccFineGLCode: new FormControl(data.Details.AccFineGLCode),
      AccClosingFeeGLCode: new FormControl(data.Details.AccClosingFeeGLCode),
      AccProcessFeeGLCode: new FormControl(data.Details.AccProcessFeeGLCode),
      AccDepositFeeGLCode: new FormControl(data.Details.AccDepositFeeGLCode),
    });
  }

  public loadAllData() {
    this.accountTypeService
      .getViewDisplayList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.dataList = data;
      });
  }

  public onGetDetails() {
    this.spinner.show();
    var fValue = this.accountTypeForm.value;
    if(this.accountTypeForm.value.AccTypeCode=='')
    {
    
      alert("Invalid AccTypeCode!!!")
      this.spinner.hide();
      return;
    }
    this.accountTypeService
      .GetDetails(fValue.AccTypeCode)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        console.log("Checking Value===>>",data)
        this.detailsData = data;
        this.detailsData.Details.AccTypeCode = fValue.AccTypeCode;
        this.initializeForm();

        this.spinner.hide();
      });
    setTimeout(() => {
      document.getElementById(`AccTypeDescription`).focus();
    }, 100);
  }

  public onGetGlDetails(code: number, typeId: number) {
    this.accountTypeService
      .getGLDetails(code, typeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data.Invalid) {
          this.toaster.error(data.Message, 'Error');
        }
        this.setGlControlValue(typeId, data);
      });
  }

  private setGlControlValue(
    typeId: AccountTypeGLType,
    data: AccountTypeGLDetailsModel
  ) {
    switch (typeId) {
      case AccountTypeGLType.ProductGLCode:
        this.accountTypeForm.controls['AccProductGLCode'].setValue(data.Id);
        this.detailsData.ProductGLDesc = data.Description;
        break;
      case AccountTypeGLType.ProvisionGLCode:
        this.accountTypeForm.controls['AccProvisionGLCode'].setValue(data.Id);
        this.detailsData.ProvisionGLDesc = data.Description;
        break;
      case AccountTypeGLType.InterestGLCode:
        this.accountTypeForm.controls['AccInterestGLCode'].setValue(data.Id);
        this.detailsData.InterestGLDesc = data.Description;
        break;
      case AccountTypeGLType.ExcessIntGLCode:
        this.accountTypeForm.controls['AccExcessIntGLCode'].setValue(data.Id);
        this.detailsData.ExcessIntGLDesc = data.Description;
        break;
      case AccountTypeGLType.ExpenseGLCode:
        this.accountTypeForm.controls['AccExpenseGLCode'].setValue(data.Id);
        this.detailsData.ExpenseGLDesc = data.Description;
        break;
      case AccountTypeGLType.SuretyGLCode:
        this.accountTypeForm.controls['AccSuretyGLCode'].setValue(data.Id);
        this.detailsData.AccSuretyGLDesc = data.Description;
        break;
      case AccountTypeGLType.SuretyIntGLCode:
        this.accountTypeForm.controls['AccSuretyIntGLCode'].setValue(data.Id);
        this.detailsData.AccSuretyIntGLDesc = data.Description;
        break;
      case AccountTypeGLType.BonusGLCode:
        this.accountTypeForm.controls['AccBonusGLCode'].setValue(data.Id);
        this.detailsData.AccBonusGLDesc = data.Description;
        break;
      case AccountTypeGLType.FineGLCode:
        this.accountTypeForm.controls['AccFineGLCode'].setValue(data.Id);
        this.detailsData.AccFineGLDesc = data.Description;
        break;
      case AccountTypeGLType.ClosingFeeGLCode:
        this.accountTypeForm.controls['AccClosingFeeGLCode'].setValue(data.Id);
        this.detailsData.AccClosingFeeGLDesc = data.Description;
        break;
      case AccountTypeGLType.ProcessFeeGLCode:
        this.accountTypeForm.controls['AccProcessFeeGLCode'].setValue(data.Id);
        this.detailsData.AccProcessFeeGLDesc = data.Description;
        break;
      case AccountTypeGLType.DepositFeeGLCode:
        this.accountTypeForm.controls['AccDepositFeeGLCode'].setValue(data.Id);
        this.detailsData.AccDepositFeeGLDesc = data.Description;
        break;
    }
  }

  public onUpdate() {
    if (confirm('Are you sure you want to Update information?')) {
      this.spinner.show();
      var fValue = this.accountTypeForm.value;
      fValue.AccCertNo=fValue.AccCertNo?1:0;
      fValue.AccDivident=fValue.AccDivident?1:0;
      fValue.AccessT1=fValue.AccessT1?1:0;
      fValue.AccessT2=fValue.AccessT2?1:0;
      let selectedVal = this.inputHelpData.AccountClassList.find(x=>x.Id==fValue.AccTypeClass);
      fValue.AccTypeClassDesc = selectedVal.Description;
      console.log('==========fvalue', fValue)
      this.accountTypeService.update(fValue).pipe(takeUntil(this.destroy$)).subscribe(res => {
        console.log('==========Testinggg', res)
        if (res.Success) {
          this.spinner.hide();
          alert("Information Updated !");
        }
        else
        {
          this.spinner.hide();
          alert("Sorry You Cannot Update Data..Please Check Wheather You Are Using Duplicate GLCode!!!");
          location.reload();

        }
      }, err => {
        this.spinner.hide();
        this.toaster.error("Something Went Wrong !", "Error");
      });
    }
  }

  public onSubmit() {
    if (confirm('Are you sure you want to Submit information?')) {
      var fValue = this.accountTypeForm.value;
      if(fValue.AccTypeCode.toString().length!=3){
        alert('Account Type Code should be 3 digit.'); return;
      }
      this.spinner.show();
      fValue.AccCertNo=fValue.AccCertNo?1:0;
      fValue.AccDivident=fValue.AccDivident?1:0;
      fValue.AccessT1=fValue.AccessT1?1:0;
      fValue.AccessT2=fValue.AccessT2?1:0;
      let selectedVal = this.inputHelpData.AccountClassList.find(x=>x.Id==fValue.AccTypeClass);
      fValue.AccTypeClassDesc = selectedVal.Description;
      console.log('==========fvalue', fValue)
      this.accountTypeService.submit(fValue).pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res.Success) {
          this.spinner.hide();
          alert("Information Submited !");
          location.reload();
        }
      }, err => {
        this.spinner.hide();
        this.toaster.error("Something Went Wrong !", "Error");
      });
    }
  }

  public updateMiscellaneousAcc() {
    if (confirm('Are you sure you want to save information?')) {
      this.spinner.show();
      this.accountTypeService
        .updateMiscellaneousAcc()
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res) => {
            if (res.Success) {
              this.spinner.hide();
              alert('Information Updated !');
            }
          },
          (err) => {
            this.spinner.hide();
            this.toaster.error('Something Went Wrong !', 'Error');
          }
        );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //enter key events
  onEnterAccTypeDescriptionHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`AccTypeShortDescription`).focus();
  }
  onEnterAccTypeShortDescriptionHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`AccDepRoundingBy`).focus();
  }
}
