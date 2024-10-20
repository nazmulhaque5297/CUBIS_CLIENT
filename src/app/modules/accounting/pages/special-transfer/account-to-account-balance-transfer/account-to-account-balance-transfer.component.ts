import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { first, takeUntil } from 'rxjs/operators';
import { AccountTypeClassModel } from './../../../../Models/HoseKeepingModel';
import { AccountingService } from './../../../services/accounting.service';
import { select, Store } from '@ngrx/store';
import { IApplicationCommonModel } from 'src/app/Models/Common.model';
import { getCommonData } from 'src/app/selector/user.selectors';
import { Router } from '@angular/router';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-account-to-account-balance-transfer',
  templateUrl: './account-to-account-balance-transfer.component.html',
  styleUrls: ['./account-to-account-balance-transfer.component.css'],
})
export class AccountToAccountBalanceTransferComponent implements OnInit {
  AccountBalanceTransfer: FormGroup;
  accTypeList = [];
  FromAccType: string = '';
  ToAccType: string = '';
  GLDebitCode: string = '';
  GLCreditCode: string = '';
  ProcessDate: string = '';
  commonData: IApplicationCommonModel;
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();

  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  constructor(
    private AccountingService: AccountingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private store: Store,
    private router: Router,
    private sanitizer: DomSanitizer,
    private aService: ReportCommonService
  ) {}

  ngOnInit(): void {
    this.getAccountTypeList();
    this.initializeForm();
  }

