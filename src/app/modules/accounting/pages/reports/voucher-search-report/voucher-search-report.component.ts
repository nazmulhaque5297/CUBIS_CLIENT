import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { first, takeUntil } from 'rxjs/operators';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { ReportCommonService } from 'src/app/services/report-common.service';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { ReportEnum } from 'src/app/enums/report-enum';
import { FormGroup, FormControl } from '@angular/forms';
import { VoucherSearchReportComponentService } from 'src/app/services/voucher-search-report.service';
import { DatePipe } from '@angular/common';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';

@Component({
  selector: 'app-voucher-search-report',
  templateUrl: './voucher-search-report.component.html',
  styleUrls: ['./voucher-search-report.component.css'],
})
export class VoucherSearchReportComponent implements OnInit, OnDestroy {
  module: string = '1';
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  GLTransactionVchForm: FormGroup;
  memInfo = [];
  url: any;
  msg = '';
  VoucherReportForm: FormGroup;
  voucherList: any[];
  storeVDate: any;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    public datepipe: DatePipe,
    private voucherService: VoucherSearchReportComponentService,
    private aService: ReportCommonService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.reportModel.ReportName = 'rptCSSearchVchTransaction';
    this.reportModel.Values = [];
  }

  getResolvedUrl(route: ActivatedRouteSnapshot): string {
    let url = route.pathFromRoot
      .map((v) => v.url.map((segment) => segment.toString()).join('/'))
      .join('/');
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
    var urlData = this.getResolvedUrl(this.route.snapshot);
    if (urlData == 'booth') this.module = '3';
    else if (urlData == 'accounting') this.module = '1';
    this.initializeForm();
  }
  private initializeForm() {
    this.VoucherReportForm = new FormGroup({
      CustomerServiceRb: new FormControl('0'),

      VoucherDate: new FormControl(''),
      VoucherNo: new FormControl('0'),
    });
    this.pageLoad();
  }
  public searchButtonClick() {
    var fv = this.VoucherReportForm.value;
    var dataD = this.VoucherReportForm.value.VoucherDate.toString();
    console.log(dataD.length);
    console.log('ButtonValue:', this.VoucherReportForm.value.CustomerServiceRb);
    if (dataD.length > 10) {
      var value = this.datepipe.transform(fv.VoucherDate, 'dd-MM-yyyy');
      this.VoucherReportForm.value.VoucherDate = this.voucherService.convertDateToString(
        value
      );
      console.log(this.voucherService.convertDateToString(value));
      dataD = this.voucherService.convertDateToString(value);
    }
    console.log('DateCheck:', dataD);
    this.voucherService
      .VoucherSearchButton(
        dataD,
        this.VoucherReportForm.value.CustomerServiceRb
      )
      .pipe(first())
      .subscribe((data: any) => {
        console.log(data);
        this.voucherList = data;
      });
  }
  public pageLoad() {
    this.voucherService
      .VoucherSearchReportPageLoad()
      .pipe(first())
      .subscribe((data: any) => {
        console.log(data);
        this.VoucherReportForm.controls['VoucherDate'].setValue(
          data.VoucherDate
        );
        this.storeVDate = data.VoucherDate;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // dateChange(){
  //   var fv = this.VoucherReportForm.value;
  //   var value = this.datepipe.transform(fv.ApplicationDate, 'dd-MM-yyyy');
  //   this.VoucherReportForm.value.ApplicationDate = this.voucherService.convertDateToString(value);
  //   console.log(this.VoucherReportForm.value);
  // }

  //  public getReportToken = () => {
  //     this.spinner.show();
  //       this.aService.getReportToken(this.reportModel).pipe(takeUntil(this.destroy$)).subscribe(x => {
  //       this.setIframe(x);
  //       this.spinner.hide();
  //     }, err => {
  //       this.spinner.hide();
  //     })
  //   }
  public getReportToken = (type: any) => {
    this.spinner.show();
    this.setParameter();
    this.displayIFrame = true;
    console.log(this.reportModel);
    this.aService
      .getReportToken(this.reportModel)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (x) => {
          if (type === 'CRV') {
            this.setIframeCRV(x);
          } else {
            this.setIframe(x);
          }
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
    // }
  };
  private setParameter(): void {
    var fValue = this.VoucherReportForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue('CustomerServiceRb', fValue.CustomerServiceRb)
    );

    this.reportModel.Values.push(
      new ReportKeyValue('VoucherDate', this.storeVDate)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('VoucherNo', fValue.VoucherNo)
    );
    console.log(this.reportModel.Values);
  }

  private setIframe = (x: any) => {
    var iFramePath = environment.reportUrl + 'id=' + x.id + '&token=' + x.token;

    window.open(iFramePath, '_blank');
  };

  private setIframeCRV = (x: any) => {
    var iFramePath =
      environment.reportUrl +
      'id=' +
      x.id +
      '&token=' +
      x.token +
      '&type=crViewer';

    window.open(iFramePath, '_blank');
  };

  // printButtonClick() {
  //   this.getReportToken();
  //   this.displayIFrame = true;
  // }

  applicationDateChange() {
    var fv = this.VoucherReportForm.value;
    var value = this.datepipe.transform(fv.VoucherDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.VoucherReportForm.value.VoucherDate = formatedValue;
    this.storeVDate = formatedValue;
    console.log(this.storeVDate);
  }
}
