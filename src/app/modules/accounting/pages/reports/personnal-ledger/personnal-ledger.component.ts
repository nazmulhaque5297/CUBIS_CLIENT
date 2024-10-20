import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { UserInfo } from 'src/app/Models/Common.model';
import {
  AccClassDetails,
  LoanReceivedReportInputHelp,
} from 'src/app/Models/loanreceived-report.model';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { GeneralLedgerReportService } from 'src/app/services/general-ledger-report.service';
import { LoanReceivedReportService } from 'src/app/services/loanreceived-report.service';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { environment } from 'src/environments/environment';
import { GeneralLedgerReportPageLoadModel } from '../../../models/general-ledger-report.model';

@Component({
  selector: 'app-personnal-ledger',
  templateUrl: './personnal-ledger.component.html',
  styleUrls: ['./personnal-ledger.component.css'],
})
export class PersonnalLedgerComponent implements OnInit {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  public pageLoadModel: GeneralLedgerReportPageLoadModel = new GeneralLedgerReportPageLoadModel();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  chbForCollectorDisable: boolean = true;
  chbForGroupDisable: boolean = true;
  chbForGenderDisable: boolean = true;
  PersonalLedgerForm: FormGroup;
  checkDataList: any[] = [];
  notCheckDataList: any[] = [];
  MemName: any;
  storefDate: any;
  storetDate: any;
  CheckedOrNot: boolean = false;
  Unselect: boolean = false;
  Deselect: boolean = false;
  MyCheckBox: boolean = false;

