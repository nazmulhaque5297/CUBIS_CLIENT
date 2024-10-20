import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { DailyReverseCsTransactionService } from 'src/app/services/daily-reverse-cs-transaction.service';
import { BudgetParameterService } from '../../services/accounting module/budget-parameter.service';

@Component({
  selector: 'app-daily-reverse-cs-transaction',
  templateUrl: './daily-reverse-cs-transaction.component.html',
  styleUrls: ['./daily-reverse-cs-transaction.component.css'],
})
export class DailyReverseCsTransactionComponent implements OnInit {
  module: string = '1';
  DailyReverseCSTrnForm: FormGroup;
  showOk: boolean = false;
  showDelete: boolean = false;
  searchBtnDis: boolean = true;
  DataList: any[] = [];
  ReverseTrnList: any[] = [];
  ReverseTrnAccList: any[] = [];
  TrnID: number;
  AccNo: number;
  PayType: number;
  FuncOpt: number;
  VoucherNo: string;
  constructor(
    private budgetParameterService: BudgetParameterService,
    private dailyReverseCSTrnService: DailyReverseCsTransactionService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  getResolvedUrl(route: ActivatedRouteSnapshot): string {
    let url = route.pathFromRoot
      .map((v) => v.url.map((segment) => segment.toString()).join('/'))
      .join('/');
    console.log(route.pathFromRoot);
    const queryParam = route.queryParamMap;
    if (queryParam.keys.length > 0) {
      url +=
        '?' +
        queryParam.keys
          .map((key) =>
            queryParam
              .getAll(key)
              .map((value) => key + '=' + value)
              .join('&')
          )
          .join('&');
    }
    return this.getModuleName(url);
  }
  getModuleName(urlData: any) {
    console.log(urlData);
    var result = '';
    for (var i = 1; i < urlData.length; i++) {
      if (urlData[i] == '/') return result;
      result += urlData[i];
    }
  }

  ngOnInit(): void {
    this.initializeForm();
    console.log(this.route.snapshot);
    var urlData = this.getResolvedUrl(this.route.snapshot);
    if (urlData == 'booth') this.module = '3';
    else if (urlData == 'accounting') this.module = '1';
    this.showOk = false;
    this.showDelete = false;
    this.searchBtnDis = true;
    this.ReverseTrnList = [];
    document.getElementById(`voucherNoInput`).focus();
  }
  initializeForm() {
    this.DailyReverseCSTrnForm = new FormGroup({
      VoucherNo: new FormControl(''),
      TransactionDate: new FormControl(''),
      UserLevel: new FormControl(''),
      ModuleNo: new FormControl(''),
    });
    this.inputLoadData();
  }
  inputLoadData() {
    this.spinner.show();
    this.dailyReverseCSTrnService
      .CSDailyReverseTrnLoadData()
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          console.log(x);
          this.DailyReverseCSTrnForm.controls['TransactionDate'].setValue(
            x.TransactionDate
          );
          this.DailyReverseCSTrnForm.controls['UserLevel'].setValue(
            x.UserLevel
          );
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }
  exitPage() {
    this.router.navigate(['accounting/']);
  }
  cancelClick() {
    this.DailyReverseCSTrnForm.controls['VoucherNo'].enable();
    this.ngOnInit();
  }
  onEnterAccTypeHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    else{
      this.onSearch();
    }
  }
  onSearch() {
    console.log(this.DailyReverseCSTrnForm.value.VoucherNo);
    if (this.DailyReverseCSTrnForm.value.VoucherNo == '') {
      alert('Please input the voucher no.');
    } else {
      this.DailyReverseCSTrnForm.controls['ModuleNo'].setValue(this.module);
      this.spinner.show();
      this.dailyReverseCSTrnService
        .FindDailyReverseCSTrnData(this.DailyReverseCSTrnForm.value)
        .pipe(first())
        .subscribe(
          (x: any) => {
            this.spinner.hide();
            console.log(x);
            if (x.Success == false) {
              alert(x.Message);
              this.DailyReverseCSTrnForm.controls['VoucherNo'].setValue('');
              this.ReverseTrnList = [];
              this.showDelete = false;
              this.DailyReverseCSTrnForm.controls['VoucherNo'].enable();
            } else {
              this.VoucherNo = this.DailyReverseCSTrnForm.value.VoucherNo;
              this.DailyReverseCSTrnForm.controls['VoucherNo'].disable();
              this.ReverseTrnList = x.ReverseTrnList;
              if (this.ReverseTrnList.length > 0) {
                this.TrnID = this.ReverseTrnList[0].TrnID;
                this.AccNo = x.AccountNo;
                this.PayType = x.PayType;
                this.FuncOpt = x.FuncOpt;
                this.showDelete = true;
                setTimeout(function(){
                  document.getElementById(`reverseButton`).focus();
                }, 500);
              }
            }
          },
          (err) => {
            this.spinner.hide();
          }
        );
    }
  }
  onDeleteEnterHandler(event: any){
    if( event.keyCode != 13 ) return;
    this.onDelete();
  }
  onDelete() {
    if (confirm('Are you you want to Delete information?')) {
      let data = {
        VoucherNo: this.VoucherNo,
        ReverseTrnList: this.ReverseTrnList,
        TrnID: this.TrnID,
        AccNo: this.AccNo,
        PayType: this.PayType,
        FuncOpt: this.FuncOpt,
        UserLevel: this.DailyReverseCSTrnForm.value.UserLevel,
        ModuleNo: this.module,
      };
      this.dailyReverseCSTrnService
        .CSDailyTrnReverseData(data)
        .pipe(first())
        .subscribe(
          (x: any) => {
            this.spinner.hide();
            if (!x.Success) {
              alert('Data reverse not possible.');
            } else {
              alert('Data reversed Successfully.');
              this.DailyReverseCSTrnForm.controls['VoucherNo'].enable();
              this.ngOnInit();
            }
          },
          (err) => {
            this.spinner.hide();
          }
        );
    }
  }
}
