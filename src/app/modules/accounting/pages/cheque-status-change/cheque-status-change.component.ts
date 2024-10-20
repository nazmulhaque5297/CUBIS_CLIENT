import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { MemberApplicationService } from 'src/app/services/member-application.service';
import { AccountingService } from '../../services/accounting.service';

@Component({
  selector: 'app-cheque-status-change',
  templateUrl: './cheque-status-change.component.html',
  styleUrls: ['./cheque-status-change.component.css'],
})
export class ChequeStatusChangeComponent implements OnInit {
  ChequeBookStatusForm: FormGroup;
  dataList: any[] = [];
  memInfo = [];
  AccNo: any;
  infoData: any[] = [];
  detailsData: any = [];
  ChqBStatList: any[] = [];
  ChqPStatList: any[] = [];
  showDetails: boolean = false;
  hideDetails: boolean = true;
  selectedCode: any = null;
  bookCountofMain: number;

  ChqBStatChangeList: any[] = [];

  ChqPStatChangeList: any[] = [];

  constructor(
    private accountingService: AccountingService,
    private applicationService: MemberApplicationService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getAccInfoDataList();
    this.PageLoad();
  }
  private initializeForm() {
    this.ChequeBookStatusForm = new FormGroup({
      AccType: new FormControl(''),
      selectedOptionCode: new FormControl('0'),
      MemNo: new FormControl(''),
      AccNo: new FormControl(''),
      selectedBValue: new FormControl('0'),
      selectedPValue: new FormControl('0'),
      ChqBStatChange: new FormControl(''),
      ChqPStatChange: new FormControl('0'),
    });
  }

