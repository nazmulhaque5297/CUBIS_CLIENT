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
import { LoanReceivedReportService } from 'src/app/services/loanreceived-report.service';
import { LoanReceivedReportInputHelp } from 'src/app/Models/loanreceived-report.model';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { IdDescription } from 'src/app/interfaces/id-description';
import { GLBudgetReportService } from 'src/app/services/gl-budget-report.service';
import { GLBudgetReportPageLoadModel } from '../../../models/gl-budget-report.model';
import { IdentityCardReportService } from 'src/app/services/identity-card-report.service';

@Component({
  selector: 'app-identity-card-list',
  templateUrl: './identity-card-list.component.html',
  styleUrls: ['./identity-card-list.component.css'],
})
export class IdentityCardListComponent implements OnInit {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  GetInputHelpData: GLBudgetReportPageLoadModel = new GLBudgetReportPageLoadModel();

  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;

  IdentityCardReportForm: FormGroup;
  InputRowOne: boolean = false;
  InputRowTwo: boolean = false;
  FromToMember: boolean = false;
  MemberNumber: any;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    public identityCardReportService: IdentityCardReportService
  ) {
    this.reportModel.ReportName = 'rptCSIdentityCardLists';
    this.reportModel.Values = [];
  }

  // ngOnDestroy(): void {
  //   throw new Error('Method not implemented.');
  // }

  ngOnInit(): void {
    this.initializeForm();
  }
  private initializeForm() {
    this.IdentityCardReportForm = new FormGroup({
      MonthControl: new FormControl('0'),
      YearControl: new FormControl(''),
      rbReportName: new FormControl('1'),
      QrCode1: new FormControl(''),
      QrCode2: new FormControl(''),
      QrCode3: new FormControl(''),
      QrCode4: new FormControl(''),
      QrCode5: new FormControl(''),
      QrCode6: new FormControl(''),
      QrCode7: new FormControl(''),
      QrCode8: new FormControl(''),
      fromMemberNo: new FormControl(''),
      toMemberNo: new FormControl(''),
    });
    this.getInputHelpData();
  }

  public getInputHelpData() {}

  memberNoCheck(e: any, cv: any) {
    console.log('Event Value:', e.target.value);
    console.log('form Value:', cv);
    let memNo = e.target.value;
    let Value = cv;

    this.identityCardReportService
      .GetMemberData(memNo)
      .pipe(first())
      .subscribe((data: any) => {
        console.log('YesOrNo------', data.MemberNo);
        if (data.MemberNo == 0) {
          alert('Member is not available!!!');
          if (Value == 1) {
            this.IdentityCardReportForm.controls['QrCode1'].setValue('');
          } else if (Value == 2) {
            this.IdentityCardReportForm.controls['QrCode2'].setValue('');
          } else if (Value == 3) {
            this.IdentityCardReportForm.controls['QrCode3'].setValue('');
          } else if (Value == 4) {
            this.IdentityCardReportForm.controls['QrCode4'].setValue('');
          } else if (Value == 5) {
            this.IdentityCardReportForm.controls['QrCode5'].setValue('');
          } else if (Value == 6) {
            this.IdentityCardReportForm.controls['QrCode6'].setValue('');
          } else if (Value == 7) {
            this.IdentityCardReportForm.controls['QrCode7'].setValue('');
          } else if (Value == 8) {
            this.IdentityCardReportForm.controls['QrCode8'].setValue('');
          }

          return;
        }
      });
  }

  AllMemberRb() {
    this.FromToMember = false;
    this.InputRowOne = false;
    this.InputRowTwo = false;
  }

  public SelectMemberMethod() {
    this.InputRowOne = true;
    this.InputRowTwo = true;
    this.FromToMember = false;
  }

  public rangeMethod() {
    this.FromToMember = true;
    this.InputRowOne = false;
    this.InputRowTwo = false;
  }

  public getReportToken = (type: any) => {
    this.spinner.show();
    this.setParameter();
    this.displayIFrame = true;
    console.log(this.reportModel);
    this.aService
      .getReportToken(this.reportModel)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        async (x) => {
          if (type === 'CRV') {
            await this.setIframeCRV(x);
          } else {
            await this.setIframe(x);
          }
          this.spinner.hide();
          setTimeout(() => {
            location.reload();
          }, 1000);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  private setParameter(): void {
    var fValue = this.IdentityCardReportForm.value;
    this.reportModel.Values = [];

    this.reportModel.ReportName = 'rptCSIdentityCardList';

    if (fValue.rbReportName == '1') {
      this.reportModel.Values.push(new ReportKeyValue('FromMember', '0'));
      this.reportModel.Values.push(new ReportKeyValue('ToMember', '0'));
      this.reportModel.Values.push(new ReportKeyValue('QRCode1', '0'));
      this.reportModel.Values.push(new ReportKeyValue('QRCode2', '0'));
      this.reportModel.Values.push(new ReportKeyValue('QRCode3', '0'));
      this.reportModel.Values.push(new ReportKeyValue('QRCode4', '0'));
      this.reportModel.Values.push(new ReportKeyValue('QRCode5', '0'));
      this.reportModel.Values.push(new ReportKeyValue('QRCode6', '0'));
      this.reportModel.Values.push(new ReportKeyValue('QRCode7', '0'));
      this.reportModel.Values.push(new ReportKeyValue('QRCode8', '0'));
    } else if (fValue.rbReportName == '2') {
      this.reportModel.Values.push(new ReportKeyValue('FromMember', '0'));
      this.reportModel.Values.push(new ReportKeyValue('ToMember', '0'));
      this.reportModel.Values.push(
        new ReportKeyValue(
          'QRCode1',
          this.IdentityCardReportForm.controls['QrCode1'].value == ''
            ? '0'
            : fValue.QrCode1
        )
      );
      this.reportModel.Values.push(
        new ReportKeyValue(
          'QRCode2',
          this.IdentityCardReportForm.controls['QrCode2'].value == ''
            ? '0'
            : fValue.QrCode2
        )
      );
      this.reportModel.Values.push(
        new ReportKeyValue(
          'QRCode3',
          this.IdentityCardReportForm.controls['QrCode3'].value == ''
            ? '0'
            : fValue.QrCode3
        )
      );
      this.reportModel.Values.push(
        new ReportKeyValue(
          'QRCode4',
          this.IdentityCardReportForm.controls['QrCode4'].value == ''
            ? '0'
            : fValue.QrCode4
        )
      );
      this.reportModel.Values.push(
        new ReportKeyValue(
          'QRCode5',
          this.IdentityCardReportForm.controls['QrCode5'].value == ''
            ? '0'
            : fValue.QrCode5
        )
      );
      this.reportModel.Values.push(
        new ReportKeyValue(
          'QRCode6',
          this.IdentityCardReportForm.controls['QrCode6'].value == ''
            ? '0'
            : fValue.QrCode6
        )
      );
      this.reportModel.Values.push(
        new ReportKeyValue(
          'QRCode7',
          this.IdentityCardReportForm.controls['QrCode7'].value == ''
            ? '0'
            : fValue.QrCode7
        )
      );
      this.reportModel.Values.push(
        new ReportKeyValue(
          'QRCode8',
          this.IdentityCardReportForm.controls['QrCode8'].value == ''
            ? '0'
            : fValue.QrCode8
        )
      );
    } else if (fValue.rbReportName == '3') {
      this.reportModel.Values.push(
        new ReportKeyValue(
          'FromMember',
          this.IdentityCardReportForm.controls['fromMemberNo'].value
        )
      );
      this.reportModel.Values.push(
        new ReportKeyValue(
          'ToMember',
          this.IdentityCardReportForm.controls['toMemberNo'].value
        )
      );
      this.reportModel.Values.push(new ReportKeyValue('QRCode1', '0'));
      this.reportModel.Values.push(new ReportKeyValue('QRCode2', '0'));
      this.reportModel.Values.push(new ReportKeyValue('QRCode3', '0'));
      this.reportModel.Values.push(new ReportKeyValue('QRCode4', '0'));
      this.reportModel.Values.push(new ReportKeyValue('QRCode5', '0'));
      this.reportModel.Values.push(new ReportKeyValue('QRCode6', '0'));
      this.reportModel.Values.push(new ReportKeyValue('QRCode7', '0'));
      this.reportModel.Values.push(new ReportKeyValue('QRCode8', '0'));
    }

    this.reportModel.Values.push(
      new ReportKeyValue('rbtValue', fValue.rbReportName)
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
}
