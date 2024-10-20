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
import { FormControl, FormGroup } from '@angular/forms';
import { CoaReportInputHelp } from 'src/app/Models/coa-report.model';
import { CoaReportService } from 'src/app/services/coa-report.service';
import { IdDescription } from 'src/app/interfaces/id-description';

@Component({
  selector: 'app-chart-of-account-report',
  templateUrl: './chart-of-account-report.component.html',
  styleUrls: ['./chart-of-account-report.component.css'],
})
export class ChartOfAccountReportComponent implements OnInit, OnDestroy {
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  private reportModel: ReportCommonModel = new ReportCommonModel();
  private destroy$: Subject<void> = new Subject<void>();
  coaReportForm: FormGroup;
  public inputHelpData: CoaReportInputHelp = new CoaReportInputHelp();
  selectedValue: any;

  chbIsAllHeaderStatus: any;
  IsHeaderDisabled: any;

  chbIsAllMainHeaderStatus: any;
  IsMainHeaderDisabled: any;

  chbIsAllSubHeaderStatus: any;
  IsSubHeaderDisabled: any;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private coaReportService: CoaReportService,
    private aService: ReportCommonService
  ) {
    //this.reportModel.ReportName = 'ChartOfAccount';
    this.reportModel.ReportName = 'cculbrptGLChartOfAccountReport';
  }

  ngOnInit(): void {
    this.initializeForm();
    this.spinner.show();
    this.coaReportService
      .getInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        this.spinner.hide();
      });
  }

  private initializeForm() {
    this.chbIsAllHeaderStatus = true;
    this.IsHeaderDisabled = true;
    this.chbIsAllMainHeaderStatus = true;
    this.IsMainHeaderDisabled = true;
    this.chbIsAllSubHeaderStatus = true;
    this.IsSubHeaderDisabled = true;

    this.coaReportForm = new FormGroup({
      IsAllHeader: new FormControl('true'),
      IsAllMainHeader: new FormControl('true'),
      IsAllSubHeader: new FormControl('true'),
      HeadId: new FormControl('0'),
      MainHeadId: new FormControl('0'),
      SubHeadId: new FormControl('0'),
      BankAccountType: new FormControl('0'),
      rbLanguage: new FormControl('0'),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // events
  checkIsAllHeaderValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllHeaderStatus = true;

      this.IsHeaderDisabled = true;
      this.coaReportForm.controls['HeadId'].setValue('0');
    } else {
      this.chbIsAllHeaderStatus = false;
      this.coaReportForm.get('HeadId').enable();
    }
  }

  checkIsAllMainHeaderValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllMainHeaderStatus = true;

      this.IsMainHeaderDisabled = true;
      this.coaReportForm.controls['MainHeadId'].setValue('0');
    } else {
      this.chbIsAllMainHeaderStatus = false;
      this.coaReportForm.get('MainHeadId').enable();
    }
  }

  checkIsAllSubHeaderValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllSubHeaderStatus = true;

      this.IsSubHeaderDisabled = true;
      this.coaReportForm.controls['SubHeadId'].setValue('0');
    } else {
      this.chbIsAllSubHeaderStatus = false;
      this.coaReportForm.get('SubHeadId').enable();
    }
  }

  private setParameter(): void {
    var fValue = this.coaReportForm.value;
    this.reportModel.Values = [];

    if (fValue.rbLanguage == '0') {
      this.reportModel.ReportName = 'cculbrptGLChartOfAccountReport';
    } else {
      this.reportModel.ReportName = 'rptGLChartOfAccountReportB';
    }

    this.reportModel.Values.push(new ReportKeyValue('Head', fValue.HeadId));
    this.reportModel.Values.push(
      new ReportKeyValue('MainHead', fValue.MainHeadId)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('SubHead', fValue.SubHeadId)
    );

    // start head description
    if (this.chbIsAllHeaderStatus) {
      this.reportModel.Values.push(new ReportKeyValue('HeadDesc', ' [ All ] '));
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue(
          'HeadDesc',
          this.getSelectedItemText(fValue.HeadId, this.inputHelpData.HeadList)
        )
      );
    }

    // start mainhead description
    if (this.chbIsAllMainHeaderStatus) {
      this.reportModel.Values.push(
        new ReportKeyValue('MainHeadDesc', ' [ All ] ')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue(
          'MainHeadDesc',
          this.getSelectedItemText(
            fValue.MainHeadId,
            this.inputHelpData.MainHeadList
          )
        )
      );
    }

    // start subhead description
    if (this.chbIsAllSubHeaderStatus) {
      this.reportModel.Values.push(
        new ReportKeyValue('SubHeadDesc', ' [ All ] ')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue(
          'SubHeadDesc',
          this.getSelectedItemText(
            fValue.SubHeadId,
            this.inputHelpData.SubHeadList
          )
        )
      );
    }

    if (this.selectedValue == '10106000') {
      this.reportModel.Values.push(
        new ReportKeyValue('BankAccountType', fValue.BankAccountType)
      );
    } else {
      this.reportModel.Values.push(new ReportKeyValue('BankAccountType', '0'));
    }
  }

  public getSelectedItemText(value: any, collection: IdDescription[]): string {
    let selected = collection.find((x) => x.Id == value);
    return selected.Description;
  }

  public getReportToken = (type: any) => {
    this.setParameter();
    this.spinner.show();
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
  };

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

  onChangeSubHead(event: any) {
    let sHeadID = this.coaReportForm.controls['SubHeadId'].value;
    console.log(sHeadID);
    if (sHeadID) {
      this.selectedValue = sHeadID;
    }
  }
}
