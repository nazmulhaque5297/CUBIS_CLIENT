import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserModule, UserInfo } from 'src/app/Models/Common.model';
import { first, takeUntil } from 'rxjs/operators';
import { AccClassDetails, LoanReceivedReportInputHelp } from 'src/app/Models/loanreceived-report.model';
import { ReportCommonModel, ReportKeyValue } from 'src/app/Models/report-common.model';
import { ProitLoassAppropriationReportService } from 'src/app/services/profit-loss-appropriation.service';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { ProfitLossGridModel } from '../../models/accounting-input-budget.model';
import { ProfitLoassAppropriationReportPageLoadModel } from '../../models/profit-loss-appropriation.model';
import { BudgetParameterService } from '../../services/accounting module/budget-parameter.service';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profit-loss-appropriation',
  templateUrl: './profit-loss-appropriation.component.html',
  styleUrls: ['./profit-loss-appropriation.component.css'],
})
export class ProfitLossAppropriationComponent implements OnInit {
  public inputHelpData: LoanReceivedReportInputHelp =
  new LoanReceivedReportInputHelp();
UserData: UserInfo;
public accTypeClassData: AccClassDetails = new AccClassDetails();
private destroy$: Subject<void> = new Subject<void>();
  ProfitLossAppropriationForm: FormGroup;
  showPost: boolean = false;
  dataList: ProfitLossGridModel[] = [];
  public pageLoadModel: ProfitLoassAppropriationReportPageLoadModel =
    new ProfitLoassAppropriationReportPageLoadModel();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  chbForCollectorDisable: boolean = true;
  chbForGroupDisable: boolean = true;
  chbForGenderDisable: boolean = true;
  constructor(
    private budgetParameterService: BudgetParameterService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private aService: ReportCommonService,
    public datepipe: DatePipe,
    private proitLoassAppropriationReportService: ProitLoassAppropriationReportService
  ) {
    this.reportModel.ReportName = 'rptProfitLossAppropriationAccount';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.showPost = false;
    this.initializeForm();
  }
  initializeForm() {
    this.ProfitLossAppropriationForm = new FormGroup({
      Date: new FormControl(''),
      VchNo: new FormControl(''),
      CashCode: new FormControl(''),
    });
    this.inputLoadData();
    this.getInputHelpData();
  }

  public getInputHelpData() {
    this.proitLoassAppropriationReportService
      .GetInputHelpData()
      .pipe(first())
      .subscribe((data: any) => {
        this.pageLoadModel = data;
        this.ProfitLossAppropriationForm.controls['Date'].setValue(
          this.pageLoadModel.FromDate
        );
      });
  }

  public getReportToken = () => {
    this.spinner.show();
    this.setParameter();
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
  private setParameter(): void {
    var fValue = this.ProfitLossAppropriationForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue('fDate', fValue.Date)
    );

    console.log(this.reportModel.Values);
  }
  
  private setIframe = (x: any) => {
    var iFramePath = environment.reportUrl + 'id=' + x.id + '&token=' + x.token;

    window.open(iFramePath, '_blank');
  };
  inputLoadData() {
    this.spinner.show();
    this.budgetParameterService
      .GetProfitLossLoadData()
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.ProfitLossAppropriationForm.controls['Date'].setValue(x.Date);
          this.ProfitLossAppropriationForm.controls['CashCode'].setValue(
            x.CashCode
          );
          this.dataList = x.ProfitLossGridView;
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }
  exitPage() {
    this.router.navigate(['accounting/']);
  }
  processClick() {
    let sendData = {
      CashCode: this.ProfitLossAppropriationForm.value.CashCode,
      Date: this.ProfitLossAppropriationForm.value.Date,
    };
    this.budgetParameterService
      .CheckProfitLossProcessData(sendData)
      .pipe(first())
      .subscribe(
        (x: any) => {
          if (x == 1) {
            this.showPost = true;
          } else {
            this.toastr.error('Not Possible', 'Error');
          }
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }
  postData() {
    if (this.ProfitLossAppropriationForm.value.VchNo != '') {
      if (confirm('Are you you want to submit information?')) {
        this.budgetParameterService
          .ProfitLossInsertData(this.ProfitLossAppropriationForm.value)
          .pipe(first())
          .subscribe((x: any) => {
            if (x.Success) {
              this.toastr.success('Data Submitted Successfully.!', 'Success');
              this.ngOnInit();
            } else {
              this.toastr.error(x.Message, 'Error');
            }
          });
      }
    } else {
      this.toastr.error('Please Enter Voucher No', 'Error');
    }
  }
}
