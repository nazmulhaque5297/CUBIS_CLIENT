import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { AccountingService } from '../../services/accounting.service';

@Component({
  selector: 'app-verify-member-signature-card',
  templateUrl: './verify-member-signature-card.component.html',
  styleUrls: ['./verify-member-signature-card.component.css'],
})
export class VerifyMemberSignatureCardComponent implements OnInit {
  VerifyMemberSignatureCardForm: FormGroup;
  memInfo = [];
  url: any;
  msg = '';
  fileToUpload: any;
  showUpdate: boolean = false;
  fileHere: boolean = false;
  accountType = [];
  showOld: boolean = false;

  constructor(
    private accountingService: AccountingService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.url = '';
    this.memInfo = [];
    this.msg = '';
    this.showUpdate = false;
    this.fileHere = false;
    this.showOld = false;
  }
  private initializeForm() {
    this.VerifyMemberSignatureCardForm = new FormGroup({
      MemNo: new FormControl(''),
      OldAccountNo: new FormControl(''),
      AccountType: new FormControl('0'),
    });
    this.pageLoad();
  }

  pageLoad() {
    this.accountingService
      .VerifyMemSignaturePageLoad()
      .pipe(first())
      .subscribe((x: any) => {
        console.log(x);
        this.accountType = x;
      });
  }

  // enter key events

  onEnterAccountTypeHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`OldAccountNo`).focus();
  }

  onEnterOldAccountNoHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`MemNo`).focus();
  }

  accTypeChange() {
    let selectedCode = this.accountType.find(
      (x) => x.Id == this.VerifyMemberSignatureCardForm.value.AccountType
    );
    if (selectedCode) {
      this.VerifyMemberSignatureCardForm.controls['AccountType'].setValue(
        selectedCode.Id
      );
    } else {
      alert('Invalid account type.');
    }
    document.getElementById(`OldAccountNo`).focus();
  }

  oldAccNoChange() {
    this.accountingService
      .VerifyMemSignatureOldAcc(
        this.VerifyMemberSignatureCardForm.value.OldAccountNo,
        this.VerifyMemberSignatureCardForm.value.AccountType
      )
      .pipe(first())
      .subscribe((x: any) => {
        if (x) {
          this.VerifyMemberSignatureCardForm.controls['MemNo'].setValue(
            x.MemNo
          );
          this.showOld = true;
          this.GetMemInformation();
        } else {
          alert('Invalid Old Account No.');
          this.VerifyMemberSignatureCardForm.controls['OldAccountNo'].setValue(
            ''
          );
        }
      });
  }
  // Get Member Info
  GetMemInformation = () => {
    this.spinner.show();
    this.accountingService
      .GetMemInformation(this.VerifyMemberSignatureCardForm.value.MemNo)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          console.log('This is response of x', x);
          this.memInfo = x;
          console.log('This is response of meminfo', this.memInfo);
          if (x[0].Message != null) {
            alert(x[0].Message);
            this.VerifyMemberSignatureCardForm.controls['MemNo'].setValue('');
          } else {
            this.accountingService
              .GetMemberImages(
                this.VerifyMemberSignatureCardForm.value.MemNo,
                this.memInfo[0].MemType
              )
              .pipe(first())
              .subscribe((x: any) => {
                console.log(x);
                if (x) {
                  if (x.ImageCard != null) {
                    console.log(x);
                    this.url = x.ImageCard;
                    this.showUpdate = true;
                  } else {
                    this.url = '';
                  }
                } else {
                  this.url = '';
                }
              });
          }
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  exitPage() {
    this.router.navigate(['accounting/']);
  }
}