  PageLoad = () => {
    this.spinner.show();
    this.accountingService
      .PageLoad()
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.ChqBStatList = x.ChqBStat;
          this.ChqPStatList = x.ChqPStat;
          console.log(this.ChqBStatList);
          console.log(this.ChqPStatList);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  // enter key events

  onEnterMemNoHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`AccType`).focus();
  }

  onEnterAccTypeHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`AccNo`).focus();
  }

  // Get Account info
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

  changePData(item: any, event: any) {
    item.ChqPStat = event.target.value;
    item.Description = this.ChqPStatList.find(
      (x) => x.Id == event.target.value
    ).Description;
    this.ChqPStatChangeList.push(item);
    console.log(this.ChqPStatChangeList);
  }
  changeBData(item: any) {
    console.log(this.ChequeBookStatusForm.value.ChqBStatChange, ' \n ', item);
    item.ChqBStat = this.ChequeBookStatusForm.value.ChqBStatChange;
    item.Description = this.ChqBStatList.find(
      (x) => x.Id == this.ChequeBookStatusForm.value.ChqBStatChange
    ).Description;
    this.ChqBStatChangeList.push(item);
    console.log(this.ChqBStatChangeList);
  }

  // Change Select Value

  changeSelectValue = (e) => {
    if (e.target.value) {
      let selectedCode = this.dataList.find(
        (x) => x.AccTypeCode == this.ChequeBookStatusForm.get('AccType').value
      );
      if (selectedCode) {
        this.ChequeBookStatusForm.patchValue({
          selectedOptionCode: selectedCode.AccTypeCode,
        });
        this.GetAccNo();
        this.selectedCode = selectedCode.AccTypeCode;
      } else {
        this.ChequeBookStatusForm.patchValue({
          selectedOptionCode: 0,
          AccType: '',
        });
      }
      this.MainGrid();
      console.log(selectedCode);
    }
  };

  // Select handler

  selectChangeHandler(event: any) {
    this.GetAccNo();
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.dataList.find(
        (x) => x.AccTypeCode == ChangeSelectedOption
      );
      if (selectedCode) {
        this.ChequeBookStatusForm.patchValue({
          selectedOptionCode: selectedCode.AccTypeCode,
          AccType: selectedCode.AccType == 0 ? '' : selectedCode.AccTypeCode,
        });
        this.selectedCode = selectedCode.AccTypeCode;

        console.log(selectedCode);
      } else {
        this.ChequeBookStatusForm.patchValue({
          AccType: '',
        });
      }
      this.MainGrid();
    }
    document.getElementById(`AccNo`).focus();
  }
  // Get Member Info
  GetMemInformation = () => {
    this.spinner.show();
    this.accountingService
      .GetMemInformation(this.ChequeBookStatusForm.value.MemNo)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          console.log('This is response of x', x);
          this.memInfo = x;
          console.log('This is response of meminfo', this.memInfo);
          if (x[0].Message != null) {
            alert(x[0].Message);
            this.ChequeBookStatusForm.controls['MemNo'].setValue('');
            location.reload();
          }
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  GetAccNo = () => {
    let data = {
      AccTypeCode: this.ChequeBookStatusForm.value.selectedOptionCode,
      MemNo: this.memInfo[0].MemNo,
      MemNum: this.memInfo[0].MemNum,
      MemType: this.memInfo[0].MemType,
    };
    this.spinner.show();
    this.accountingService
      .AccTypeChanged(data)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.AccNo = x;
          console.log('This is x', x);
          // if (x.Message != null) {
          //   alert(x.Message);
          // } else {
          if (x.AccNo != '') {
            this.ChequeBookStatusForm.controls['AccNo'].setValue(x.AccNo);
          } else {
            this.ChequeBookStatusForm.controls['AccNo'].setValue(
              x.data[0].AccNo
            );
          }
          //}
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  MainGrid = () => {
    let data = {
      AccTypeCode: this.ChequeBookStatusForm.value.selectedOptionCode,
      MemNo: this.memInfo[0].MemNo,
      MemNum: this.memInfo[0].MemNum,
      MemType: this.memInfo[0].MemType,
    };
    this.spinner.show();
    this.accountingService
      .MainGrid(data)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.infoData = x;
          console.log('This is info', this.infoData);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  SelectedValueDetails = (item) => {
    this.showDetails = true;
    this.hideDetails = false;
    let data = {
      AccTypeCode: this.ChequeBookStatusForm.value.selectedOptionCode,
      MemNo: this.memInfo[0].MemNo,
      MemNum: this.memInfo[0].MemNum,
      MemType: this.memInfo[0].MemType,
      AccNo: this.AccNo.AccNo,
      BookCount: item,
    };
    this.bookCountofMain = item;
    console.log('this is data', data);
    this.spinner.show();
    this.accountingService
      .SelectedValue(data)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.detailsData = x;
          this.ChequeBookStatusForm.controls['selectedPValue'].setValue(
            this.detailsData.ChqPStat
          );
          console.log('this is details data', this.detailsData);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  backButton() {
    this.showDetails = false;
    this.hideDetails = true;
  }

  updatePData() {
    console.log(this.ChqPStatChangeList);
    let data = {
      MemType: this.memInfo[0].MemType,
      MemNo: this.memInfo[0].MemNo,
      MemNum: this.memInfo[0].MemNum,
      AccNo: this.AccNo.AccNo,
      AccTypeCode: this.ChequeBookStatusForm.value.selectedOptionCode,
      BookCountOfMain: this.bookCountofMain,
      StatusList: this.ChqPStatChangeList,
    };
    this.accountingService
      .updateBValue(data)
      .pipe(first())
      .subscribe(
        (x: any) => {
          if (x == 1) {
            alert('data updated successfully');
            location.reload();
          }
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }
  updateBData() {
    console.log(this.ChqBStatChangeList);
    let data = {
      MemType: this.memInfo[0].MemType,
      MemNo: this.memInfo[0].MemNo,
      MemNum: this.memInfo[0].MemNum,
      AccNo: this.AccNo.AccNo,
      AccTypeCode: this.ChequeBookStatusForm.value.selectedOptionCode,
      StatusList: this.ChqBStatChangeList,
    };
    console.log(data);
    this.accountingService
      .updatePValue(data)
      .pipe(first())
      .subscribe(
        (x: any) => {
          if (x == 1) {
            alert('data updated successfully');
            location.reload();
          }
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }
}
