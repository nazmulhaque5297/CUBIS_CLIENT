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
import { GMemNoReportService } from 'src/app/services/gmemno-report.service';
import { MemberDetailsCode } from 'src/app/interfaces/loan-info-report';
import { MemberNumberGenerateReportInputHelp } from 'src/app/Models/generate-new-memberno-report.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-generate-new-member-number-list',
  templateUrl: './generate-new-member-number-list.component.html',
  styleUrls: ['./generate-new-member-number-list.component.css'],
})
export class GenerateNewMemberNumberListComponent implements OnInit, OnDestroy {
  module: string = '1';
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  MemberNumberGenerateReportForm: FormGroup;
  public inputHelpData: MemberNumberGenerateReportInputHelp = new MemberNumberGenerateReportInputHelp();
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  public MemberDetailsList: MemberDetailsCode = new MemberDetailsCode();
  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private gMemNoReportService: GMemNoReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService
  ) {
    //this.reportModel.ReportName = 'MemberNumberGenerateReport';
    this.reportModel.ReportName = 'rptCsGenerateMemNumberReport';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.spinner.show();
    this.gMemNoReportService
      .getInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        console.log(this.inputHelpData);
        this.spinner.hide();
      });
  }

  private initializeForm() {
    this.MemberNumberGenerateReportForm = new FormGroup({
      MemberType: new FormControl('0'),
      Code: new FormControl(''),
      MemberNoFrom: new FormControl(''),
      MemberNoTo: new FormControl(''),
      IsOnlyNewMember: new FormControl(false),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // enter key events
  onEnterMemberTypeHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`MemberNoFrom`).focus();
  }
  onEnterMemberNoFromHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`MemberNoTo`).focus();
  }

  private setParameter(): void {
    var fValue = this.MemberNumberGenerateReportForm.value;
    this.reportModel.Values = [];
    this.reportModel.Values.push(
      new ReportKeyValue('MemberType', fValue.MemberType)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('MemberNoFrom', fValue.MemberNoFrom)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('MemberNoTo', fValue.MemberNoTo)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('IsOnlyNewMember', fValue.IsOnlyNewMember ? '0' : '1')
    );
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

  onChangeMemberType(event: any) {
    let MemberTypeId = this.MemberNumberGenerateReportForm.controls[
      'MemberType'
    ].value;
    console.log(MemberTypeId);
    if (MemberTypeId) {
      this.MemberNumberGenerateReportForm.patchValue({
        Code: MemberTypeId,
      });
    }
    document.getElementById(`MemberNoFrom`).focus();
  }
}
