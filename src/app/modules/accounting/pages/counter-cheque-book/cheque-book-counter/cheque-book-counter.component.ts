import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { MemberApplicationService } from 'src/app/services/member-application.service';
import { MemberApplicationInputHelp } from '../../../models/member-application.model';
import { AccountingService } from '../../../services/accounting.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cheque-book-counter',
  templateUrl: './cheque-book-counter.component.html',
  styleUrls: ['./cheque-book-counter.component.css'],
})
export class ChequeBookCounterComponent implements OnInit {
  showHide: boolean = true;
  showDiv: boolean = false;
  ChequeCounterForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  chequeDetails = [];
  displayTabularData: boolean = false;
  public inputHelpData: MemberApplicationInputHelp =
    new MemberApplicationInputHelp();

  constructor(
    private accountingService: AccountingService,
    private applicationService: MemberApplicationService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) // public activeModal: NgbActiveModal,
  {}

  ngOnInit(): void {
    this.initializeForm();
    this.showHide = this.accountingService.showHideDiv;
    this.showDiv = this.accountingService.showDiv;
    this.applicationService
      .getInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        console.log('This is application date');
        console.log('This is InputData', this.inputHelpData);
        this.ChequeCounterForm.controls['ChqBIssDt'].setValue(
          data.ApplicationDate
        );
        this.spinner.hide();
      });
    this.getChequeBookDetails();
  }
  private initializeForm() {
    this.ChequeCounterForm = new FormGroup({
      ChqeFx: new FormControl(''),
      ChqbPage: new FormControl(''),
      BeginNo: new FormControl(''),
      EndNo: new FormControl(''),
      ChqBIssDt: new FormControl(''),
    });
  }

  onEnterChqeFxHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`ChqbPage`).focus();
  }

  onEnterChqbPageHandler(e: KeyboardEvent) {
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

  getChequeBookDetails = () => {
    this.spinner.show();
    this.accountingService
      .GetChequeBookDetails()
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.chequeDetails = x;
          console.log('This is chequebook information', this.chequeDetails);
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  public getTableReportData() {
    this.displayTabularData = true;
  }

  begNoChanged = () => {
    let formValue = {
      ChqeFx: this.ChequeCounterForm.value.ChqeFx,
      ChqbPage: this.ChequeCounterForm.value.ChqbPage,
      BeginNo: this.ChequeCounterForm.value.BeginNo,
    };
    console.log('This is form value', formValue);
    this.spinner.show();
    this.accountingService
      .BegNoChanged(formValue)
      .pipe(first())
      .subscribe(
        (x: any) => {
          console.log('This is x', x);
          this.ChequeCounterForm.controls['EndNo'].setValue(x.EndNo);
          if (x.Msg != null) {
            this.toastr.error(x.Msg);
            this.ChequeCounterForm.controls['BeginNo'].setValue('');
            this.ChequeCounterForm.controls['ChqeFx'].setValue('');
            this.ChequeCounterForm.controls['ChqbPage'].setValue('');
          }
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  dateChanged() {
    this.accountingService
      .DateChanged(this.ChequeCounterForm.value.ChqBIssDt)
      .pipe(first())
      .subscribe(
        (x: any) => {
          console.log('This is x', x);
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }

  insertDetails = () => {
    this.spinner.show();
    var formValue = this.ChequeCounterForm.value;
    console.log('this is form value', formValue);
    this.accountingService
      .InsertChequeBookDetails(formValue)
      .pipe(first())
      .subscribe(
        (x: any) => {
          console.log('This is x', x);
          this.ngOnInit();
          this.getChequeBookDetails();
          this.spinner.hide();
          location.reload();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
}
