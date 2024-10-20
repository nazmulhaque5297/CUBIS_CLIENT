import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { MemberApplicationService } from 'src/app/services/member-application.service';
import { CheckBookIssueModel, CheckBookModel, MemberApplicationInputHelp } from '../../../models/member-application.model';
import { AccountingService } from '../../../services/accounting.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ChequeIssueServiceService } from '../../../services/cheque-issue-service.service';
import { Store, select } from '@ngrx/store';
import { IApplicationCommonModel } from 'src/app/Models/Common.model';

@Component({
  selector: 'app-cheque-book-counter-modal',
  templateUrl: './cheque-book-counter-modal.component.html',
  styleUrls: ['./cheque-book-counter-modal.component.css']
})
export class ChequeBookCounterModalComponent implements OnInit {
  module: string = '1';
  ChequeBookIssueForm: FormGroup;
  dataList = [];
  memInfoList = [];
  AccNo: CheckBookModel[] = [];
  chequeInfo = [];
  memInfo = [];

  selectedCode: any = null;
  displayTabularData: boolean = false;
  showViewbtn: boolean = false;
  showModal: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();
  public inputHelpData: MemberApplicationInputHelp = new MemberApplicationInputHelp();
  commonData: IApplicationCommonModel;
  constructor(
    private accountingService: AccountingService,
    private applicationService: MemberApplicationService,
    private cService: ChequeIssueServiceService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    public activeModal: NgbActiveModal,
    private store: Store
  ) {}

  getResolvedUrl(route: ActivatedRouteSnapshot): string {
    let url = route.pathFromRoot
      .map((v) => v.url.map((segment) => segment.toString()).join('/'))
      .join('/');
    const queryParam = route.queryParamMap;
    if (queryParam.keys.length > 0) {
      url +=
        '?' +
        queryParam.keys
          .map((key) =>
            queryParam
              .getAll(key)
              .map((value) => key + '=' + value)
              .join('&')
          )
          .join('&');
    }
    return this.getModuleName(url);
  }
  getModuleName(urlData: any) {
    console.log(urlData);
    var result = '';
    for (var i = 1; i < urlData.length; i++) {
      if (urlData[i] == '/') return result;
      result += urlData[i];
    }
  }

