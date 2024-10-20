import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { MemberApplicationService } from 'src/app/services/member-application.service';
import {
  CheckBookIssueModel,
  CheckBookModel,
  MemberApplicationInputHelp,
} from '../../models/member-application.model';
import { AccountingService } from '../../services/accounting.service';

@Component({
  selector: 'app-cheque-book-issue',
  templateUrl: './cheque-book-issue.component.html',
  styleUrls: ['./cheque-book-issue.component.css'],
})
export class ChequeBookIssueComponent implements OnInit {
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
  constructor(
    private accountingService: AccountingService,
    private applicationService: MemberApplicationService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute
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
        this.ChequeBookIssueForm.controls['IssuDt'].setValue(
          data.ApplicationDate
        );
        this.spinner.hide();
      });
    this.getAccInfoDataList();
    // this.chequeInformation();
  }

  private initializeForm() {
    this.ChequeBookIssueForm = new FormGroup({
      AccType: new FormControl(''),
      selectedOptionCode: new FormControl('0'),
      OldAccNO: new FormControl(''),
      MemNo: new FormControl(''),
      AccNo: new FormControl(''),
      ChkPre: new FormControl(''),
      NoOfPages: new FormControl(''),
      BeginNo: new FormControl(''),
      EndNo: new FormControl(''),
      IssuDt: new FormControl(''),
    });
  }

  // enter key events

  onEnterAccTypeHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`OldAccNO`).focus();
  }

  onEnterOldAccNOHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`MemNo`).focus();
  }

  onEnterMemNoHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`AccNo`).focus();
  }

  onEnterAccNoHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`ChkPre`).focus();
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

  // Change Select Value

  changeSelectValue = (e) => {
    if (e.target.value) {
      let selectedCode = this.dataList.find(
        (x) => x.AccTypeCode == this.ChequeBookIssueForm.get('AccType').value
      );
      if (selectedCode) {
        this.ChequeBookIssueForm.patchValue({
          selectedOptionCode: selectedCode.AccTypeCode,
        });
        this.selectedCode = selectedCode.AccTypeCode;
      } else {
        this.ChequeBookIssueForm.patchValue({
          selectedOptionCode: 0,
          AccType: '',
        });
      }
      console.log(selectedCode);
    }
    document.getElementById(`OldAccNO`).focus();
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

  // Get Member information using old acc no

  changeOldAccNo = () => {
    if (this.ChequeBookIssueForm.value.AccType == '') {
      alert('Please Select the Account Type');
      this.ChequeBookIssueForm.controls['OldAccNO'].setValue('');
    }
    if (this.ChequeBookIssueForm.value.OldAccNO == '') {
      return;
    } else {
      let data = {
        OldAcc: this.ChequeBookIssueForm.value.OldAccNO,
        AccTypeCode: this.ChequeBookIssueForm.value.AccType,
      };
      this.showViewbtn = true;
      console.log(data);
      this.spinner.show();
      this.accountingService
        .GetMemberInfoByOldAcc(data)
        .pipe(first())
        .subscribe(
          (x: any) => {
            this.spinner.hide();
            this.memInfoList = x;
            console.log('This is memberInfoList', this.memInfoList);
            this.ChequeBookIssueForm.patchValue({
              MemNo: this.memInfoList[0].MemNo,
              AccNo: this.memInfoList[0].AccNo,
              //ProfessionDescription: selectedCode.ProfessionDescription,
            });
          },
          (err) => {
            this.spinner.hide();
          }
        );
    }
    document.getElementById(`MemNo`).focus();
  };

  chequeInformation = () => {
    let data = new CheckBookIssueModel();
    data.MemType = this.memInfoList[0].MemType;
    data.MemNo = this.ChequeBookIssueForm.value.MemNo;
    data.AccTypeCode = this.ChequeBookIssueForm.value.AccType;
    data.AccNo = this.ChequeBookIssueForm.value.AccNo;

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
    data.MemType = this.memInfoList[0].MemType;
    data.MemNo = this.ChequeBookIssueForm.value.MemNo;
    data.AccTypeCode = this.ChequeBookIssueForm.value.AccType;
    data.AccNo = this.ChequeBookIssueForm.value.AccNo;
    data.OldAccNO = this.ChequeBookIssueForm.value.OldAccNO;
    data.ChkPre = this.ChequeBookIssueForm.value.ChkPre;
    data.NoOfPages = this.ChequeBookIssueForm.value.NoOfPages;
    data.BeginNo = this.ChequeBookIssueForm.value.BeginNo;
    data.EndNo = this.ChequeBookIssueForm.value.EndNo;
    data.IssuDt = this.ChequeBookIssueForm.value.IssuDt;
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
    data.MemType = this.memInfoList[0].MemType;
    data.MemNo = this.ChequeBookIssueForm.value.MemNo;
    data.AccTypeCode = this.ChequeBookIssueForm.value.AccType;
    data.AccNo = this.ChequeBookIssueForm.value.AccNo;
    data.OldAccNO = this.ChequeBookIssueForm.value.OldAccNO;
    data.ChkPre = this.ChequeBookIssueForm.value.ChkPre;
    data.NoOfPages = this.ChequeBookIssueForm.value.NoOfPages;
    data.BeginNo = this.ChequeBookIssueForm.value.BeginNo;
    data.EndNo = this.ChequeBookIssueForm.value.EndNo;
    data.IssuDt = this.ChequeBookIssueForm.value.IssuDt;
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
    data.MemType = this.memInfoList[0].MemType;
    data.MemNo = this.memInfoList[0].MemNo;
    data.AccTypeCode = this.ChequeBookIssueForm.value.AccType;
    data.AccNo = this.ChequeBookIssueForm.value.AccNo;
    data.OldAccNO = this.ChequeBookIssueForm.value.OldAccNO;
    data.ChkPre = this.ChequeBookIssueForm.value.ChkPre;
    data.NoOfPages = this.ChequeBookIssueForm.value.NoOfPages;
    data.BeginNo = this.ChequeBookIssueForm.value.BeginNo;
    data.EndNo = this.ChequeBookIssueForm.value.EndNo;
    data.IssuDt = this.ChequeBookIssueForm.value.IssuDt;

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

  // Get Member Info
  GetMemInformation = () => {
    this.spinner.show();
    this.accountingService
      .GetMemInformation(this.ChequeBookIssueForm.value.MemNo)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          console.log('This is response of x', x);
          this.memInfoList = x;
          this.GetAccNo();
          this.showViewbtn = true;
          if (x[0].Message != null) {
            alert(x[0].Message);
            this.ChequeBookIssueForm.controls['MemNo'].setValue('');
          }
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  GetAccNo = () => {
    let data = {
      AccTypeCode: this.ChequeBookIssueForm.value.selectedOptionCode,
      MemNo: this.memInfoList[0].MemNo,
      MemNum: this.memInfoList[0].MemNum,
      MemType: this.memInfoList[0].MemType,
    };
    console.log('this is data', data);
    this.spinner.show();
    this.accountingService
      .AccTypeChanged(data)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.AccNo = x;
          console.log('This is x', x);
          if (x.AccNo != null) {
            this.ChequeBookIssueForm.controls['AccNo'].setValue(x.AccNo);
            console.log('This is if block');
          } else {
            console.log('This is else');
            this.ChequeBookIssueForm.controls['AccNo'].setValue('');
          }
          //}
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
}
