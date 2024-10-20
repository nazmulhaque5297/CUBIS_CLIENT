import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DebateVerifyAccounts, RebateParameter, RebateProcessPostModel } from 'src/app/modules/accounting/models/year-closing-process.model';
import { YearClosingProcessService } from 'src/app/modules/accounting/services/year-closing-process.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ReportCommonModel, ReportKeyValue } from 'src/app/Models/report-common.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportCommonService } from 'src/app/services/report-common.service';

@Component({
  selector: 'app-rebate-verify-list',
  templateUrl: './rebate-verify-list.component.html',
  styleUrls: ['./rebate-verify-list.component.css']
})
export class RebateVerifyListComponent implements OnInit,OnDestroy {
  public accountList: DebateVerifyAccounts[]=[];
  verifyForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  public interestDetailsData: RebateParameter = new RebateParameter();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  public itemOb:RebateProcessPostModel={
    AccountTypeId:0
  };
  
  constructor(private pService: YearClosingProcessService, 
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    public activeModal: NgbActiveModal,
    private sanitizer: DomSanitizer,
    private aService: ReportCommonService,
    ) { 
      this.reportModel.ReportName = '';
      this.reportModel.Values = [];
    }

  ngOnInit(): void {
    this.getDataList();
  }

  private getDataList(): void {
    this.spinner.show();
    this.pService.GetVerifyList(this.itemOb.AccountTypeId).pipe(takeUntil(this.destroy$)).subscribe((data) => {
        this.accountList = data;
        this.spinner.hide();
      });
  }



  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onVerifyUpdate():void{
    this.spinner.show();
    this.pService.VerifyRebateUpdate(this.accountList).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      alert('Successfully updated!');
        this.spinner.hide();
      });
  }





  public setParameter(AccNo:any) {
    var fValue = this.verifyForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue('CommonNo1', AccNo)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('CommonNo2', this.interestDetailsData.RebateCalType)
    );


    // let selectedCode = this.accountTypeList.find(
    //   (x) => x.Id == fValue.AccountTypeCode
    // );
    // let valueCommonName1 =
    //   'Interest Calculation for ' +
    //   fValue.AccountTypeCode.toString() +
    //   ' - ' +
    //   selectedCode.Description.toString();



    //   console.log("InterestDetails Data---->", this.interestDetailsData)

    let valueCommonName1 =
      'Rebalte ' + this.interestDetailsData.CalculationPeriod.toString();

    this.reportModel.Values.push(
      new ReportKeyValue('CommonNam1', valueCommonName1)
    );

    if (fValue.BranchCode == '') {
      this.reportModel.Values.push(new ReportKeyValue('BranchValue', '0'));
      this.reportModel.ReportName = 'rptCSRebateDetailsReportSpecialFun';
      
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('BranchValue', fValue.BranchCode)
      );
      this.reportModel.ReportName = 'rptCSRebateDetailsReportSpecialFun';
    }
    this.getReportToken();
  }


  public getReportToken = () => {
    this.spinner.show();
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
  };
  private setIframe = (x: any) => {

    var iFramePath = environment.reportUrl + 'id=' + x.id + '&token=' + x.token;

    window.open(iFramePath,"_blank");
  };


}
