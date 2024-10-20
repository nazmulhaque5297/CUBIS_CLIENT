import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IdDescription } from 'src/app/interfaces/id-description';
import { ITransactionControl } from '../../../models/transaction-control-setup.model';
import { TransactionControlSetupService } from '../../../services/transaction-control-setup.service';

@Component({
  selector: 'app-master-transaction-control',
  templateUrl: './master-transaction-control.component.html',
  styleUrls: ['./master-transaction-control.component.css'],
})
export class MasterTransactionControlComponent implements OnInit, OnDestroy {
  setupForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  public accountClassList: IdDescription[] = [];
  public transactionFlagList: IdDescription[] = [];
  AccountItems: FormArray;

  constructor(
    private pService: TransactionControlSetupService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getClassList();
    this.getTransactionFlags();
  }

  private initializeForm() {
    this.setupForm = this.fb.group({
      AccountClassId: new FormControl('0', [Validators.required]),
      AccountItems: this.fb.array([]),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getClassList(): void {
    this.spinner.show();
    this.pService
      .GetAccountClassList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.accountClassList = data;
        this.spinner.hide();
      });
  }

  private getTransactionFlags(): void {
    this.pService
      .GetTransactionControlFlags()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.transactionFlagList = data;
      });
  }

  onAccountClassChange(id: number): void {
    this.spinner.show();
    this.AccountItems = this.setupForm.get('AccountItems') as FormArray;
    while (this.AccountItems.length !== 0) {
      this.AccountItems.removeAt(0);
    }
    this.pService
      .GetTransControlList(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        data.forEach((x) => {
          this.addItem(x);
        });
        this.spinner.hide();
      });
  }

  public addItem(x: ITransactionControl): void {
    this.AccountItems = this.setupForm.get('AccountItems') as FormArray;
    this.AccountItems.push(this.AddToItems(x));
  }

  private AddToItems(x: ITransactionControl): FormGroup {
    return this.fb.group({
      AccTypeClass: [x.AccTypeClass],
      FuncOpt: [x.FuncOpt],
      FuncOptDesc: [x.FuncOptDesc],
      TrnRecDesc: [x.TrnRecDesc],
      GLAccNoDR: [x.GLAccNoDR],
      GLAccDRFlag: [x.GLAccDRFlag],
      GLAccNoCR: [x.GLAccNoCR],
      GLAccCRFlag: [x.GLAccCRFlag],
      PayType: [x.PayType],
    });
  }

  onUpdate(): void {
    if (this.setupForm.value.AccountClassId == 0) {
      alert('Please Fillup the Required Field!');
      return;
    } else {
      if (confirm('Are you sure you want to Update information?')) {
        this.spinner.show();
        var fValue = this.setupForm.value.AccountItems;
        this.pService
          .Update(fValue)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data) => {
            this.spinner.hide();
            alert('Data updated successfully');
          });
      }
    }
  }
}