  private initializeForm() {
    this.AccountBalanceTransfer = new FormGroup({
      FromAccountTypeId: new FormControl(''),
      SelectedFromAccountType: new FormControl('0'),
      ToAccountTypeId: new FormControl(''),
      SelectedToAccountType: new FormControl('0'),
      FromLastOpenDate: new FormControl(''),
      ToLastOpenDate: new FormControl(''),
      TransferAmount: new FormControl(''),
      GLDebitCode: new FormControl(''),
      GLCreditCode: new FormControl(''),
      VoucherNo: new FormControl(''),
      Description: new FormControl(''),
    });
    this.store
      .pipe(select(getCommonData))
      .subscribe((cData: IApplicationCommonModel) => {
        this.commonData = cData;
        console.log("Alll Load Dat",cData);
        this.AccountBalanceTransfer.controls['FromLastOpenDate'].setValue(
          this.commonData?.ProcessDate
        );
        this.AccountBalanceTransfer.controls['ToLastOpenDate'].setValue(
          this.commonData?.ProcessDate
        );
       
      });
  }
  getAccountTypeList = () => {
    this.spinner.show();
    this.AccountingService.getAccountTypeForBalanceTransfer()
      .pipe(first())
      .subscribe(
        (x: AccountTypeClassModel[]) => {
          this.spinner.hide();
          this.accTypeList = x;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  // enter key events
  onEnterTransferAmountHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`VoucherNo`).focus();
  }
  onEnterVoucherNoHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`Description`).focus();
  }

  selectFromAccountTypeChangeHandler = (e) => {
    this.FromAccType = e.target.value;
    if (this.FromAccType == this.ToAccType && this.FromAccType != '0') {
      alert('Invalid Account Type!');
      this.initializeForm();
      return;
    }
    if (this.FromAccType == '0') {
      return;
    }

    this.spinner.show();
    this.AccountingService.GetGLDebitCode(+this.FromAccType)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          if (x.GLCode == null) {
            alert('Account Not In File!');
            // this.initializeForm();
            return;
          } else {
            this.GLDebitCode = x.GLCode;
            this.AccountBalanceTransfer.patchValue({
              FromAccountTypeId: this.FromAccType,
              GLDebitCode: this.GLDebitCode,
            });
            console.log('x', x.GLDebitCode);
          }
        },
        (err) => {
          this.spinner.hide();
        }
      );
    this.AccountBalanceTransfer.controls['SelectedFromAccountType'].setValue(
      e.target.value
    );
    document.getElementById(`ToAccountTypeId`).focus();
  };
  selectToAccountTypeChangeHandler = (e) => {
    this.ToAccType = e.target.value;
    if (this.FromAccType == this.ToAccType && this.ToAccType != '0') {
      alert('Invalid Account Type!');
      this.initializeForm();
      return;
    }
    if (this.ToAccType == '0') {
      return;
    }

    this.spinner.show();
    this.AccountingService.GetGLDebitCode(+this.ToAccType)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          if (x.GLCode == null) {
            alert('Account Not In File!');
            // this.initializeForm();
            return;
          } else {
            this.GLCreditCode = x.GLCode;
            this.AccountBalanceTransfer.patchValue({
              ToAccountTypeId: this.ToAccType,
              GLCreditCode: this.GLCreditCode,
            });
            console.log('x', x.GLDebitCode);
          }
        },
        (err) => {
          this.spinner.hide();
        }
      );
    this.AccountBalanceTransfer.controls['SelectedToAccountType'].setValue(
      e.target.value
    );
    document.getElementById(`TransferAmount`).focus();
  };

  ProcessHandler = () => {
    if (!this.FromAccType || !this.ToAccType) {
      alert('Please Select Account Type!');
      return;
    }
    this.spinner.show();
    let FormData = this.AccountBalanceTransfer.value;
    let ProcerssData = {
      FromAccountTypeId: FormData.FromAccountTypeId,
      ToAccountTypeId: FormData.ToAccountTypeId,
      FromLastOpenDate: FormData.FromLastOpenDate,
      ToLastOpenDate: FormData.ToLastOpenDate,
      TransferAmount: FormData.TransferAmount,
      ProcessDate: this.ProcessDate,
    };

    this.AccountingService.ProcessAccountBalanceTransfer(ProcerssData)
      .pipe(first())
      .subscribe(
        (x: any) => {
          console.log('x', x);
          if (x == 1) {
            alert('Process Done !');
          }

          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  PostHandler = () => {
    let FormData = this.AccountBalanceTransfer.value;
    if (!this.FromAccType || !this.ToAccType) {
      alert('Please Select Account Type!');
      return;
    }
    this.spinner.show();
    let ProcerssData = {
      VchNo: FormData.VoucherNo,
      Description: FormData.Description,
      GLDebitCode: this.GLDebitCode,
      GLCreditCode: this.GLCreditCode,
    };
    console.log(ProcerssData);
    this.AccountingService.PostAccountBalanceTransfer(ProcerssData)
      .pipe(first())
      .subscribe(
        (x: any) => {
          console.log(x);
          if (x.Success == true) {
            this.initializeForm();
            console.log('x', x);
            alert('Transaction Succesfully done !');
            this.spinner.hide();
            return;
          }
          alert('Transaction error !');
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  ReverseHandler = () => {
    let FormData = this.AccountBalanceTransfer.value;
    if (!FormData.VoucherNo) {
      alert('Please Insert Member No!');
      return;
    }
    this.spinner.show();

    let ReverseData = {
      VchNo: FormData.VoucherNo,
    };

    this.AccountingService.ReverseAccountBalanceTransfer(ReverseData)
      .pipe(first())
      .subscribe(
        (x: any) => {
          if (x == 1) {
            this.initializeForm();
            console.log('x', x);
            alert('Transaction Reversed !');
            this.spinner.hide();
            return;
          }
          alert("Transaction Reversed didn't complete!");
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  exitPage() {
    this.router.navigate(['accounting/']);
  }

  private setParameter(): void {
    this.reportModel.ReportName = 'rptCsAccountBalanceTrfList';

    var fValue = this.AccountBalanceTransfer.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue('ProcessDate', this.commonData.ProcessDate)
    );
  }

  public getReportToken = () => {
    this.setParameter();
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
          location.reload();
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
