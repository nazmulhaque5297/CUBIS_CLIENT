import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
import { FormGroup, FormControl } from '@angular/forms';
import { LoanReceivedReportService } from 'src/app/services/loanreceived-report.service';
import {
  LoanReceivedReportInputHelp,
  AccClassDetails,
} from 'src/app/Models/loanreceived-report.model';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { UserModule, UserInfo } from 'src/app/Models/Common.model';
import {
  CashCollectionAccPageLoadModel,
  CashCollectionMemberNoChngModel,
} from '../../../models/cash-collection-report-by-acc.model';
import { Router } from '@angular/router';
import { MemberAdmissionInfoReportService } from 'src/app/services/member-admission-form.service';
import { MemberAdmissionFormReportPageLoadModel } from '../../../models/member-admission-info-report.model';

@Component({
  selector: 'app-member-admission-form',
  templateUrl: './member-admission-form.component.html',
  styleUrls: ['./member-admission-form.component.css'],
})
export class MemberAdmissionFormComponent implements OnInit {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  public pageLoadModel: MemberAdmissionFormReportPageLoadModel = new MemberAdmissionFormReportPageLoadModel();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  MemberAdmissionForm: FormGroup;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private router: Router,
    // private loanInfoReportService: LoanInfoReportService,
    private memberAdmissionInfoReportService: MemberAdmissionInfoReportService
  ) {
    this.reportModel.ReportName = 'rptCsMemberRegister';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
  }
  private initializeForm() {
    this.MemberAdmissionForm = new FormGroup({
      AllMemberFrom: new FormControl('0'),
      AllMemberTo: new FormControl('0'),
      MemberFrom: new FormControl(''),
      MemberTo: new FormControl(''),
    });
    this.getInputHelpData();
  }
  public getInputHelpData() {
    this.spinner.show();
    this.memberAdmissionInfoReportService
      .GetInputHelpData()
      .pipe(first())
      .subscribe((data: any) => {
        this.pageLoadModel = data;
        // setTimeout(() => {
        // }, 5000);
        this.spinner.hide();
        console.log('All Data:', this.pageLoadModel);
      });
  }

  public MemberFromChange() {
    console.log(this.MemberAdmissionForm.value.AllMemberFrom);
    this.MemberAdmissionForm.controls['MemberFrom'].setValue(
      this.MemberAdmissionForm.value.AllMemberFrom
    );
  }
  public MemberFromCode() {
    this.MemberAdmissionForm.controls['AllMemberFrom'].setValue(
      this.MemberAdmissionForm.value.MemberFrom
    );
  }

  public MemberToChange() {
    console.log(this.MemberAdmissionForm.value.AllMemberFrom);
    this.MemberAdmissionForm.controls['MemberTo'].setValue(
      this.MemberAdmissionForm.value.AllMemberTo
    );
  }
  public MemberToCode() {
    this.MemberAdmissionForm.controls['AllMemberTo'].setValue(
      this.MemberAdmissionForm.value.MemberTo
    );
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
  private setParameter(): void {
    var fValue = this.MemberAdmissionForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue('fromMemberValue', fValue.MemberFrom),
      new ReportKeyValue('toMemberValue', fValue.MemberTo)
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

  exitPage() {
    this.router.navigate(['accounting/']);
  }
}
