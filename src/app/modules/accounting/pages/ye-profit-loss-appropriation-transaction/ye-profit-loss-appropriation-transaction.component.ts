import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { IApplicationCommonModel } from 'src/app/Models/Common.model';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { environment } from 'src/environments/environment';
import { YearEndService } from '../../services/year-end.service';

@Component({
  selector: 'app-ye-profit-loss-appropriation-transaction',
  templateUrl: './ye-profit-loss-appropriation-transaction.component.html',
  styleUrls: ['./ye-profit-loss-appropriation-transaction.component.css'],
})
export class YeProfitLossAppropriationTransactionComponent implements OnInit {
  DataList: any[] = [];
  YEProLossAppTrnForm: FormGroup;
  pageLoadMessage: string;
  yearEndDate: string;
  showVoucher: boolean = false;
  commonData: IApplicationCommonModel;
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  cashCode: number;
  constructor(
    private yearEndService: YearEndService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private aService: ReportCommonService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.DataList = [];
    this.showVoucher = false;
  }

  initializeForm() {
    this.YEProLossAppTrnForm = new FormGroup({
      PrmYearEndDate: new FormControl(''),
      VoucherNo: new FormControl(''),
    });
    this.inputLoadData();
  }
  inputLoadData() {
    this.spinner.show();
    this.yearEndService
      .YEProfLossAppTrnLoad()
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          if (x.Success) {
            this.YEProLossAppTrnForm.controls['PrmYearEndDate'].setValue(
              x.PrmYearEndDate
            );
            this.yearEndDate = x.PrmYearEndDate;
            this.cashCode = x.GLCashCode;
            console.log(x);
          } else {
            this.pageLoadMessage = x.Message;
          }
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }
  exitPage() {
    this.router.navigate(['accounting/']);
  }

  processBtnClick() {
    this.spinner.show();
    this.DataList = [];
    this.yearEndService
      .GLYEProfLossApproProcessData(this.yearEndDate)
      .pipe(first())
      .subscribe((x: any) => {
        console.log(x);
        if (x.Success) {
          this.DataList = x.TransactionList;
          console.log(this.DataList);
          this.showVoucher = true;
        } else {
          alert(x.Message);
        }
        this.spinner.hide();
      });
  }

  postBtnClick() {
    if (this.YEProLossAppTrnForm.value.VoucherNo == '') {
      alert('Please enter voucher no.');
      return;
    }
    this.spinner.show();
    this.yearEndService
      .GLYEPoroLossAppPostData(
        this.YEProLossAppTrnForm.value.VoucherNo,
        this.cashCode
      )
      .pipe(first())
      .subscribe((x: any) => {
        this.spinner.hide();
        if (x.Success) {
          alert(x.Message);
          this.ngOnInit();
        } else {
          alert(x.Message);
        }
      });
  }

  public setParameter1(): void {
    this.reportModel.Values = [];
    this.reportModel.Values.push(new ReportKeyValue('fDate', this.yearEndDate));
    this.reportModel.ReportName = 'rptYEProfitLossAppropriationAccount';
    this.getReportToken();
  }

  public getReportToken = () => {
    this.spinner.show();
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