  ngOnInit(): void {
    var urlData = this.getResolvedUrl(this.route.snapshot);
    if (urlData == 'booth') this.module = '3';
    else if (urlData == 'accounting') this.module = '1';
    this.initializeForm();
    this.showViewbtn = false;
    this.applicationService
      .getInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        console.log('This is application date');
        console.log('This is InputData', this.inputHelpData);
        // this.ChequeBookIssueForm.controls['IssuDt'].setValue(
        //   data.ApplicationDate
        // );
        this.spinner.hide();
      });
    this.getAccInfoDataList();
    // this.chequeInformation();
  }

  private initializeForm() {
    this.ChequeBookIssueForm = new FormGroup({
      ChkPre: new FormControl(''),
      NoOfPages: new FormControl(''),
      BeginNo: new FormControl(''),
      EndNo: new FormControl(''),
      IssuDt: new FormControl(''),
    });
  }






  onEnterChkPreHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`NoOfPages`).focus();
  }

  onEnterNoOfPagesHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`BeginNo`).focus();
  }

  onEnterBeginNoHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`EndNo`).focus();
  }

  onEnterEndNoHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`dateFormat`).focus();
  }

  // Change Ending page automatically
  getEndingpage() {
    if (this.ChequeBookIssueForm.value.NoOfPages != '') {
      this.ChequeBookIssueForm.controls['EndNo'].setValue(
        this.ChequeBookIssueForm.value.NoOfPages
      );
    }
  }

  // Professional Code Data
  getAccInfoDataList = () => {
    this.spinner.show();
    this.accountingService
      .GetChequeBookIssueAccDetails()
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.dataList = x;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };


  // Select handler

  selectChangeHandler(event: any) {
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.dataList.find(
        (x) => x.AccTypeCode == ChangeSelectedOption
      );
      this.ChequeBookIssueForm.patchValue({
        selectedOptionCode: selectedCode.AccTypeCode,
        AccType: selectedCode.AccType == 0 ? '' : selectedCode.AccTypeCode,
      });
      this.selectedCode = selectedCode.AccTypeCode;

      console.log(selectedCode);
    }
    document.getElementById(`OldAccNO`).focus();
  }



  chequeInformation = () => {
    let data = new CheckBookIssueModel();
    data.MemType = this.cService.MemType;
    data.MemNo = this.cService.MemNo;
    data.AccTypeCode = this.cService.AccTypeCode;
    data.AccNo = this.cService.AccNo;
    console.log("this is data", data)
    this.spinner.show();
    this.accountingService
      .ChequeInformation(data)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.chequeInfo = x;
          console.log('This is memberInfoList', this.chequeInfo);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  //need to work module here
  PreviousChqBook = () => {
    let data = new CheckBookIssueModel();
    data.MemType = this.cService.MemType;
    data.MemNo = this.cService.MemNo;
    data.AccTypeCode = this.cService.AccTypeCode;
    data.AccNo = this.cService.AccNo;
    data.OldAccNO = this.cService.OldAccNO;
    data.ChkPre = this.ChequeBookIssueForm.value.ChkPre;
    data.NoOfPages = this.ChequeBookIssueForm.value.NoOfPages;
    data.BeginNo = this.ChequeBookIssueForm.value.BeginNo;
    data.EndNo = this.ChequeBookIssueForm.value.EndNo;
    data.IssuDt = this.inputHelpData.ApplicationDate;
    data.ModuleNo = Number(this.module);

    console.log('This is data', data);
    this.spinner.show();
    this.accountingService
      .PreviousChqBook(data)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          if (x == 1) {
            this.showModal = true;
          } else {
            this.showModal = false;
          }
          console.log('This is member info for x', x);
          //location.reload();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  // need to work module here
  CheckBtnState = (event: any) => {
    this.showModal = false;
    console.log(event.target.value);
    let data = new CheckBookIssueModel();
    data.MemType = this.cService.MemType;
    data.MemNo = this.cService.MemNo;
    data.AccTypeCode = this.cService.AccTypeCode;
    data.AccNo = this.cService.AccNo;
    data.OldAccNO = this.cService.OldAccNO;
    data.ChkPre = this.ChequeBookIssueForm.value.ChkPre;
    data.NoOfPages = this.ChequeBookIssueForm.value.NoOfPages;
    data.BeginNo = this.ChequeBookIssueForm.value.BeginNo;
    data.EndNo = this.ChequeBookIssueForm.value.EndNo;
    data.IssuDt = this.inputHelpData.ApplicationDate;
    data.ChkButtonState = event.target.value;
    data.ModuleNo = Number(this.module);

    this.spinner.show();
    this.accountingService
      .CheckBtnState(data)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          alert('Data Updated');
          this.initializeForm();
          console.log('This is member info for x', x);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  BeginNoChk = () => {
    // this.getEndingpage();
    let data = new CheckBookIssueModel();
    data.MemType = this.cService.MemType;
    data.MemNo = this.cService.MemNo;
    data.AccTypeCode = this.cService.AccTypeCode;
    data.AccNo = this.cService.AccNo;
    data.OldAccNO = this.cService.OldAccNO;
    data.ChkPre = this.ChequeBookIssueForm.value.ChkPre;
    data.NoOfPages = this.ChequeBookIssueForm.value.NoOfPages;
    data.BeginNo = this.ChequeBookIssueForm.value.BeginNo;
    data.EndNo = this.ChequeBookIssueForm.value.EndNo;
    data.IssuDt = this.inputHelpData.ApplicationDate;

    this.spinner.show();
    this.accountingService
      .BeginNoChk(data)
      .pipe(first())
      .subscribe(
        (x: any) => {
          console.log('this is return  value', x);
          this.ChequeBookIssueForm.controls['EndNo'].setValue(x.EndNo);
          this.spinner.hide();
          if (x.Success == false) {
            alert(x.Message);
            this.ChequeBookIssueForm.controls['BeginNo'].setValue('');
            this.ChequeBookIssueForm.controls['EndNo'].setValue('');
          }
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };




}