  checkedFilterArray: any[] = [];
  notCheckedFilterArray: any[] = [];
  filteredIndex: any[] = [];
  checked: boolean = false;
  AccNoA: any;
  AccDescA: any;
  AccNoB: any;
  AccDescB: any;
  AccNoC: any;
  AccDescC: any;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private router: Router,
    // private loanInfoReportService: LoanInfoReportService,
    private generalLedgerReportService: GeneralLedgerReportService
  ) {
    this.reportModel.ReportName = 'rptCSMemPersonnalLedger';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.checked = false;
  }
  private initializeForm() {
    this.PersonalLedgerForm = new FormGroup({
      IssueFromDate: new FormControl(''),
      IssueToDate: new FormControl(''),
      MemberNoInput: new FormControl(''),
      AccChb: new FormControl(false),
      checkBoxCntrl: new FormControl(false),
      checkBoxCntrl2: new FormControl(false),
    });

    this.getInputHelpData();
  }
  public getInputHelpData() {
    this.generalLedgerReportService
      .GetInputHelpData()
      .pipe(first())
      .subscribe((data: any) => {
        this.pageLoadModel = data;
        console.log('AllData:', this.pageLoadModel);
        this.PersonalLedgerForm.controls['IssueFromDate'].setValue(
          this.pageLoadModel.FDateMemStatReport
        );
        this.PersonalLedgerForm.controls['IssueToDate'].setValue(
          this.pageLoadModel.ToDate
        );

        console.log(
          'this is start dtae',
          this.pageLoadModel.FDateMemStatReport
        );
        this.storefDate = this.pageLoadModel.FDateMemStatReport;
        this.storetDate = this.pageLoadModel.ToDate;
      });
  }

  // enter key events
  onEnterMemberNoInputHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`IssueFromDate`).focus();
  }

  public MemberNoChange() {
    let memNum = this.PersonalLedgerForm.value.MemberNoInput;
    console.log('MemberNo:', memNum);
    this.generalLedgerReportService
      .MemberNumber(memNum)
      .pipe(first())
      .subscribe((data: any) => {
        console.log('All Data:', data);

        this.checkDataList = data.CheckBoxSelectTable;
        this.notCheckDataList = data.CheckBoxNotSelectTable;
        this.MemName = data.MemberName;
        console.log('MemName:', this.notCheckDataList);
      });
  }

  checkBoxUpdate() {
    if (this.checked) {
      this.checked = false;
      this.notCheckedFilterArray = [];
    } else {
      this.checked = true;
      this.checkedFilterArray = [];
    }
  }

  public unCheckMethod(index: any, data: any) {
    if (this.notCheckedFilterArray.find((x) => x.index == index)) {
      this.notCheckedFilterArray = this.notCheckedFilterArray.filter(
        (x) => x.index != index
      );
    } else {
      data.index = index;
      this.notCheckedFilterArray.push(data);
    }

    console.log('ArrayOutSide:----->', this.notCheckedFilterArray);
    console.log('OutSide Array Length::', this.notCheckedFilterArray.length);
  }

  public checkMethod(index: any, data: any) {
    console.log('Array Length:----->', this.checkedFilterArray);

    if (this.checkedFilterArray.find((x) => x.index == index)) {
      this.checkedFilterArray = this.checkedFilterArray.filter(
        (x) => x.index != index
      );
    } else {
      data.index = index;
      this.checkedFilterArray.push(data);
    }

    console.log('ArrayOutSide:----->', this.checkedFilterArray);
    console.log('OutSide Array Length::', this.checkedFilterArray.length);
  }

  checkItem(item: any) {
    if (this.notCheckedFilterArray?.find((x) => x.AccNo === item.AccNo)) {
      console.log('Item---', item);
      return 1;
    }
    return 0;
  }

  // Date change event
  applicationDateChange() {
    var fv = this.PersonalLedgerForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.PersonalLedgerForm.value.IssueFromDate = formatedValue;
    this.storefDate = formatedValue;
    console.log(this.PersonalLedgerForm.value);
    console.log(this.storefDate);
  }
  applicationDateChange2() {
    var fv = this.PersonalLedgerForm.value;
    var value = this.datepipe.transform(fv.IssueToDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.PersonalLedgerForm.value.IssueToDate = formatedValue;
    this.storetDate = formatedValue;
    console.log(this.PersonalLedgerForm.value);
    console.log(this.storetDate);
  }

  public getReportToken(type: any) {
    this.spinner.show();
    if (
      this.notCheckedFilterArray.length == 0 &&
      this.checkedFilterArray.length == 0
    ) {
      alert('There is no Data in the Array!!!');
      this.spinner.hide();
      return;
    }
    if (
      this.notCheckedFilterArray.length > 3 ||
      this.checkedFilterArray.length > 3
    ) {
      alert('You Cannot Select More Than Three!!!');
      this.spinner.hide();
      return;
    }
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
  }
  private setParameter(): void {
    var fValue = this.PersonalLedgerForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue('fDate', this.storefDate),
      new ReportKeyValue('tDate', this.storetDate),
      new ReportKeyValue('MemNo', fValue.MemberNoInput)
    );

    console.log('CheckBoxFinding---', this.CheckedOrNot);

    if (!this.CheckedOrNot) {
      console.log('Array Iteration:', this.notCheckedFilterArray[0].AccNo);
      if (this.notCheckedFilterArray.length == 3) {
        var AccNo1 = this.notCheckedFilterArray[0].AccNo;
        var AccDesc1 = this.notCheckedFilterArray[0].AccTitle;
        console.log('AccDesc1', AccDesc1);
        var Acc1Last3digit = AccNo1.toString().slice(-3);
        console.log(Acc1Last3digit);
        var concat1 = AccDesc1.concat(Acc1Last3digit);

        var AccNo2 = this.notCheckedFilterArray[1].AccNo;
        var AccDesc2 = this.notCheckedFilterArray[1].AccTitle;
        console.log('AccDesc1', AccDesc1);
        var Acc2Last3digit = AccNo2.toString().slice(-3);
        console.log(Acc2Last3digit);
        var concat2 = AccDesc2.concat(Acc2Last3digit);

        var AccNo3 = this.notCheckedFilterArray[2].AccNo;
        var AccDesc3 = this.notCheckedFilterArray[2].AccTitle;
        console.log('AccDesc3', AccDesc3);
        var Acc3Last3digit = AccNo3.toString().slice(-3);
        console.log(Acc3Last3digit);
        var concat3 = AccDesc3.concat(Acc3Last3digit);

        this.reportModel.Values.push(
          new ReportKeyValue('Acc1', AccNo1.toString())
        );

        this.reportModel.Values.push(
          new ReportKeyValue('Acc2', AccNo2.toString())
        );

        this.reportModel.Values.push(
          new ReportKeyValue('Acc3', AccNo3.toString())
        );

        if (AccNo1 != 0) {
          this.reportModel.Values.push(
            new ReportKeyValue('Acc1WithDesc', concat1)
          );
        } else {
          this.reportModel.Values.push(new ReportKeyValue('Acc1WithDesc', ' '));
        }

        if (AccNo2 != 0) {
          this.reportModel.Values.push(
            new ReportKeyValue('Acc2WithDesc', concat2)
          );
        } else {
          this.reportModel.Values.push(new ReportKeyValue('Acc2WithDesc', ' '));
        }

        if (AccNo3 != 0) {
          this.reportModel.Values.push(
            new ReportKeyValue('Acc3WithDesc', concat3)
          );
        } else {
          this.reportModel.Values.push(new ReportKeyValue('Acc3WithDesc', ' '));
        }
      } else if (this.notCheckedFilterArray.length == 2) {
        var AccNo1 = this.notCheckedFilterArray[0].AccNo;
        var AccDesc1 = this.notCheckedFilterArray[0].AccTitle;
        console.log('AccDesc1', AccDesc1);
        var Acc1Last3digit = AccNo1.toString().slice(-3);
        console.log(Acc1Last3digit);
        var concat1 = AccDesc1.concat(Acc1Last3digit);

        var AccNo2 = this.notCheckedFilterArray[1].AccNo;
        var AccDesc2 = this.notCheckedFilterArray[1].AccTitle;
        console.log('AccDesc1', AccDesc1);
        var Acc2Last3digit = AccNo2.toString().slice(-3);
        console.log(Acc2Last3digit);
        var concat2 = AccDesc2.concat(Acc2Last3digit);

        // var AccNo3 = this.notCheckedFilterArray[2].AccNo;
        // var AccDesc3 = this.notCheckedFilterArray[2].AccTitle;
        // console.log('AccDesc3', AccDesc3);
        // var Acc3Last3digit = AccNo3.toString().slice(-3);
        // console.log(Acc3Last3digit);
        // var concat3 = AccDesc3.concat(Acc3Last3digit);

        this.reportModel.Values.push(
          new ReportKeyValue('Acc1', AccNo1.toString())
        );

        this.reportModel.Values.push(
          new ReportKeyValue('Acc2', AccNo2.toString())
        );

        this.reportModel.Values.push(new ReportKeyValue('Acc3', '0'));

        if (AccNo1 != 0) {
          this.reportModel.Values.push(
            new ReportKeyValue('Acc1WithDesc', concat1)
          );
        } else {
          this.reportModel.Values.push(new ReportKeyValue('Acc1WithDesc', ' '));
        }

        if (AccNo2 != 0) {
          this.reportModel.Values.push(
            new ReportKeyValue('Acc2WithDesc', concat2)
          );
        } else {
          this.reportModel.Values.push(new ReportKeyValue('Acc2WithDesc', ' '));
        }

        this.reportModel.Values.push(new ReportKeyValue('Acc3WithDesc', ' '));
      } else if (this.notCheckedFilterArray.length == 1) {
        var AccNo1 = this.notCheckedFilterArray[0].AccNo;
        var AccDesc1 = this.notCheckedFilterArray[0].AccTitle;
        console.log('AccDesc1', AccDesc1);
        var Acc1Last3digit = AccNo1.toString().slice(-3);
        console.log(Acc1Last3digit);
        var concat1 = AccDesc1.concat(Acc1Last3digit);

        // var AccNo2 = this.notCheckedFilterArray[1].AccNo;
        // var AccDesc2 = this.notCheckedFilterArray[1].AccTitle;
        // console.log('AccDesc1', AccDesc1);
        // var Acc2Last3digit = AccNo2.toString().slice(-3);
        // console.log(Acc2Last3digit);
        // var concat2 = AccDesc2.concat(Acc2Last3digit);

        // var AccNo3 = this.notCheckedFilterArray[2].AccNo;
        // var AccDesc3 = this.notCheckedFilterArray[2].AccTitle;
        // console.log('AccDesc3', AccDesc3);
        // var Acc3Last3digit = AccNo3.toString().slice(-3);
        // console.log(Acc3Last3digit);
        // var concat3 = AccDesc3.concat(Acc3Last3digit);

        this.reportModel.Values.push(
          new ReportKeyValue('Acc1', AccNo1.toString())
        );

        this.reportModel.Values.push(new ReportKeyValue('Acc2', '0'));

        this.reportModel.Values.push(new ReportKeyValue('Acc3', '0'));

        if (AccNo1 != 0) {
          this.reportModel.Values.push(
            new ReportKeyValue('Acc1WithDesc', concat1)
          );
        } else {
          this.reportModel.Values.push(new ReportKeyValue('Acc1WithDesc', ' '));
        }

        this.reportModel.Values.push(new ReportKeyValue('Acc2WithDesc', ' '));

        this.reportModel.Values.push(new ReportKeyValue('Acc3WithDesc', ' '));
      }
    } else {
      console.log('Array Iteration:', this.checkedFilterArray[0].AccNo);
      if (this.checkedFilterArray.length == 3) {
        var AccNo1 = this.checkedFilterArray[0].AccNo;
        var AccDesc1 = this.checkedFilterArray[0].AccTitle;
        console.log('AccDesc1', AccDesc1);
        var Acc1Last3digit = AccNo1.toString().slice(-3);
        console.log(Acc1Last3digit);
        var concat1 = AccDesc1.concat(Acc1Last3digit);

        var AccNo2 = this.checkedFilterArray[1].AccNo;
        var AccDesc2 = this.checkedFilterArray[1].AccTitle;
        console.log('AccDesc1', AccDesc1);
        var Acc2Last3digit = AccNo2.toString().slice(-3);
        console.log(Acc2Last3digit);
        var concat2 = AccDesc2.concat(Acc2Last3digit);

        var AccNo3 = this.checkedFilterArray[2].AccNo;
        var AccDesc3 = this.checkedFilterArray[2].AccTitle;
        console.log('AccDesc3', AccDesc3);
        var Acc3Last3digit = AccNo3.toString().slice(-3);
        console.log(Acc3Last3digit);
        var concat3 = AccDesc3.concat(Acc3Last3digit);

        this.reportModel.Values.push(
          new ReportKeyValue('Acc1', AccNo1.toString())
        );

        this.reportModel.Values.push(
          new ReportKeyValue('Acc2', AccNo2.toString())
        );

        this.reportModel.Values.push(
          new ReportKeyValue('Acc3', AccNo3.toString())
        );

        if (AccNo1 != 0) {
          this.reportModel.Values.push(
            new ReportKeyValue('Acc1WithDesc', concat1)
          );
        } else {
          this.reportModel.Values.push(new ReportKeyValue('Acc1WithDesc', ' '));
        }

        if (AccNo2 != 0) {
          this.reportModel.Values.push(
            new ReportKeyValue('Acc2WithDesc', concat2)
          );
        } else {
          this.reportModel.Values.push(new ReportKeyValue('Acc2WithDesc', ' '));
        }

        if (AccNo3 != 0) {
          this.reportModel.Values.push(
            new ReportKeyValue('Acc3WithDesc', concat3)
          );
        } else {
          this.reportModel.Values.push(new ReportKeyValue('Acc3WithDesc', ' '));
        }

        console.log(this.reportModel.Values);
      } else if (this.checkedFilterArray.length == 2) {
        var AccNo1 = this.checkedFilterArray[0].AccNo;
        var AccDesc1 = this.checkedFilterArray[0].AccTitle;
        console.log('AccDesc1', AccDesc1);
        var Acc1Last3digit = AccNo1.toString().slice(-3);
        console.log(Acc1Last3digit);
        var concat1 = AccDesc1.concat(Acc1Last3digit);

        var AccNo2 = this.checkedFilterArray[1].AccNo;
        var AccDesc2 = this.checkedFilterArray[1].AccTitle;
        console.log('AccDesc1', AccDesc1);
        var Acc2Last3digit = AccNo2.toString().slice(-3);
        console.log(Acc2Last3digit);
        var concat2 = AccDesc2.concat(Acc2Last3digit);

        // var AccNo3 = this.notCheckedFilterArray[2].AccNo;
        // var AccDesc3 = this.notCheckedFilterArray[2].AccTitle;
        // console.log('AccDesc3', AccDesc3);
        // var Acc3Last3digit = AccNo3.toString().slice(-3);
        // console.log(Acc3Last3digit);
        // var concat3 = AccDesc3.concat(Acc3Last3digit);

        this.reportModel.Values.push(
          new ReportKeyValue('Acc1', AccNo1.toString())
        );

        this.reportModel.Values.push(
          new ReportKeyValue('Acc2', AccNo2.toString())
        );

        this.reportModel.Values.push(new ReportKeyValue('Acc3', '0'));

        if (AccNo1 != 0) {
          this.reportModel.Values.push(
            new ReportKeyValue('Acc1WithDesc', concat1)
          );
        } else {
          this.reportModel.Values.push(new ReportKeyValue('Acc1WithDesc', ' '));
        }

        if (AccNo2 != 0) {
          this.reportModel.Values.push(
            new ReportKeyValue('Acc2WithDesc', concat2)
          );
        } else {
          this.reportModel.Values.push(new ReportKeyValue('Acc2WithDesc', ' '));
        }

        this.reportModel.Values.push(new ReportKeyValue('Acc3WithDesc', ' '));
      } else if (this.checkedFilterArray.length == 1) {
        var AccNo1 = this.checkedFilterArray[0].AccNo;
        var AccDesc1 = this.checkedFilterArray[0].AccTitle;
        console.log('AccDesc1', AccDesc1);
        var Acc1Last3digit = AccNo1.toString().slice(-3);
        console.log(Acc1Last3digit);
        var concat1 = AccDesc1.concat(Acc1Last3digit);

        // var AccNo2 = this.notCheckedFilterArray[1].AccNo;
        // var AccDesc2 = this.notCheckedFilterArray[1].AccTitle;
        // console.log('AccDesc1', AccDesc1);
        // var Acc2Last3digit = AccNo2.toString().slice(-3);
        // console.log(Acc2Last3digit);
        // var concat2 = AccDesc2.concat(Acc2Last3digit);

        // var AccNo3 = this.notCheckedFilterArray[2].AccNo;
        // var AccDesc3 = this.notCheckedFilterArray[2].AccTitle;
        // console.log('AccDesc3', AccDesc3);
        // var Acc3Last3digit = AccNo3.toString().slice(-3);
        // console.log(Acc3Last3digit);
        // var concat3 = AccDesc3.concat(Acc3Last3digit);

        this.reportModel.Values.push(
          new ReportKeyValue('Acc1', AccNo1.toString())
        );

        this.reportModel.Values.push(new ReportKeyValue('Acc2', '0'));

        this.reportModel.Values.push(new ReportKeyValue('Acc3', '0'));

        if (AccNo1 != 0) {
          this.reportModel.Values.push(
            new ReportKeyValue('Acc1WithDesc', concat1)
          );
        } else {
          this.reportModel.Values.push(new ReportKeyValue('Acc1WithDesc', ' '));
        }

        this.reportModel.Values.push(new ReportKeyValue('Acc2WithDesc', ' '));

        this.reportModel.Values.push(new ReportKeyValue('Acc3WithDesc', ' '));
      }
    }
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
