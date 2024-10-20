import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { YearEndService } from '../../services/year-end.service';

@Component({
  selector: 'app-year-end-reverse-transaction',
  templateUrl: './year-end-reverse-transaction.component.html',
  styleUrls: ['./year-end-reverse-transaction.component.css'],
})
export class YearEndReverseTransactionComponent implements OnInit {
  YEReverseTrnForm: FormGroup;
  showOk: boolean = false;
  showDelete: boolean = false;
  searchBtnDis: boolean = true;
  DataList: any[] = [];
  constructor(
    private yearEndService: YearEndService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.showOk = false;
    this.showDelete = false;
    this.searchBtnDis = true;
    this.DataList = [];
  }

  initializeForm() {
    this.YEReverseTrnForm = new FormGroup({
      VoucherNo: new FormControl(''),
      CtrlTrnDate: new FormControl(''),
    });
    this.inputLoadData();
  }
  inputLoadData() {
    this.spinner.show();
    this.yearEndService
      .YERevTrnPageLoad()
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.showOk = x.ShowOk;
          this.YEReverseTrnForm.controls['CtrlTrnDate'].setValue(x.CtrlTrnDate);
        },
        (err) => {
          this.spinner.hide();
        }
      );
    if (this.showOk == true) {
      this.YEReverseTrnForm.controls['VoucherNo'].disable();
      this.searchBtnDis = false;
    }
  }
  exitPage() {
    this.router.navigate(['accounting/']);
  }
  onSearch() {
    if (this.YEReverseTrnForm.value.VoucherNo == '') {
      alert('Please input the voucher no.');
    } else {
      console.log(this.YEReverseTrnForm.value);
      this.yearEndService
        .YERevTrnSearchVoucher(
          this.YEReverseTrnForm.value.VoucherNo,
          this.YEReverseTrnForm.value.CtrlTrnDate
        )
        .pipe(first())
        .subscribe(
          (x: any) => {
            this.spinner.hide();
            console.log(x);
            if (x.Success == false) {
              this.toastr.error(x.Message, 'Error');
              this.YEReverseTrnForm.controls['VoucherNo'].setValue('');
            } else {
              console.log(x);
              for (var i = 0; i < x.TransactionList.length; i++) {
                this.DataList.push(x.TransactionList[i]);
              }
              this.showDelete = true;
            }
          },
          (err) => {
            this.spinner.hide();
          }
        );
    }
  }
  onDelete() {
    if (confirm('Are you you want to Delete information?')) {
      this.yearEndService
        .YERevTrnDeleteData(
          this.YEReverseTrnForm.value.VoucherNo,
          this.YEReverseTrnForm.value.CtrlTrnDate
        )
        .pipe(first())
        .subscribe(
          (x: any) => {
            this.spinner.hide();
            if (x.Success == false) {
              alert(x.Message);
            } else {
              alert(x.Message);
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
