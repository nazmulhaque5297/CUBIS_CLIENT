import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { IdDescription } from 'src/app/interfaces/id-description';
import { UserInfo } from 'src/app/Models/Common.model';
import {
  AccClassDetails,
  LoanReceivedReportInputHelp,
} from 'src/app/Models/loanreceived-report.model';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { LoanReceivedReportService } from 'src/app/services/loanreceived-report.service';
import { MutualAidServiceReportService } from 'src/app/services/mutual-aid-service-report.service';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { environment } from 'src/environments/environment';
import { MutualAidServiceReportPageLoadModel } from '../../../models/mutual-aid-service-report.model';

@Component({
  selector: 'app-detail-list-report',
  templateUrl: './detail-list-report.component.html',
  styleUrls: ['./detail-list-report.component.css'],
})
export class DetailListReportComponent implements OnInit {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  public pageLoadModel: MutualAidServiceReportPageLoadModel = new MutualAidServiceReportPageLoadModel();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  //LoanAccShow: boolean = false;
  //LoanAccShow2: boolean = true;
  chbForCollectorDisable: boolean = true;
  chbForGroupDisable: boolean = true;
  chbForGenderDisable: boolean = true;
  DetailListReportForm: FormGroup;

  chbIsAllCollectorStatus: any;
  chbIsAllGroupStatus: any;
  IsCollectorDisabled: any;
  IsGroupDisabled: any;
  selectedItem: any[] = [];
  count: any;
  storefDate: any;
  storetDate: any;

  selectedAccTypes: string = '';

