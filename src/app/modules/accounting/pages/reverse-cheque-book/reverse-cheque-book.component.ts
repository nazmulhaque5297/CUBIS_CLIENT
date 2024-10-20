import { select } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { MemberApplicationService } from 'src/app/services/member-application.service';
import { CheckBookModel } from '../../models/member-application.model';
import { AccountingService } from '../../services/accounting.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reverse-cheque-book',
  templateUrl: './reverse-cheque-book.component.html',
  styleUrls: ['./reverse-cheque-book.component.css'],
})
export class ReverseChequeBookComponent implements OnInit {
  ChequeBookReverseForm: FormGroup;
  dataList = [];
  memInfo = [];
  AccNo: CheckBookModel[] = [];
  ChequeGridInfo = [];
  selectedItem = [];
  selectedCode: any = null;
  check: any = null;
  listForDelete: any[] = [];
  gridCheck: boolean;
  constructor(
    private accountingService: AccountingService,
    private applicationService: MemberApplicationService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.ChequeGridInfo = [];
    this.initializeForm();
    this.getAccInfoDataList();
  }

  private initializeForm() {
    this.ChequeBookReverseForm = new FormGroup({
      AccType: new FormControl(''),
      selectedOptionCode: new FormControl('0'),
      MemNo: new FormControl(''),
      AccNo: new FormControl(''),
    });
  }

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

  // Change Select Value

  changeSelectValue = (e) => {
    if(!this.ChequeBookReverseForm.value.AccType) return;
    this.GetAccNo(e.target.value);
    console.log("this is chek", this.check)
    setTimeout(() => {
      if (this.check != 1) {
        this.getCgequeBookGridInfo();
      } else if ((this.check = 1)) {
        alert('Account not found');
        this.gridCheck = false;
        location.reload();
        return;
      } else {
        return;
      }
    }, 100);
    if (e.target.value) {
      console.log("this is log", e.target.value)
      let selectedCode = this.dataList.find(
        (x) => x.AccTypeCode == this.ChequeBookReverseForm.get('AccType').value
      );
      if (selectedCode) {
        this.ChequeBookReverseForm.patchValue({
          selectedOptionCode: selectedCode.AccTypeCode,
        });
     
        this.selectedCode = selectedCode.AccTypeCode;
      } else {
        this.ChequeBookReverseForm.patchValue({
          selectedOptionCode: 0,
          AccType: '',
        });
      }
      console.log(selectedCode);
    }
  };

  // Select handler

  selectChangeHandler(event) {
    this.GetAccNo(event.target.value);
    console.log("this is chek", this.check)
    setTimeout(() => {
      if (this.check != 1) {
        this.getCgequeBookGridInfo();
      } else if ((this.check = 1)) {
        alert('Account not found');
        this.gridCheck = false;
        location.reload();
        return;
      } else {
        return;
      }
    }, 100);

    let ChangeSelectedOption = event.target.value;
    console.log("this is log", ChangeSelectedOption)
    if (ChangeSelectedOption) {
      let selectedCode = this.dataList.find(
        (x) => x.AccTypeCode == ChangeSelectedOption
      );
      if (selectedCode) {
        this.ChequeBookReverseForm.patchValue({
          selectedOptionCode: selectedCode.AccTypeCode,
          AccType: selectedCode.AccType == 0 ? '' : selectedCode.AccTypeCode,
        });
        this.selectedCode = selectedCode.AccTypeCode;

        console.log(selectedCode);
      } else {
        this.ChequeBookReverseForm.patchValue({
          AccType: '',
        });
      }
    }
  }
  // Get Member Info
  GetMemInformation = () => {
    this.spinner.show();
    this.accountingService
      .GetMemInformation(this.ChequeBookReverseForm.value.MemNo)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          console.log('This is response of x', x);
          this.memInfo = x;
          console.log('This is response of meminfo', this.memInfo);
          if (x[0].Message != null) {
            alert(x[0].Message);
            this.ChequeBookReverseForm.controls['MemNo'].setValue('');
          }
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  GetAccNo = (value:any) => {
    let data = {
      AccTypeCode:value,
      MemNo: this.memInfo[0].MemNo,
      MemNum: this.memInfo[0].MemNum,
      MemType: this.memInfo[0].MemType,
    };
    console.log("this is value", value)
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
            this.ChequeBookReverseForm.controls['AccNo'].setValue(x.AccNo);
          } else {
            console.log('This is else');
            this.check = 1;
            console.log('this is check', this.check);
            this.ChequeBookReverseForm.controls['AccNo'].setValue('');
          }
          //}
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  getCgequeBookGridInfo = () => {
    let data = {
      AccTypeCode: this.ChequeBookReverseForm.value.selectedOptionCode,
      MemNum: this.memInfo[0].MemNum,
      MemType: this.memInfo[0].MemType,
    };
    this.spinner.show();
    this.accountingService
      .GetChequeInfoGrid(data)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          console.log('this is response', x);
          this.ChequeGridInfo = x;
          this.gridCheck = true;
          if (this.ChequeGridInfo.length == 0) {
            alert('Cheque Book Not Issued!');
            this.gridCheck = false;
          }
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  addOrDeleteData(item: any) {
    let selectCode = this.listForDelete.find(
      (x) => x.BookCount == item.BookCount
    );
    if (selectCode) {
      this.listForDelete = this.listForDelete.filter(
        (x) => x.BookCount != item.BookCount
      );
    } else {
      this.listForDelete.push(item.BookCount);
    }
  }

  reverseButton() {
    if (this.listForDelete.length > 0) {
      let data = {
        AccNo: this.ChequeBookReverseForm.value.AccNo,
        SelectedValueList: this.listForDelete,
      };
      this.accountingService
        .ReverseData(data)
        .pipe(first())
        .subscribe((x: any) => {
          if (x == 1) {
            alert('data reversed successfully');
            this.ngOnInit();
          } else {
            alert("data didn't reverse.");
          }
        });
    } else {
      alert('please select some data for reverse.');
    }
  }

  // selectedItemList(data: any){
  //   let check = this.selectedItem.find(x => x==data);
  //   if(!check){
  //     this.selectedItem.push(data);
  //     console.log("This is selected data", this.selectedItem)
  //   }
  //   else{
  //     let index = this.selectedItem.indexOf(data);
  //     let temp = [];
  //     var i=0;
  //     while(i<this.selectedItem.length){
  //       if(i!=index){
  //         temp.push(this.selectedItem[i]);
  //       }
  //       i++;
  //     }
  //     this.selectedItem = temp;
  //     console.log(this.selectedItem);
  //     console.log("this is scc",this.AccNo[0].AccNo);
  //   }
  // }
  // updateSelect(){
  //   console.log(this.AccNo);
  // var data:any = {
  //   AccNo: this.AccNo[0].AccNo,
  //   SelectedValueList: this.selectedItem,
  // }
  // console.log(data);
  // }
}
