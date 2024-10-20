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
import {
  LoanReceivedReportInputHelp,
  AccClassDetails,
} from 'src/app/Models/loanreceived-report.model';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { IdDescription } from 'src/app/interfaces/id-description';
import { LoanInfoReportService } from 'src/app/services/loan-info-report.service';
import { MemberDetailsCode } from 'src/app/interfaces/loan-info-report';
import { UserModule, UserInfo } from 'src/app/Models/Common.model';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';

@Component({
  selector: 'app-booth-cs-voucher-wise-transaction-report',
  templateUrl: './booth-cs-voucher-wise-transaction-report.component.html',
  styleUrls: ['./booth-cs-voucher-wise-transaction-report.component.css'],
})
export class BoothCsVoucherWiseTransactionReportComponent
  implements OnInit, OnDestroy {
  module: string = '3';
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  public MemberDetailsList: MemberDetailsCode = new MemberDetailsCode();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;

  CsVchWiseTransactionReportForm: FormGroup;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private loanInfoReportService: LoanInfoReportService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.reportModel.ReportName = 'CsGenerateVchWiseTransaction01';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm() {
    this.CsVchWiseTransactionReportForm = new FormGroup({
      rbTrnMode: new FormControl('0'),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setParameter(): void {
    var fValue = this.CsVchWiseTransactionReportForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue('rbTrnMode', fValue.rbTrnMode)
    );

    // report name start
    if (fValue.rbTrnMode === '2') {
      //this.reportModel.ReportName = 'CsGenerateVchWiseTransaction01';
      this.reportModel.ReportName =
        'CCULB_BoothrptMCsGenerateVchWiseTransaction01';

      this.reportModel.Values.push(new ReportKeyValue('nFlag', '0'));
    } else {
      //this.reportModel.ReportName = 'CsGenerateVchWiseTransaction';
      this.reportModel.ReportName =
        'CCULB_BoothrptMCsGenerateVchWiseTransaction';

      this.reportModel.Values.push(new ReportKeyValue('nFlag', '1'));
    }
    // report name end
  }

  public getReportToken = () => {
    this.spinner.show();
    this.setParameter();
    //this.spinner.show();
    this.displayIFrame = true;
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
    // }
  };

  private setIframe = (x: any) => {
    var iFramePath = environment.reportUrl + 'id=' + x.id + '&token=' + x.token;

    window.open(iFramePath, '_blank');
  };
}
