import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { MemberApplicationService } from 'src/app/services/member-application.service';
import { MemberApplicationInputHelp } from '../../models/member-application.model';
import { AccountingService } from '../../services/accounting.service';

@Component({
  selector: 'app-counter-cheque-book',
  templateUrl: './counter-cheque-book.component.html',
  styleUrls: ['./counter-cheque-book.component.css'],
})
export class CounterChequeBookComponent implements OnInit {
  // ChequeCounterForm: FormGroup;
  // private destroy$: Subject<void> = new Subject<void>();
  // chequeDetails = [];
  // displayTabularData: boolean = false;
  // public inputHelpData: MemberApplicationInputHelp =
  //   new MemberApplicationInputHelp();
  
  constructor(
    private accountingService: AccountingService,
    private applicationService: MemberApplicationService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    // this.initializeForm();
    // this.applicationService
    //   .getInputHelp()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((data) => {
    //     this.inputHelpData = data;
    //     console.log('This is application date');
    //     console.log('This is InputData', this.inputHelpData);
    //     this.ChequeCounterForm.controls['ChqBIssDt'].setValue(
    //       data.ApplicationDate
    //     );
    //     this.spinner.hide();
    //   });
    // this.getChequeBookDetails();
  }

  // private initializeForm() {
  //   this.ChequeCounterForm = new FormGroup({
  //     ChqeFx: new FormControl(''),
  //     ChqbPage: new FormControl('0'),
  //     BeginNo: new FormControl('0'),
  //     EndNo: new FormControl('0'),
  //     ChqBIssDt: new FormControl(''),
  //   });
  // }

  // getDefaultDate() {
  //   this.applicationService
  //     .getInputHelp()
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((data) => {
  //       this.inputHelpData = data;
  //       console.log('This is application date');
  //       console.log('This is InputData', this.inputHelpData);
  //       this.ChequeCounterForm.controls['ChqBIssDt'].setValue(
  //         data.ApplicationDate
  //       );
  //       this.spinner.hide();
  //     });
  // }

  // getChequeBookDetails = () => {
  //   this.spinner.show();
  //   this.accountingService
  //     .GetChequeBookDetails()
  //     .pipe(first())
  //     .subscribe(
  //       (x: any[]) => {
  //         this.chequeDetails = x;
  //         console.log('This is chequebook information', this.chequeDetails);
  //         this.spinner.hide();
  //       },
  //       (err) => {
  //         this.spinner.hide();
  //       }
  //     );
  // };

  // public getTableReportData() {
  //   this.displayTabularData = true;
  // }

  // insertDetails = () => {
  //   this.spinner.show();
  //   var formValue = this.ChequeCounterForm.value;
  //   console.log('this is form value', formValue);
  //   this.accountingService
  //     .InsertChequeBookDetails(formValue)
  //     .pipe(first())
  //     .subscribe(
  //       (x: any) => {
  //         console.log("This is x",x);
  //         this.ngOnInit();
  //         this.getChequeBookDetails();
  //         this.spinner.hide();
  //       },
  //       (err) => {
  //         this.spinner.hide();
  //       }
  //     );
  // };
}
