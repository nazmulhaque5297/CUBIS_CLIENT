import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { takeUntil } from 'rxjs/operators';
import {
  MemInfoAccountList,
  AccountTransferViewModel,
} from 'src/app/modules/accounting/models/special-account-transfer.model';
import { SpecialAccountTransferService } from '../../../services/special-account-transfer.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-account-transfer',
  templateUrl: './account-transfer.component.html',
  styleUrls: ['./account-transfer.component.css'],
})
export class AccountTransferComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  AccountTransferForm: FormGroup;
  public MemAndAccTypeInfo: MemInfoAccountList = new MemInfoAccountList();
  public TransferViewModel: AccountTransferViewModel = new AccountTransferViewModel();

  constructor(
    private SpecialAccountTransferService: SpecialAccountTransferService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm() {
    this.AccountTransferForm = new FormGroup({
      MemNo: new FormControl('', [Validators.required]),
      AccountType: new FormControl(''),
      SelectedAccountType: new FormControl('0'),
      AccountNo: new FormControl(''),
      LedgerBalance: new FormControl(''),
      TrnMemNo: new FormControl('', [Validators.required]),
    });
  }

  // enter key events
  onEnterMemNoHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`AccountType`).focus();
  }
  onEnterAccountTypeHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`TrnMemberNo`).focus();
  }

  changeMemberNoHandler = (e) => {
    this.spinner.show();
    this.SpecialAccountTransferService.GetMemberAndAccTypeInfo(+e.target.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          this.AccountTransferForm.controls['MemNo'].setValue('');
          this.MemAndAccTypeInfo = null;
          alert(data.Message);
          return;
        }
        this.MemAndAccTypeInfo = data;
      });
  };

  AccountTypeChangeHandler = (e) => {
    this.TransferViewModel.MemNo = this.MemAndAccTypeInfo.MemNo;
    this.TransferViewModel.MemType = this.MemAndAccTypeInfo.MemType;
    this.TransferViewModel.AccType = +e.target.value;
    this.spinner.show();
    this.SpecialAccountTransferService.GetAccTypeInfo(this.TransferViewModel)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          this.AccountTransferForm.controls['AccountType'].setValue('');
          this.AccountTransferForm.controls['SelectedAccountType'].setValue('');
          this.TransferViewModel = null;
          alert(data.Message);
          return;
        }
        this.TransferViewModel = data;
        this.AccountTransferForm.controls['AccountType'].setValue(
          this.TransferViewModel.AccType
        );
        this.AccountTransferForm.controls['SelectedAccountType'].setValue(
          this.TransferViewModel.AccType
        );
        if (this.TransferViewModel.AccList.length === 1) {
          this.AccountTransferForm.controls['AccountNo'].setValue(
            this.TransferViewModel.AccList[0]
          );
          this.AccountTransferForm.controls['LedgerBalance'].setValue(
            this.TransferViewModel.AccBalance
          );
        } else {
          this.AccountTransferForm.controls['AccountNo'].setValue(0);
        }
      });
    document.getElementById(`TrnMemberNo`).focus();
  };

  AccountNoChangeHandler = (e) => {
    this.TransferViewModel.AccNo = +e.target.value;
    this.spinner.show();
    this.SpecialAccountTransferService.GetAccNoInfo(this.TransferViewModel)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          alert(data.Message);
          return;
        }
        this.TransferViewModel.AccBalance = data.AccBalance;
        this.AccountTransferForm.controls['LedgerBalance'].setValue(
          data.AccBalance
        );
      });
  };

  TrnMemChangeHandler = (e) => {
    this.TransferViewModel.TrnMemNo = +e.target.value;
    this.spinner.show();
    this.SpecialAccountTransferService.GetTrnMemDetails(this.TransferViewModel)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          alert(data.Message);
          this.AccountTransferForm.controls['TrnMemNo'].setValue('');
          return;
        }
        this.TransferViewModel = data;
      });
  };

  Transfer() {
    if (this.AccountTransferForm.invalid) {
      alert('Fillup the Require Field');
      return;
    }
    this.spinner.show();
    this.TransferViewModel.MemNo = this.AccountTransferForm.value.MemNo;
    this.SpecialAccountTransferService.Transfer(this.TransferViewModel)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          alert(data.Message);
          return;
        }
        alert(data.Message);
        setTimeout(() => {
          location.reload();
        }, 1000);
      });
  }
}
