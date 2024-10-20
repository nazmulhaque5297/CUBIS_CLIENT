import { FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { AccountingService } from '../../services/accounting.service';

@Component({
  selector: 'app-open-chart-of-account',
  templateUrl: './open-chart-of-account.component.html',
  styleUrls: ['./open-chart-of-account.component.css'],
})
export class OpenChartOfAccountComponent implements OnInit {
  OpenChartofAccountForm: FormGroup;
  dataList = [];
  mainHeadList = [];
  subHeadList = [];
  showHeader: boolean = false;
  showMainHeader: boolean = false;
  showSubHeader: boolean = false;
  overDaft: boolean = false;
  mainHead = 0;
  subHead = 0;
  details = 0;
  GLHeadDesc: any;
  GLMainHeadDesc: any;
  GLSubHeadDesc: any;

  constructor(
    private spinner: NgxSpinnerService,
    private accountingService: AccountingService
  ) {}

  ngOnInit(): void {
    this.initializeFrom();
    this.getHeaderDropdown();
    this.OpenChartofAccountForm.controls['header'].disable();
    this.OpenChartofAccountForm.controls['mainHeader'].disable();
    this.OpenChartofAccountForm.controls['subHeader'].disable();
  }

  initializeFrom() {
    this.OpenChartofAccountForm = new FormGroup({
      rbtMethod1: new FormControl(''),
      rbtMethod2: new FormControl(''),
      rbtMethod3: new FormControl(''),
      header: new FormControl('0'),
      mainHeader: new FormControl('0'),
      subHeader: new FormControl('0'),
      newMainHead: new FormControl(''),
      desc: new FormControl(''),
      descBeng: new FormControl(''),
      newMainSubHead: new FormControl(''),
      newdetails: new FormControl(''),
      TrnMode: new FormControl('0'),
      Msic: new FormControl(''),
      OverDaft: new FormControl(''),
    });
  }

  clickMain(e) {
    console.log(e.target.value);
    if (e.target.value == 1) {
      this.showHeader = true;
      this.showSubHeader = false;
      this.showMainHeader = false;
      this.OpenChartofAccountForm.controls['header'].enable();
      this.OpenChartofAccountForm.controls['mainHeader'].disable();
      this.OpenChartofAccountForm.controls['subHeader'].disable();
      this.mainHead = 1;
      this.subHead = 0;
      this.details = 0;
    }
  }

  clickSub(e) {
    console.log(e.target.value);
    if (e.target.value == 2) {
      this.showMainHeader = true;
      this.showHeader = false;
      this.showSubHeader = false;
      this.OpenChartofAccountForm.controls['header'].enable();
      this.OpenChartofAccountForm.controls['mainHeader'].enable();
      this.OpenChartofAccountForm.controls['subHeader'].disable();
      this.mainHead = 0;
      this.subHead = 1;
      this.details = 0;
    }
  }

  clickdts(e) {
    console.log(e.target.value);
    if (e.target.value == 3) {
      this.showSubHeader = true;
      this.showMainHeader = false;
      this.showHeader = false;
      this.OpenChartofAccountForm.controls['header'].enable();
      this.OpenChartofAccountForm.controls['mainHeader'].enable();
      this.OpenChartofAccountForm.controls['subHeader'].enable();
      this.mainHead = 0;
      this.subHead = 0;
      this.details = 1;
    }
  }

  // Get Header Drop down

  getHeaderDropdown = () => {
    this.spinner.show();
    this.accountingService
      .GetHeaderInfo()
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.dataList = x;
          console.log('This is header dropdown', this.dataList);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  selectChangeHandler() {
    this.getMainHeaderDropdown();
    let selectedCode = this.dataList.find(
      (x) => x.GLHead == this.OpenChartofAccountForm.get('header').value
    );
    this.GLHeadDesc = selectedCode.GLHeadDesc;
    console.log('This is value', this.GLHeadDesc);
  }

  // Get Main Header Dropdown Info
  getMainHeaderDropdown = () => {
    var fValue = this.OpenChartofAccountForm.value;
    var GlAccNo = fValue.header;
    this.accountingService
      .GetMainHeaderInfo(GlAccNo)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.mainHeadList = x;
          if (
            this.mainHeadList[0].HeadCodeValue != 0 ||
            this.mainHeadList[0].HeadCodeValue != null
          ) {
            this.OpenChartofAccountForm.controls['newMainHead'].setValue(
              this.mainHeadList[0].HeadCodeValue
            );
          }
          console.log('This is Mainheader dropdown', this.mainHeadList);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  selectHeaderChangeHandler() {
    this.getSubHeaderDropdown();
  }
  // Get Main Header Dropdown Info
  getSubHeaderDropdown = () => {
    var fValue = this.OpenChartofAccountForm.value;
    let data = {
      GlAccNo: fValue.header,
      MainHead: fValue.mainHeader,
    };
    this.accountingService
      .GetSubHeaderInfo(data)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.subHeadList = x;
          if (
            this.subHeadList[0].MainCodeValue != 0 ||
            this.subHeadList[0].MainCodeValue != null
          ) {
            this.OpenChartofAccountForm.controls['newMainSubHead'].setValue(
              this.subHeadList[0].MainCodeValue
            );
          }
          console.log('This is Subheader dropdown', this.subHeadList);
          let selectedCode = this.mainHeadList.find(
            (x) =>
              x.GLHead == this.OpenChartofAccountForm.get('mainHeader').value
          );
          this.GLMainHeadDesc = selectedCode.GLMainHeadDesc;
          console.log('This is main heaad', this.GLMainHeadDesc);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  patchValue(e) {
    this.accountingService
      .GetDeatilsCode(e.target.value)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          let value = x;
          this.OpenChartofAccountForm.controls['newdetails'].setValue(value);
          console.log('This is main heaad', this.GLMainHeadDesc);
        },
        (err) => {
          this.spinner.hide();
        }
      );

    if (e.target.value == 10106000) {
      this.overDaft = true;
    } else {
      this.overDaft = false;
    }
    let selectedCode = this.subHeadList.find(
      (x) => x.GLHead == this.OpenChartofAccountForm.get('subHeader').value
    );
    this.GLSubHeadDesc = selectedCode.GLSubHeadDesc;
    console.log('This is sub heaad', this.GLSubHeadDesc);
  }

  submit = () => {
    // this.mainHead = 1;
    // this.subHead = 0;
    // this.details = 0;
    // if(this.mainHead == 1 && this.OpenChartofAccountForm.controls.header.value == ''){
    //   alert('Please Select Header');
    // }
    this.spinner.show();
    let Data = {
      MainHead: this.mainHead,
      SubHead: this.subHead,
      Deatils: this.details,
      GLHead: this.OpenChartofAccountForm.value.header,
      MainHeadValue: this.OpenChartofAccountForm.value.mainHeader,
      SubHeadValue: this.OpenChartofAccountForm.value.subHeader,
      NewMainHead: this.OpenChartofAccountForm.value.newMainHead,
      NewMainSubHead: this.OpenChartofAccountForm.value.newMainSubHead,
      DetailsNo: this.OpenChartofAccountForm.value.newdetails,
      Description: this.OpenChartofAccountForm.value.desc,
      DescriptionBeng: this.OpenChartofAccountForm.value.descBeng,
      TrnMode: this.OpenChartofAccountForm.value.TrnMode,
      ChkOverDraft: this.OpenChartofAccountForm.value.OverDaft,
      ChkMiscAcc: this.OpenChartofAccountForm.value.Msic,
      HeaderDesc: this.GLHeadDesc,
      MainHeaddesc: this.GLMainHeadDesc,
      SubHeadDesc: this.GLSubHeadDesc,
    };
    console.log('This is data', Data);
    this.accountingService
      .SubmitInfo(Data)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.initializeFrom();
          alert('Data Update Successfully');
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
}
