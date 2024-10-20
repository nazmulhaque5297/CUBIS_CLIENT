import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { IdDescription } from 'src/app/interfaces/id-description';
import { RejectLoanApplicationService } from '../../services/reject-loan-application.service';

@Component({
  selector: 'app-loan-application-reject',
  templateUrl: './loan-application-reject.component.html',
  styleUrls: ['./loan-application-reject.component.css'],
})
export class LoanApplicationRejectComponent implements OnInit {
  editLoanAccountForm: FormGroup;
  LoanCalculationEnum: IdDescription[] = [];
  YesNoEnum: IdDescription[] = [];
  RejectDropDown: IdDescription[] = [];

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private toaster: ToastrService,
    public datepipe: DatePipe,
    private router: Router,
    private rejectLoanAccService: RejectLoanApplicationService
  ) {}

  ngOnInit(): void {
    this.pageLoadData();
    this.initializeForm();
  }

  pageLoadData() {
    this.rejectLoanAccService
      .pageLoadData()
      .pipe(first())
      .subscribe((x: any) => {
        console.log(x);
        this.LoanCalculationEnum = x.LoanCalculationEnum;
        this.YesNoEnum = x.RebatePaidEnum;
        this.RejectDropDown = x.RejectDropdown;
      });
  }

  initializeForm() {
    this.editLoanAccountForm = this.fb.group({
      ApplicationNo: new FormControl(''),
      MemberNo: new FormControl(''),
      AccountType: new FormControl('0'),
      AccTypeDesc: new FormControl(''),
      AccountNo: new FormControl('0'),
      Status: new FormControl(''),
      OpenDate: new FormControl(''),
      LedgerBalance: new FormControl(''),
      SanctionDate: new FormControl(''),
      LoanGraceMonth: new FormControl(''),
      DisbursementDate: new FormControl(''),
      SanctionAmount: new FormControl(''),
      LoanExpiryDate: new FormControl(''),
      DisburesementAmount: new FormControl(''),
      LastTransactionDate: new FormControl(''),
      NoOfInstallment: new FormControl(''),
      InterestRate: new FormControl(''),
      InstallmentAmount: new FormControl(''),
      LoanCalMethod: new FormControl('0'),
      LastInstallmentAmount: new FormControl(''),
      FirstInstallmentDate: new FormControl(''),
      SecondInstallmentDate: new FormControl(''),
      ODPeriod: new FormControl(''),
      LoanSuretyMemberNo: new FormControl(''),
      SuretyMemName: new FormControl(''),
      CorrAccountNo: new FormControl(''),
      AutoTrfCorrAC: new FormControl(false),
      OldAccountNo: new FormControl(''),
      SMSService: new FormControl('0'),
      RebatePaid: new FormControl('1'),
      selectedRejectCode: new FormControl('0'),
      description: new FormControl(''),
    });
  }

  applicationNoChange() {
    this.rejectLoanAccService
      .applicationNoChange(this.editLoanAccountForm.value.ApplicationNo)
      .pipe(first())
      .subscribe((x: any) => {
        console.log(x);
        if (x.Success) {
          this.editLoanAccountForm.controls['MemberNo'].setValue(x.MemberNo);
          this.editLoanAccountForm.controls['AccountType'].setValue(x.AccType);
          this.editLoanAccountForm.controls['AccTypeDesc'].setValue(
            x.AccTypeDesc
          );
          this.editLoanAccountForm.controls['AccountNo'].setValue(x.AccountNo);
          this.editLoanAccountForm.controls['OpenDate'].setValue(x.OpenDate);
          this.editLoanAccountForm.controls['Status'].setValue(x.Stat);
          this.editLoanAccountForm.controls['LedgerBalance'].setValue(
            x.Balance
          );
          this.editLoanAccountForm.controls['SanctionDate'].setValue(
            x.SancDate
          );
          this.editLoanAccountForm.controls['LoanGraceMonth'].setValue(
            x.LoanGrace
          );
          this.editLoanAccountForm.controls['DisbursementDate'].setValue(
            x.DisbDate
          );
          this.editLoanAccountForm.controls['SanctionAmount'].setValue(
            x.SancAmount
          );
          this.editLoanAccountForm.controls['LoanExpiryDate'].setValue(
            x.LoanExpiryDate
          );
          this.editLoanAccountForm.controls['DisburesementAmount'].setValue(
            x.DisbAmount
          );
          this.editLoanAccountForm.controls['LastTransactionDate'].setValue(
            x.LastTrnDate
          );
          this.editLoanAccountForm.controls['NoOfInstallment'].setValue(
            x.NoInstl
          );
          this.editLoanAccountForm.controls['InterestRate'].setValue(x.IntRate);
          this.editLoanAccountForm.controls['InstallmentAmount'].setValue(
            x.InstlAmount
          );
          this.editLoanAccountForm.controls['LoanCalMethod'].setValue(
            x.LoanCalMethod
          );
          this.editLoanAccountForm.controls['LastInstallmentAmount'].setValue(
            x.LastInstlAmount
          );
          this.editLoanAccountForm.controls['FirstInstallmentDate'].setValue(
            x.FirstInstlDate
          );
          this.editLoanAccountForm.controls['SecondInstallmentDate'].setValue(
            x.SecondInstlDate
          );
          this.editLoanAccountForm.controls['ODPeriod'].setValue(x.Period);
          this.editLoanAccountForm.controls['LoanSuretyMemberNo'].setValue(
            x.SuretyMemNumber
          );
          this.editLoanAccountForm.controls['SuretyMemName'].setValue(
            x.SuretyMemName
          );
          this.editLoanAccountForm.controls['CorrAccountNo'].setValue(
            x.CorrAccNo
          );
          this.editLoanAccountForm.controls['AutoTrfCorrAC'].setValue(
            x.AutoTrf
          );
          this.editLoanAccountForm.controls['OldAccountNo'].setValue(
            x.OldAccountNo
          );
          this.editLoanAccountForm.controls['SMSService'].setValue(
            x.SMSService
          );
          this.editLoanAccountForm.controls['RebatePaid'].setValue(
            x.RebateService
          );

          document.getElementById(`selectedRejectCode`).focus();
        } else {
          alert(x.Message);
          this.editLoanAccountForm.controls['ApplicationNo'].setValue('');
        }
      });
  }

  onRejectCodeChange() {
    document.getElementById(`description`).focus();
  }
  onDescriptionEnterPassHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`btnReject`).focus();
  }

  rejectLoanAccount() {
    if (this.editLoanAccountForm.value.selectedRejectCode != 0) {
      let data = {
        NoteNo: this.editLoanAccountForm.value.selectedRejectCode,
        NoteDesc: this.editLoanAccountForm.value.description,
        LoanApplicationNo: this.editLoanAccountForm.value.ApplicationNo,
      };
      this.rejectLoanAccService
        .rejectAccount(data)
        .pipe(first())
        .subscribe((x: any) => {
          if (x == 1) {
            alert('loan account rejected successfully.');
            this.ngOnInit();
          } else {
            alert("Something went wrong, loan account didn't rejected.");
          }
        });
    } else {
      alert('Please select loan reject note type.');
    }
  }

  exitPage() {
    this.router.navigate(['accounting/']);
  }
}