  chbIsMiscAccStatus: boolean;
  showAccTypeGridInfo: boolean;
  showMiscAccTypeGridInfo: boolean;
  Grid1DataList = [];
  showByOldAC: boolean;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private router: Router,
    private mutualAidServiceReportService: MutualAidServiceReportService
  ) {
    this.reportModel.ReportName = 'CCULB_rptLoanRecoveredByCollectorWise2';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
  }
  private initializeForm() {
    this.chbIsMiscAccStatus = false;
    this.showAccTypeGridInfo = true;
    this.showMiscAccTypeGridInfo = false;

    this.chbIsAllCollectorStatus = true;
    this.IsCollectorDisabled = true;
    this.chbIsAllGroupStatus = true;
    this.IsGroupDisabled = true;
    this.showByOldAC = true;
    this.DetailListReportForm = new FormGroup({
      //IssueFromDate: new FormControl(''),
      IssueFromDate1: new FormControl(''),
      IssueToDate1: new FormControl(''),
      // AccountServiceRb: new FormControl('0'),
      IsAllCollector: new FormControl('true'),
      CollectorCode: new FormControl(''),
      Collector: new FormControl('0'),
      IsAllGroup: new FormControl('true'),
      GroupCode: new FormControl(''),
      Group: new FormControl('0'),
      chbCloseAC: new FormControl(false),
      chbMiscAC: new FormControl(false),
      chbByOldAC: new FormControl(false),
      rbLanguage: new FormControl('0'),
    });

    this.getInputHelpData();
    this.getInputHelpData2();
  }
  public getInputHelpData() {
    this.mutualAidServiceReportService
      .GetInputHelpData()
      .pipe(first())
      .subscribe((data: any) => {
        this.pageLoadModel = data;

        this.DetailListReportForm.controls['IssueFromDate1'].setValue(
          this.pageLoadModel.FromDate
        );
        this.DetailListReportForm.controls['IssueToDate1'].setValue(
          this.pageLoadModel.ProcessDate
        );
        this.storefDate = this.pageLoadModel.FromDate;
        this.storetDate = this.pageLoadModel.ProcessDate;
      });
  }
  private getInputHelpData2(): void {
    this.spinner.show();
    this.loanReceivedReportService
      .getInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        console.log(this.inputHelpData);

        this.spinner.hide();
      });
  }

  public getReportToken = (type: any) => {
    if (this.selectedItem.length < 1) {
      alert('No A/c Type Selected!');
      return;
    } else if (this.selectedItem.length > 4) {
      alert('You Cannot Select More than 4 AccType!!!');
      return;
    }
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
    var fValue = this.DetailListReportForm.value;
    this.reportModel.Values = [];

    // this.reportModel.Values.push(
    //   new ReportKeyValue('rbLoanRecovery', fValue.AccountServiceRb)
    // );

    //start Collector
    this.reportModel.Values.push(
      new ReportKeyValue('Collector', fValue.Collector)
    );
    if (this.chbIsAllCollectorStatus) {
      this.reportModel.Values.push(
        new ReportKeyValue('CollectorDesc', 'All Collector')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue(
          'CollectorDesc',
          this.getSelectedItemText(
            fValue.Collector,
            this.inputHelpData.CollectorList
          )
        )
      );
    }
    //end Collector

    // start Group
    this.reportModel.Values.push(new ReportKeyValue('Group', fValue.Group));
    if (this.chbIsAllGroupStatus) {
      this.reportModel.Values.push(
        new ReportKeyValue('GroupDesc', 'All Group')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue(
          'GroupDesc',
          this.getSelectedItemText(fValue.Group, this.inputHelpData.GroupList)
        )
      );
    }
    // end Group

    // start date push

    this.reportModel.Values.push(new ReportKeyValue('fDate', this.storefDate));
    this.reportModel.Values.push(new ReportKeyValue('tDate', this.storetDate));

    // end date push

    this.reportModel.Values.push(
      new ReportKeyValue(
        'selectedDataCount',
        this.selectedItem.length.toString()
      )
    );

    for (let i = 0; i < this.selectedItem.length; i++) {
      this.reportModel.Values.push(
        new ReportKeyValue(
          'selectedAccType' + i.toString(),
          this.selectedItem[i].Id.toString()
        )
      );
      this.reportModel.Values.push(
        new ReportKeyValue(
          'selectedAccTypeDesc' + i.toString(),
          this.selectedItem[i].Description.toString()
        )
      );
    }
    this.reportModel.Values.push(
      new ReportKeyValue('chbByOldAC', fValue.chbByOldAC)
    );

    this.reportModel.Values.push(
      new ReportKeyValue('chbCloseAC', fValue.chbCloseAC)
    );

    this.reportModel.Values.push(
      new ReportKeyValue('IsMiscGrid', this.showMiscAccTypeGridInfo.toString())
    );

    // report name logic start
    if (this.selectedItem.length == 1) {
      if (fValue.chbByOldAC) {
        if (fValue.rbLanguage == '0') {
          this.reportModel.ReportName = 'CCULB_rptCsDetailList01ByOldAccNo';
        } else {
          this.reportModel.ReportName = 'rptCsDetailList01ByOldAccNo_B';
        }
      } else {
        if (fValue.rbLanguage == '0') {
          this.reportModel.ReportName = 'CCULB_rptCsDetailList01ByMemNo';
        } else {
          this.reportModel.ReportName = 'rptCsDetailList01ByMemNo_B';
        }
      }
    } else if (this.selectedItem.length == 2) {
      if (fValue.rbLanguage == '0') {
        this.reportModel.ReportName = 'CCULB_rptCsDetailList02';
      } else {
        this.reportModel.ReportName = 'rptCsDetailList02_B';
      }
    } else if (this.selectedItem.length == 3) {
      if (fValue.rbLanguage == '0') {
        this.reportModel.ReportName = 'CCULB_rptCsDetailList03';
      } else {
        this.reportModel.ReportName = 'rptCsDetailList03_B';
      }
    } else if (this.selectedItem.length == 4) {
      if (fValue.rbLanguage == '0') {
        this.reportModel.ReportName = 'CCULB_rptCsDetailList04';
      } else {
        this.reportModel.ReportName = 'rptCsDetailList04_B';
      }
    } else {
      this.reportModel.ReportName = 'CCULB_rptCsDetailList04';
    }

    // report name logic end

    console.log(this.reportModel.Values);
  }

  public getSelectedItemText(value: any, collection: IdDescription[]): string {
    let selected = collection.find((x) => x.Id == value);
    return selected.Description;
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

  // events Collector
  checkIsAllCollectorValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllCollectorStatus = true;
      this.IsCollectorDisabled = true;
      this.DetailListReportForm.controls['Collector'].setValue('0');
      this.DetailListReportForm.controls['CollectorCode'].setValue('');
    } else {
      this.chbIsAllCollectorStatus = false;
      this.DetailListReportForm.get('Collector').enable();
    }
  }

  onChangeCollectorCode(event: any) {
    let CollectorCodeId = this.DetailListReportForm.controls['CollectorCode']
      .value;
    console.log(CollectorCodeId);
    if (CollectorCodeId) {
      this.DetailListReportForm.patchValue({
        Collector: this.getSelectedItemIDCollector(
          CollectorCodeId,
          this.inputHelpData.CollectorList
        ),
      });
    }
  }

  public getSelectedItemIDCollector(
    value: any,
    collection: IdDescription[]
  ): number {
    let selected = collection.find((x) => x.Id == value);
    if (selected != undefined) {
      return selected.Id;
    } else {
      alert('Invalid Collector !');
      this.DetailListReportForm.patchValue({
        Collector: 0,
        CollectorCode: '',
      });
    }
    return selected.Id;
  }

  onChangeCollector(event: any) {
    let CollectorId = this.DetailListReportForm.controls['Collector'].value;
    console.log(CollectorId);
    if (CollectorId) {
      this.DetailListReportForm.patchValue({
        CollectorCode: CollectorId,
      });
    }
  }

  // events Group
  checkIsAllGroupValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllGroupStatus = true;
      this.IsGroupDisabled = true;
      this.DetailListReportForm.controls['Group'].setValue('0');
      this.DetailListReportForm.controls['GroupCode'].setValue('');
    } else {
      this.chbIsAllGroupStatus = false;
      this.DetailListReportForm.get('Group').enable();
    }
  }
  onChangeGroupCode(event: any) {
    let GroupCodeId = this.DetailListReportForm.controls['GroupCode'].value;
    console.log(GroupCodeId);
    if (GroupCodeId) {
      this.DetailListReportForm.patchValue({
        Group: this.getSelectedItemIDGroup(
          GroupCodeId,
          this.inputHelpData.GroupList
        ),
      });
    }
  }
  public getSelectedItemIDGroup(
    value: any,
    collection: IdDescription[]
  ): number {
    let selected = collection.find((x) => x.Id == value);
    if (selected != undefined) {
      return selected.Id;
    } else {
      alert('Invalid Group !');
      this.DetailListReportForm.patchValue({
        Group: 0,
        GroupCode: '',
      });
    }
    return selected.Id;
  }

  onChangeGroup(event: any) {
    let GroupId = this.DetailListReportForm.controls['Group'].value;
    console.log(GroupId);
    if (GroupId) {
      this.DetailListReportForm.patchValue({
        GroupCode: GroupId,
      });
    }
  }

  selectedItemList(data: any) {
    this.count = 0;
    this.count++;

    let check = this.selectedItem.find((x) => x == data);
    if (!check) {
      this.selectedItem.push(data);
      console.log('This is selected data', this.selectedItem);
    } else {
      let index = this.selectedItem.indexOf(data);
      let temp = [];
      var i = 0;
      while (i < this.selectedItem.length) {
        if (i != index) {
          temp.push(this.selectedItem[i]);
        }
        i++;
      }
      this.selectedItem = temp;
      console.log(this.selectedItem);
    }
  }
  isMiscAccClick(e) {
    console.log(e);
    if (e) {
      this.chbIsMiscAccStatus = true;
      this.showAccTypeGridInfo = false;
      this.showMiscAccTypeGridInfo = true;
      console.log(this.chbIsMiscAccStatus);
      this.getMiscAccGridInfoDetails();
      this.selectedItem = [];
      this.showByOldAC = false;
    } else {
      this.chbIsMiscAccStatus = false;
      this.showAccTypeGridInfo = true;
      this.showMiscAccTypeGridInfo = false;
      console.log(this.chbIsMiscAccStatus);
      this.selectedItem = [];
      this.showByOldAC = true;
    }
  }

  // MiscAccGrid Info table data
  getMiscAccGridInfoDetails = () => {
    this.spinner.show();
    this.mutualAidServiceReportService
      .GetMiscAccGridInfo()
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.Grid1DataList = x;
          console.log(
            'This is MiscAccGridTable information',
            this.Grid1DataList
          );

          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
          alert('Invalid !');
        }
      );
  };

  // Date change event
  // applicationDateChange() {
  //   var value = this.datepipe.transform(
  //     this.DetailListReportForm.value.IssueFromDate1,
  //     'dd-MM-yyyy'
  //   );
  //   var formatedValue = this.aService.convertDateToString(value);
  //   this.DetailListReportForm.value.IssueFromDate1 = formatedValue;
  //   this.storefDate = formatedValue;
  //   console.log(this.storefDate);
  // }
  // applicationDateChange2() {
  //   var value = this.datepipe.transform(
  //     this.DetailListReportForm.value.IssueToDate1,
  //     'dd-MM-yyyy'
  //   );
  //   var formatedValue = this.aService.convertDateToString(value);
  //   this.DetailListReportForm.value.IssueToDate1 = formatedValue;
  //   this.storetDate = formatedValue;
  //   console.log(this.storetDate);
  // }

  // Date change event
  applicationDateChange() {
    var fv = this.DetailListReportForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate1, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.DetailListReportForm.value.IssueFromDate1 = formatedValue;
    this.storefDate = formatedValue;
    console.log(this.DetailListReportForm.value);
    console.log('this is f date', this.storefDate);
  }
  applicationDateChange2() {
    var fv = this.DetailListReportForm.value;
    var value = this.datepipe.transform(fv.IssueToDate1, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.DetailListReportForm.value.IssueToDate1 = formatedValue;
    this.storetDate = formatedValue;
    console.log(this.DetailListReportForm.value);
    console.log(this.storetDate);
    console.log('this is t date', this.storetDate);
    console.log('this is f date', this.storefDate);
  }
}
