import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { ReportCommonModel, ReportKeyValue } from 'src/app/Models/report-common.model';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { environment } from 'src/environments/environment';
import { MonthlyMonitoringFinalHeadDataModel } from '../../../models/monthly-monitoring-report.model';
import { AccountingService } from '../../../services/accounting.service';
import { MobileSmsService } from '../../../services/mobile-sms.service';

@Component({
  selector: 'app-monthly-monitoring-report',
  templateUrl: './monthly-monitoring-report.component.html',
  styleUrls: ['./monthly-monitoring-report.component.css']
})
export class MonthlyMonitoringReportComponent implements OnInit {

  accTypeList: any;
  collectorCodeList: any;
  groupNameList: any;
  processDate: any;
  monthlyMonitoringReportForm: FormGroup;
  isDisableCollector: boolean = true;
  isDisableGroup: boolean = true;
  selectedAccTypeList: any[]=[];
  showGenerateList:boolean = false;
  generateList:any[] = [];
  selectedAccList:number[]=[];
  calanderList: any[] = [];
  yearList: any[] = [];
  previewDataList: any[] = [];
  previewSubHeadList: any[] = [];
  finalSubModelData: MonthlyMonitoringFinalHeadDataModel = new MonthlyMonitoringFinalHeadDataModel();
  viewSortBtn = false;
  private reportModel: ReportCommonModel = new ReportCommonModel();
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private mobileSmsService: MobileSmsService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private router: Router,
    private accService: AccountingService,
    private aService: ReportCommonService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.isDisableCollector = true;
    this.isDisableGroup = true;
    this.selectedAccTypeList = [];
    this.showGenerateList = false;
    this.generateList = [];
    this.selectedAccList = [];
    this.calanderList = [];
    this.yearList = [];
    this.previewDataList = [];
    this.previewSubHeadList = [];
    this.viewSortBtn = false;
  }

  initializeForm(){
    this.monthlyMonitoringReportForm = new FormGroup({
      CollectorCode: new FormControl('0'),
      GroupName: new FormControl('0'),
      Month: new FormControl(''),
      Year: new FormControl(''),
      SubHeadSLNO: new FormControl('0'),
      FullHeadSLNO: new FormControl('0'),
      AccType: new FormControl('0'),
      SortFlag: new FormControl('0'),
      CSGLFlag: new FormControl(''),
    });
    this.monthlyMonitoringReportForm.controls['CollectorCode'].disable();
    this.monthlyMonitoringReportForm.controls['GroupName'].disable();
    this.pageLoad();
  }

  async pageLoad(){
    this.spinner.show();
    await this.mobileSmsService.SMSMemberBalanceLedgerPageLoad().pipe(first()).toPromise().then((x:any)=>{
      console.log(x);
      this.accTypeList = x.AccTypeList;
      this.collectorCodeList = x.CollectorCodeList;
      this.groupNameList = x.GroupNameList;
      this.processDate = x.ProcessDate;
      this.spinner.hide();
    })
    this.accService.monthlyMonitoringReportInputHelpData().pipe(first()).subscribe((x:any)=>{
      console.log(x);
      this.yearList = x.YearList;
      this.calanderList = x.CalanderList;
      let month = this.processDate[3]+''+this.processDate[4];
      let year = this.processDate[6]+''+this.processDate[7]+''+this.processDate[8]+''+this.processDate[9];
      let selectedMonth = this.calanderList.find(x=>x.Id==month);
      let selectedYear = this.yearList.find(x=>x.Id==year);
      this.monthlyMonitoringReportForm.controls['Month'].setValue(selectedMonth.Id);
      this.monthlyMonitoringReportForm.controls['Year'].setValue(selectedYear.Id);
    })
  }

  changeCheckGroup(){
    if(this.isDisableGroup==true){
      this.isDisableGroup = false;
      this.monthlyMonitoringReportForm.controls['GroupName'].enable();
    }
    else{
      this.isDisableGroup = true;
      this.monthlyMonitoringReportForm.controls['GroupName'].disable();
    }
  }

  changeCheckCollector(){
    if(this.isDisableCollector==true){
      this.isDisableCollector = false;
      this.monthlyMonitoringReportForm.controls['CollectorCode'].enable();
    }
    else{
      this.isDisableCollector = true;
      this.monthlyMonitoringReportForm.controls['CollectorCode'].setValue('0');
      this.monthlyMonitoringReportForm.controls['CollectorCode'].disable();
      this.pageLoad();
    }
  }

  collectorCodeChange(){
    let selectedCode = this.collectorCodeList.find(x=>x.Id == this.monthlyMonitoringReportForm.value.CollectorCode);
    if(selectedCode){
      this.monthlyMonitoringReportForm.controls['CollectorCode'].setValue(this.monthlyMonitoringReportForm.value.CollectorCode);
      this.mobileSmsService.accLedBalCollectorCodeChangeData(this.monthlyMonitoringReportForm.value.CollectorCode).pipe(first()).subscribe((x:any)=>{
        this.groupNameList = x;
      });
    }
    else{
      this.toaster.error('Please input a valid collector code');
      this.monthlyMonitoringReportForm.controls['CollectorCode'].setValue('0');
    }
  }

  groupCodeChange(){
    let selectedCode = this.groupNameList.find(x=>x.Id == this.monthlyMonitoringReportForm.value.GroupName);
    if(selectedCode){
      this.monthlyMonitoringReportForm.controls['GroupName'].setValue(this.monthlyMonitoringReportForm.value.GroupName);
    }
    else{
      this.toaster.error('Please input a valid Group Name');
      this.monthlyMonitoringReportForm.controls['GroupName'].setValue('0');
    }
  }

  btnProcessClick(){
    this.spinner.show();
    this.accService.monthlyMonitoringBtnPreviewData(this.monthlyMonitoringReportForm.value).pipe(first()).subscribe((x:any)=>{
      console.log("TargetData===>",x);
      this.previewDataList = x;
      this.spinner.hide();
    })
  }

  getSubHeadData(slNO:number){
    this.spinner.show();
    this.monthlyMonitoringReportForm.controls['SubHeadSLNO'].setValue(slNO);
    this.accService.monthlyMonitoringSubHeadData(this.monthlyMonitoringReportForm.value).pipe(first()).subscribe((x:any)=>{
      console.log("LazyData------>>>",x);
      this.previewSubHeadList = x.SubList;
      this.previewDataList = x.MainList;
      this.spinner.hide();
    })
  }

  setFullHeadData(item:any){
    this.monthlyMonitoringReportForm.controls['FullHeadSLNO'].setValue(item.SLNO);
    this.monthlyMonitoringReportForm.controls['AccType'].setValue(item.AccType);
    this.monthlyMonitoringReportForm.controls['CSGLFlag'].setValue(item.CSGLFlag);
    this.getFullHeadData();
  }

  sortBtnClick(){
    if(this.monthlyMonitoringReportForm.value.SortFlag=='0'){
      this.monthlyMonitoringReportForm.controls['SortFlag'].setValue('1');
    }
    else{
      this.monthlyMonitoringReportForm.controls['SortFlag'].setValue('0');
    }
    this.getFullHeadData();
  }

  backBtn2(){
    this.viewSortBtn = false;
    this.finalSubModelData = new MonthlyMonitoringFinalHeadDataModel();
  }

  backBtn1(){
    this.previewSubHeadList = [];
  }

  getFullHeadData(){
    this.spinner.show();
    this.accService.monthlyMonitoringFullHeadData(this.monthlyMonitoringReportForm.value).pipe(first()).subscribe((x:any)=>{
      console.log(x);
      this.finalSubModelData = x;
      if(this.finalSubModelData.GvDtlHeader==null) this.finalSubModelData.GvDtlHeader = [];
      if(this.finalSubModelData.GvDtlHeader1==null) this.finalSubModelData.GvDtlHeader1 = [];
      if(this.finalSubModelData.GvDtlHeader2==null) this.finalSubModelData.GvDtlHeader2 = [];
      if(this.finalSubModelData.GvDtlHeader3==null) this.finalSubModelData.GvDtlHeader3 = [];
      if(this.finalSubModelData.GvDtlHeader4==null) this.finalSubModelData.GvDtlHeader4 = [];
      this.previewDataList = this.finalSubModelData.MainList;
      this.previewSubHeadList = this.finalSubModelData.SubList;
      this.viewSortBtn = true;
      // this.previewSubHeadList = x.SubList;
      // this.previewDataList = x.MainList;
      this.spinner.hide();
    })
  }

  btnPrint1(){
    var fValue = this.monthlyMonitoringReportForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue('CommonName1', fValue.Month.toString() + '\'' + fValue.Year.toString())
    );
    let collectorText = this.collectorCodeList.find(x=>x.Id==fValue.CollectorCode);
    if(this.isDisableCollector){
      this.reportModel.Values.push(
        new ReportKeyValue('CommonNo2', "0")
      );
      this.reportModel.Values.push(
        new ReportKeyValue('CommonName2', "All")
      );
    }
    else{
      this.reportModel.Values.push(
        new ReportKeyValue('CommonNo2',collectorText.Id)
      );
      this.reportModel.Values.push(
        new ReportKeyValue('CommonName2', collectorText.Description)
      );
    }
    let groupText = this.collectorCodeList.find(x=>x.Id==fValue.GroupName);
    if(this.isDisableCollector){
      this.reportModel.Values.push(
        new ReportKeyValue('CommonNo3', "0")
      );
      this.reportModel.Values.push(
        new ReportKeyValue('CommonName3', "All")
      );
    }
    else{
      this.reportModel.Values.push(
        new ReportKeyValue('CommonNo3',groupText.Id)
      );
      this.reportModel.Values.push(
        new ReportKeyValue('CommonName3', groupText.Description)
      );
    }
    this.reportModel.ReportName = 'rptCsMonitoringReport1';
    this.getReportToken();
  }

  btnPrint2(){
    var fValue = this.monthlyMonitoringReportForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue('CommonName1', fValue.Month.toString() + '\'' + fValue.Year.toString())
    );
    let particularInfo = this.previewDataList.find(x=>x.SLNO == fValue.SubHeadSLNO);
    this.reportModel.Values.push(
      new ReportKeyValue('CommonName2',particularInfo.Perticulars)
    );
    let collectorText = this.collectorCodeList.find(x=>x.Id==fValue.CollectorCode);
    if(this.isDisableCollector){
      this.reportModel.Values.push(
        new ReportKeyValue('CommonNo3', "0")
      );
      this.reportModel.Values.push(
        new ReportKeyValue('CommonName3', "All")
      );
    }
    else{
      this.reportModel.Values.push(
        new ReportKeyValue('CommonNo3',collectorText.Id)
      );
      this.reportModel.Values.push(
        new ReportKeyValue('CommonName3', collectorText.Description)
      );
    }
    let groupText = this.collectorCodeList.find(x=>x.Id==fValue.GroupName);
    if(this.isDisableCollector){
      this.reportModel.Values.push(
        new ReportKeyValue('CommonNo4', "0")
      );
      this.reportModel.Values.push(
        new ReportKeyValue('CommonName4', "All")
      );
    }
    else{
      this.reportModel.Values.push(
        new ReportKeyValue('CommonNo4',groupText.Id)
      );
      this.reportModel.Values.push(
        new ReportKeyValue('CommonName4', groupText.Description)
      );
    }
    this.reportModel.ReportName = 'rptCsMonitoringReport2';
    this.getReportToken();
  }

  btnPrint3(){
    var fValue = this.monthlyMonitoringReportForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue('CommonName1', fValue.Month.toString() + '\'' + fValue.Year.toString())
    );
    let particularInfo = this.previewDataList.find(x=>x.SLNO == fValue.SubHeadSLNO);
    this.reportModel.Values.push(
      new ReportKeyValue('CommonName2',particularInfo.Perticulars)
    );
    let commonNameInfo = this.previewSubHeadList.find(x=>x.AccType==fValue.AccType)
    this.reportModel.Values.push(
      new ReportKeyValue('CommonName3',commonNameInfo.AccType)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('CommonName4',commonNameInfo.Perticulars)
    );
    let collectorText = this.collectorCodeList.find(x=>x.Id==fValue.CollectorCode);
    if(this.isDisableCollector){
      this.reportModel.Values.push(
        new ReportKeyValue('CommonNo5', "0")
      );
      this.reportModel.Values.push(
        new ReportKeyValue('CommonName5', "All")
      );
    }
    else{
      this.reportModel.Values.push(
        new ReportKeyValue('CommonNo5',collectorText.Id)
      );
      this.reportModel.Values.push(
        new ReportKeyValue('CommonName5', collectorText.Description)
      );
    }
    let groupText = this.collectorCodeList.find(x=>x.Id==fValue.GroupName);
    if(this.isDisableCollector){
      this.reportModel.Values.push(
        new ReportKeyValue('CommonNo6', "0")
      );
      this.reportModel.Values.push(
        new ReportKeyValue('CommonName6', "All")
      );
    }
    else{
      this.reportModel.Values.push(
        new ReportKeyValue('CommonNo6',groupText.Id)
      );
      this.reportModel.Values.push(
        new ReportKeyValue('CommonName6', groupText.Description)
      );
    }
    if (fValue.CSGLFlag == "0" && (fValue.FullHeadSLNO == "102" || fValue.FullHeadSLNO == "104" || (fValue.FullHeadSLNO == "107" || fValue.FullHeadSLNO == "108") || (fValue.FullHeadSLNO == "110" || fValue.FullHeadSLNO == "112" || (fValue.FullHeadSLNO == "114" || fValue.FullHeadSLNO == "201")) || (fValue.FullHeadSLNO == "401" || fValue.FullHeadSLNO == "403" || (fValue.FullHeadSLNO == "501" || fValue.FullHeadSLNO == "502") || (fValue.FullHeadSLNO == "503" || fValue.FullHeadSLNO == "504" || fValue.FullHeadSLNO == "505"))))
    {
       this.reportModel.ReportName = 'rptCsMonitoringReport3';
    }
    else if (fValue.CSGLFlag == "0" && (fValue.FullHeadSLNO == "118" || fValue.FullHeadSLNO == "119" || (fValue.FullHeadSLNO == "120" || fValue.FullHeadSLNO == "121") || (fValue.FullHeadSLNO == "122" || fValue.FullHeadSLNO == "123" || (fValue.FullHeadSLNO == "124" || fValue.FullHeadSLNO == "405")) || (fValue.FullHeadSLNO == "406" || fValue.FullHeadSLNO == "407" || (fValue.FullHeadSLNO == "408" || fValue.FullHeadSLNO == "409"))))
    {
      this.reportModel.Values.push(
        new ReportKeyValue('CommonNo1', fValue.SortFlag)
      );
      this.reportModel.ReportName = 'rptCsMonitoringReport7';
    }
    else if (fValue.CSGLFlag == "0" && (fValue.FullHeadSLNO == "101" || fValue.FullHeadSLNO == "103" || (fValue.FullHeadSLNO == "105" || fValue.FullHeadSLNO == "106") || (fValue.FullHeadSLNO == "109" || fValue.FullHeadSLNO == "111" || (fValue.FullHeadSLNO == "113" || fValue.FullHeadSLNO == "301")) || (fValue.FullHeadSLNO == "302" || fValue.FullHeadSLNO == "303" || (fValue.FullHeadSLNO == "304" || fValue.FullHeadSLNO == "402") || (fValue.FullHeadSLNO == "404" || fValue.FullHeadSLNO == "601" || (fValue.FullHeadSLNO == "602" || fValue.FullHeadSLNO == "603"))) || fValue.FullHeadSLNO == "604"))
    {
      this.reportModel.Values.push(
        new ReportKeyValue('CommonNo1', fValue.SortFlag)
      );
      this.reportModel.ReportName = 'rptCsMonitoringReport6';
    }
    else if (fValue.CSGLFlag == "0" && fValue.FullHeadSLNO == "605")
    {
      this.reportModel.ReportName = 'rptCsMonitoringReport5';
    }
    else if (fValue.CSGLFlag == "1" && (fValue.FullHeadSLNO == "601" || fValue.FullHeadSLNO == "602" || (fValue.FullHeadSLNO == "603" || fValue.FullHeadSLNO == "604")))
    {
      this.reportModel.Values.push(
        new ReportKeyValue('CommonNo1', fValue.SortFlag)
      );
      this.reportModel.ReportName = 'rptCsMonitoringReport4';
    }
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
  }

  private setIframe = (x: any) => {
    var iFramePath = environment.reportUrl + 'id=' + x.id + '&token=' + x.token;

    window.open(iFramePath, '_blank');
  }

}
