import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { IdDescription } from 'src/app/interfaces/id-description';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SelectListFilter } from 'src/app/filters/select-list-filter';
import { first, takeUntil } from 'rxjs/operators';
import { ApplicationCommonService } from 'src/app/services/application-common.service';
import {
  TransferBalanceViewModel,
  TransferFromModel,
  TransferToModel,
} from '../../../models/special-account-balance-transfer.model';
import { SpecialBalanceTransferService } from '../../../services/special-balance-transfer.service';
import { ReportCommonService } from 'src/app/services/report-common.service';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-account-balance-transfer',
  templateUrl: './account-balance-transfer.component.html',
  styleUrls: ['./account-balance-transfer.component.css'],
})
export class AccountBalanceTransferComponent implements OnInit, OnDestroy {
  public accountTypeList: IdDescription[] = [];
  setupForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  public fromMemberDetails: TransferFromModel = new TransferFromModel();
  public toMemberDetails: TransferToModel = new TransferToModel();
  public fromAccountTypeList: IdDescription[];
  public toAccountTypeList: IdDescription[];
  public balanceViewModel: TransferBalanceViewModel = new TransferBalanceViewModel();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  PrintFOptFlag: any;
  PrintFlag: any;
  displayIFrame = false;
  VoucherNo: any;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private commonService: ApplicationCommonService,
    private balanceTransferService: SpecialBalanceTransferService,
    private toaster: ToastrService,
    private aService: ReportCommonService
  ) {
    this.reportModel.ReportName = 'rptCSContraTransactionVchForBalTrnsfer';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm() {
    this.setupForm = this.fb.group({
      FromMemberNo: new FormControl('', [Validators.required]),
      FromAccountTypeCode: new FormControl('', [Validators.required]),
      FromAccountTypeId: new FormControl(''),
      ToMemberNo: new FormControl('', [Validators.required]),
      ToAccountTypeCode: new FormControl('', [Validators.required]),
      ToAccountTypeId: new FormControl(''),
      FromAccountNo: new FormControl(''),
      ToAccountNo: new FormControl(''),

      VoucherNo: new FormControl('', [Validators.required]),
      InterestAmount: new FormControl(''),
      PrincipleAmount: new FormControl(''),
      TransactionAmount: new FormControl('', [Validators.required]),
      FromDescription: new FormControl('', [Validators.required]),
      ToDescription: new FormControl('', [Validators.required]),
    });
    this.pageLoad();
  }

  public pageLoad() {
    this.commonService
      .getAccListDetails()
      .pipe(first())
      .subscribe((data: any) => {
        this.fromAccountTypeList = data.AccountTyeList;
        this.toAccountTypeList = data.AccountTyeList;
        console.log('AccData==>', this.fromAccountTypeList);
      });
  }

  //enter key events
  onEnterFromMemberNoHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`FromAccountTypeId`).focus();
  }
  onEnterVoucherNoHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`TransactionAmount`).focus();
  }
  onEnterTransactionAmountHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`FromDescription`).focus();
  }
  onEnterFromDescriptionHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`ToDescription`).focus();
  }

  onFromMemberChange(value: number): any {
    this.commonService
      .getMemberDetails(value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((sResponse) => {
        console.log('AllMemberInfo===>', sResponse);
        this.fromMemberDetails.Member = sResponse;
        this.fromMemberDetails.AccountNo = null;
        this.fromMemberDetails.Balance = null;
        this.fromMemberDetails.LienAmount = null;
        this.fromMemberDetails.LoanAmount = null;
        this.setupForm.controls['FromAccountTypeCode'].setValue('');
        this.setupForm.controls['FromAccountTypeId'].setValue('');
        // this.fromAccountTypeList = sResponse.AccountTyeList;
      });
  }

  onFromTypeChange(value: number): any {
    console.log('This is value>>', value);
    this.spinner.show();
    var item = new SelectListFilter().getItem(this.fromAccountTypeList, value);
    this.setupForm.controls['FromAccountTypeCode'].setValue(
      item != null ? item.Id : value
    );
    var formValue = this.setupForm.value;
    this.fromMemberDetails.AccTypeId = formValue.FromAccountTypeId;
    this.fromMemberDetails.AccountNo = null;
    this.fromMemberDetails.Balance = null;

    this.balanceTransferService
      .GetFromMemberDetails({ data: this.fromMemberDetails })
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (sResponse) => {
          if (sResponse.AccountNo) {
            console.log('This from member details >>', sResponse);
            this.fromMemberDetails = sResponse;
            if (this.fromMemberDetails.AccList.length === 1) {
              this.setupForm.controls['FromAccountNo'].setValue(
                this.fromMemberDetails.AccList[0]
              );
            } else {
              this.setupForm.controls['FromAccountNo'].setValue(0);
            }
            this.spinner.hide();
          } else {
            this.spinner.hide();
            this.toMemberDetails = sResponse;
            this.fromMemberDetails.AccountNo = null;
            this.fromMemberDetails.Balance = null;
            alert('Account Not Found!');
          }
        },
        (err) => {
          this.spinner.hide();
          this.fromMemberDetails = null;
          alert('Something went wrong.');
        }
      );
    document.getElementById(`ToMemberNo`).focus();
  }

  AccountNoChangeHandler = (e) => {
    this.fromMemberDetails.AccountNo = +e.target.value;
    this.spinner.show();
    this.balanceTransferService
      .GetFromMemberDetails({ data: this.fromMemberDetails })
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (sResponse) => {
          if (sResponse.AccountNo) {
            console.log('This from member details by AccNo >>', sResponse);
            this.fromMemberDetails = sResponse;
            if (this.fromMemberDetails.AccList.length === 1) {
              this.setupForm.controls['FromAccountNo'].setValue(
                this.fromMemberDetails.AccList[0]
              );
            } else {
              this.setupForm.controls['FromAccountNo'].setValue(0);
            }
            this.spinner.hide();
          } else {
            this.spinner.hide();
            this.toMemberDetails = sResponse;
            this.fromMemberDetails.AccountNo = null;
            this.fromMemberDetails.Balance = null;
            alert('Account Not Found!');
          }
        },
        (err) => {
          this.spinner.hide();
          this.fromMemberDetails = null;
          alert('Something went wrong.');
        }
      );
    document.getElementById(`ToMemberNo`).focus();
  };

  onToMemberChange(value: number): any {
    this.commonService
      .getMemberDetails(value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((sResponse) => {
        this.toMemberDetails.Member = sResponse;
        this.toMemberDetails.AccountNo = null;
        this.toMemberDetails.Balance = null;
        this.toMemberDetails.LienAmount = null;
        this.setupForm.controls['ToAccountTypeCode'].setValue('');
        this.setupForm.controls['ToAccountTypeId'].setValue('');
        //this.toAccountTypeList = sResponse.AccountTyeList;
      });
    document.getElementById(`ToAccountTypeId`).focus();
  }

  onToTypeChange(value: number): any {
    this.spinner.show();
    var item = new SelectListFilter().getItem(this.toAccountTypeList, value);
    this.setupForm.controls['ToAccountTypeCode'].setValue(
      item != null ? item.Id : value
    );
    var formValue = this.setupForm.value;
    this.toMemberDetails.AccTypeId = formValue.ToAccountTypeId;
    this.toMemberDetails.AccountNo = null;
    this.toMemberDetails.Balance = null;
    this.balanceTransferService
      .GetToMemberDetails(this.toMemberDetails)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (sResponse) => {
          if (sResponse.AccountNo) {
            console.log('This To member details >>', sResponse);
            this.toMemberDetails = sResponse;
            if (this.toMemberDetails.AccList.length === 1) {
              this.setupForm.controls['ToAccountNo'].setValue(
                this.toMemberDetails.AccList[0]
              );
            } else {
              this.setupForm.controls['ToAccountNo'].setValue(0);
            }
            this.spinner.hide();
          } else {
            this.spinner.hide();
            this.toMemberDetails = sResponse;
            this.toMemberDetails.AccountNo = null;
            this.toMemberDetails.Balance = null;
            alert('Account Not Found!');
          }
        },
        (err) => {
          this.spinner.hide();
          this.fromMemberDetails = null;
          alert('Something went wrong.');
        }
      );
    document.getElementById(`VoucherNo`).focus();
  }

  ToAccountNoChangeHandler = (e) => {
    this.toMemberDetails.AccountNo = +e.target.value;
    this.spinner.show();
    this.balanceTransferService
      .GetToMemberDetails(this.toMemberDetails)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (sResponse) => {
          if (sResponse.AccountNo) {
            console.log('This To member details >>', sResponse);
            this.toMemberDetails = sResponse;
            if (this.toMemberDetails.AccList.length === 1) {
              this.setupForm.controls['ToAccountNo'].setValue(
                this.toMemberDetails.AccList[0]
              );
            } else {
              this.setupForm.controls['ToAccountNo'].setValue(0);
            }
            this.spinner.hide();
          } else {
            this.spinner.hide();
            this.toMemberDetails = sResponse;
            this.toMemberDetails.AccountNo = null;
            this.toMemberDetails.Balance = null;
            alert('Account Not Found!');
          }
        },
        (err) => {
          this.spinner.hide();
          this.fromMemberDetails = null;
          alert('Something went wrong.');
        }
      );
    document.getElementById(`VoucherNo`).focus();
  };

  calculateTransAmount(intAmount: string, pAmount: string) {
    let total =
      (isNaN(parseInt(intAmount)) ? 0 : parseInt(intAmount)) +
      (isNaN(parseInt(pAmount)) ? 0 : parseInt(pAmount));
    this.setupForm.controls['TransactionAmount'].setValue(total);
  }

  onSubmit(): void {
    if (this.setupForm.invalid) {
      alert('Please enter required fields.');
      return;
    }
    this.spinner.show();
    var formValue = this.setupForm.value;
    this.balanceViewModel.TransferFrom = this.fromMemberDetails;
    this.balanceViewModel.TransferTo = this.toMemberDetails;
    this.balanceViewModel.TransferTo.VoucherNo = formValue.VoucherNo;
    this.balanceViewModel.TransferTo.TransactionAmount =
      formValue.TransactionAmount;
    this.balanceViewModel.TransferTo.FromDescription =
      formValue.FromDescription;
    this.balanceViewModel.TransferTo.ToDescription = formValue.ToDescription;

    this.balanceViewModel.TransferTo.InterestAmount = formValue.InterestAmount;
    this.balanceViewModel.TransferTo.PrincipleAmount =
      formValue.PrincipleAmount;

    this.balanceTransferService
      .Transfer(this.balanceViewModel)
      .pipe(takeUntil(this.destroy$))
      .subscribe((sResponse) => {
        if (sResponse.Success) {
          alert('Account Transfer Successfully Done');
          this.spinner.hide();
          console.log(
            'this.fromMemberDetails.Member.VPrintFlag=',
            this.fromMemberDetails.Member.VPrintFlag
          );
          if (
            this.fromMemberDetails.Member.VPrintFlag == '1' &&
            this.fromMemberDetails.Member.VPrintFOptFlag == '1'
          ) {
            this.getReportToken();
          } else {
            location.reload();
          }
        } else {
          alert(sResponse.Message);
          return;
        }

        //location.reload();
      });
  }

  public getReportToken = () => {
    if (this.setupForm.controls['FromMemberNo'].value == '') {
      alert('Please Input Member Number!');
      return;
    }
    this.spinner.show();
    this.setParameter();
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
  private setParameter(): void {
    var fValue = this.setupForm.value;
    this.reportModel.Values = [];
    this.reportModel.ReportName = 'rptCSContraTransactionVchForBalTrnsfer';
    console.log('PushedVaalue:', fValue.MemberNo);
    this.reportModel.Values.push(
      new ReportKeyValue('MemberNo', fValue.FromMemberNo)
    );
    this.reportModel.Values.push(
      new ReportKeyValue(
        'MemberName',
        this.fromMemberDetails.Member?.MemberName
      )
    );
    this.reportModel.Values.push(new ReportKeyValue('VchNo', fValue.VoucherNo));
  }

  private setIframe = (x: any) => {
    var iFramePath = environment.reportUrl + 'id=' + x.id + '&token=' + x.token;
    window.open(iFramePath, '_blank');
  };
}
