import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { first, takeUntil } from 'rxjs/operators';
import { AccountingService } from './../../services/accounting.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { select, Store } from '@ngrx/store';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { getCommonData } from 'src/app/selector/user.selectors';

@Component({
  selector: 'app-auto-instruction-deposit-process',
  templateUrl: './auto-instruction-deposit-process.component.html',
  styleUrls: ['./auto-instruction-deposit-process.component.css'],
})
export class AutoInstructionDepositProcessComponent implements OnInit {
  AutoInstructionDepositProcessForm: FormGroup;
  accTypeList = [];
  accInfoList: any = [];
  InstructionDepositList = [];
  AccType: string = '';
  AccTypeClass: string = '';
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  commonDataInfo: any;
  constructor(
    private AccountingService: AccountingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private aService: ReportCommonService,
    private store: Store,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.store.pipe(select(getCommonData)).subscribe((commonInfo: any) => {
      this.commonDataInfo = commonInfo;
    });
    this.initializeForm();
    this.getAccountTypeList();
  }

  private initializeForm() {
    this.AutoInstructionDepositProcessForm = new FormGroup({
      SelectedAccountType: new FormControl('0'),
      VoucherNo: new FormControl(''),
    });
  }

  getAccountTypeList = () => {
    this.spinner.show();
    this.AccountingService.getAccountTypeForAutoInstruction()
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.accTypeList = x;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  selectAccountTypeChangeHandler = (e) => {
    this.spinner.show();
    this.AccType = e.target.value;
    this.AccountingService.getAccountInfoAndFieldControl(+this.AccType)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.AccTypeClass = x.AccTypeClass;
          this.accInfoList = x;
          console.log('this.accInfoList ', this.accInfoList);
        },
        (err) => {
          this.spinner.hide();
        }
      );
    document.getElementById(`VoucherNo`).focus();
  };

  CalculateInstructionDepositList = () => {
    if (!this.AccType) {
      alert('Account Type Not Found!');
      return;
    }
    this.spinner.show();
    let FormData = {
      AccType: this.AccType,
    };
    this.AccountingService.CalculateInstructionDepositList(FormData)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.InstructionDepositList = [];
          alert('Calculation Done!');
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  VerifyCalculateInstructionDepositList = () => {
    this.spinner.show();
    this.AccountingService.GetInstructionDepositList(
      +this.AccTypeClass,
      +this.AccType
    )
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.InstructionDepositList = x;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  PostDepositList = () => {
    let FormData = this.AutoInstructionDepositProcessForm.value;
    let StatusFormData = {
      ClassType: +this.AccTypeClass,
      VchNo: FormData.VoucherNo,
      AccType: +this.AccType,
    };
    if (!StatusFormData.VchNo) {
      alert('Required Voucher No.!');
      return;
    }
    this.spinner.show();
    this.AccountingService.PostDeposit(StatusFormData)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          if (!x.Success) {
            alert(x.Message);
            return;
          }
          this.InstructionDepositList = [];
          this.accInfoList = x;
          alert(x.Message);
          this.setParameter1();
          this.getReportToken();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  ReverseDepositList = () => {
    let FormData = this.AutoInstructionDepositProcessForm.value;
    let StatusFormData = {
      ClassType: +this.AccTypeClass,
      VchNo: FormData.VoucherNo,
      AccType: +this.AccType,
    };
    if (!StatusFormData.VchNo) {
      alert('Required Voucher No.!');
      return;
    }
    this.spinner.show();
    this.AccountingService.ReverseDeposit(StatusFormData)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          if (!x.Success) {
            alert(x.Message);
            return;
          }
          this.accInfoList = x;
          this.AutoInstructionDepositProcessForm.controls['VoucherNo'].setValue(
            ''
          );
          alert(x.Message);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  DeleteInstructionDepositAccount = (Id) => {
    this.spinner.show();
    this.AccountingService.DeleteInstructionAccount(+Id)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.InstructionDepositList = this.InstructionDepositList?.filter(
            (item) => item.Id !== Id
          );
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  UpdateItem = (item: any) => {
    let UpdateFormData = {
      Id: item.Id,
      AccTransDepAmt: item.AccTransDepAmt,
      AccTransPenaltyAmt: item.AccTransPenaltyAmt,
      AccNetTransAmt: item.AccNetTransAmt,
      AccCorrAccBalance: item.AccCorrAccBalance,
      ProcFlag: item.ProcFlag == true ? 1 : 0,
      ClassType: +this.AccTypeClass,
    };
    this.spinner.show();
    this.AccountingService.UpdateDeposit(UpdateFormData)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          alert('Updated Sucessfully !');
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  private setParameter1(): void {
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue('ProcessDate', this.commonDataInfo.ProcessDate)
    );

    this.reportModel.Values.push(
      new ReportKeyValue(
        'VoucherNo',
        this.AutoInstructionDepositProcessForm.value.VoucherNo
      )
    );
    this.reportModel.ReportName = 'rptCSSumTransactionVch';
  }

  setParameter2(): void {
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue('ProcessDate', this.commonDataInfo.ProcessDate)
    );

    this.reportModel.Values.push(
      new ReportKeyValue(
        'AccountType',
        this.AutoInstructionDepositProcessForm.value.SelectedAccountType
      )
    );

    let selectedCode = this.accTypeList.find(
      (x) =>
        x.Id == this.AutoInstructionDepositProcessForm.value.SelectedAccountType
    );
    this.reportModel.Values.push(
      new ReportKeyValue('AccountTypeDesc', selectedCode.Description)
    );
    if (this.AccTypeClass == '1') {
      this.reportModel.ReportName = 'rptAutoDeposit3List';
    } else if (this.AccTypeClass == '2') {
      this.reportModel.ReportName = 'rptAutoDeposit1List';
    } else {
      this.reportModel.ReportName = 'rptAutoDeposit2List';
    }
    this.getReportToken();
  }

  public getReportToken = () => {
    this.spinner.show();
    this.displayIFrame = true;
    console.log(this.reportModel);
    this.aService
      .getReportToken(this.reportModel)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (x) => {
          this.setIframe(x);
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  private setIframe = (x: any) => {
    var iFramePath = environment.reportUrl + 'id=' + x.id + '&token=' + x.token;

    window.open(iFramePath, '_blank');
  };
}
