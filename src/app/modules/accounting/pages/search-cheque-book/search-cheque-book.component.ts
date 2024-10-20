import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { AccountingService } from '../../services/accounting.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-search-cheque-book',
  templateUrl: './search-cheque-book.component.html',
  styleUrls: ['./search-cheque-book.component.css'],
})
export class SearchChequeBookComponent implements OnInit {
  SearchChequeNumber: FormGroup;
  info = [];

  constructor(
    private spinner: NgxSpinnerService,
    private accountingService: AccountingService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }
  private initializeForm() {
    this.SearchChequeNumber = new FormGroup({
      Chequefx: new FormControl(''),
      ChequeNo: new FormControl(''),
      MemNo: new FormControl(''),
      MemName: new FormControl(''),
      AccNo: new FormControl(''),
      AccType: new FormControl(''),
      ChqSt: new FormControl(''),
      Chqdt: new FormControl(''),
    });
  }

  // enter key events

  onEnterChequefxHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`ChequeNo`).focus();
  }

  GetChequeInformation = () => {
    let data = {
      Chqfx: this.SearchChequeNumber.value.Chequefx,
      ChqSlNo: this.SearchChequeNumber.value.ChequeNo,
    };
    this.spinner.show();
    this.accountingService
      .GetChequeDetails(data)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          console.log('This is response of x', x);
          this.info = x;
          if (x.length == 0) {
            this.spinner.hide();
            alert('Cheque Not Found!');
            this.SearchChequeNumber.controls['Chequefx'].setValue('');
            this.SearchChequeNumber.controls['ChequeNo'].setValue('');
          }
          this.SearchChequeNumber.controls['MemNo'].setValue(x[0].MemNo);
          this.SearchChequeNumber.controls['MemName'].setValue(x[0].MemName);
          this.SearchChequeNumber.controls['AccNo'].setValue(x[0].AccNo);
          this.SearchChequeNumber.controls['AccType'].setValue(x[0].AccTitle);
          this.SearchChequeNumber.controls['ChqSt'].setValue(x[0].ChqPStatDesc);
          this.SearchChequeNumber.controls['Chqdt'].setValue(x[0].ChqPDt);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  // Keypress event that only accept number not string

  keyPress(event: any) {
    const pattern = /[0-9\, ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
