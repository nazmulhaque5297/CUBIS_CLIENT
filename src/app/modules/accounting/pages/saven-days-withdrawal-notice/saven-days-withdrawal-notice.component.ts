import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IApplicationCommonModel } from 'src/app/Models/Common.model';
import { AllMemberInformationComponent } from 'src/app/pages/public/all-member-information/all-member-information.component';
import { getCommonData } from 'src/app/selector/user.selectors';
import { SevenDaysWithdrwalNoticeService } from 'src/app/services/seven-days-withdrawal-notice.service';

@Component({
  selector: 'app-saven-days-withdrawal-notice',
  templateUrl: './saven-days-withdrawal-notice.component.html',
  styleUrls: ['./saven-days-withdrawal-notice.component.css'],
})
export class SavenDaysWithdrawalNoticeComponent implements OnInit {
  SevenDaysWithdrawalForm: FormGroup;
  commonData: IApplicationCommonModel;
  MemberData: any = {};
  CurrentAccount: any = {};
  CurrentNotice: any = {};
  AccList: any = [];
  NoticeList: any = [];
  ShowNoticeMessage: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private store: Store,
    private spinner: NgxSpinnerService,
    private pService: SevenDaysWithdrwalNoticeService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.store
      .pipe(select(getCommonData))
      .subscribe((cData: IApplicationCommonModel) => {
        this.commonData = cData;
        this.SevenDaysWithdrawalForm.controls['NoticeDate'].setValue(
          this.commonData?.ProcessDate
        );
        this.SevenDaysWithdrawalForm.controls['WithdrawalDate'].setValue(
          this.commonData?.ProcessDate
        );
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm() {
    this.SevenDaysWithdrawalForm = new FormGroup({
      MemberNo: new FormControl(''),
      WithdrawalAmount: new FormControl(''),
      NoticeDate: new FormControl(''),
      WithdrawalDate: new FormControl(''),
      Note: new FormControl(''),
      NoticeStatus: new FormControl(''),
      StatusDate: new FormControl(''),
    });
  }

  // enter key events
  onEnterWithdrawalAmountHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`Note`).focus();
  }

  validate(flag: number, data: any) {
    if (flag == 1) {
      if (data.nFlag == 1 || data.nFlag == 2) {
        if (this.CurrentNotice.NTCStatus == '3') {
          alert('Notice Already Calcelled');
          return false;
        }
      }
      if (!this.SevenDaysWithdrawalForm.value.MemberNo) {
        alert('Input Member No');
        return false;
      }
      if (!data.AccNo) {
        alert('Select Account');
        return false;
      }
    }

    return true;
  }
  MemberHandler() {
    this.spinner.show();
    this.pService
      .GetMemNo(+this.SevenDaysWithdrawalForm.value.MemberNo)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.MemberData = data;
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
          alert(err);
        }
      );
    document.getElementById(`WithdrawalAmount`).focus();
  }
  SubmitHandler() {
    if (!this.SevenDaysWithdrawalForm.value.MemberNo) {
      alert('Input Member No.');
      return;
    }
    this.spinner.show();
    this.pService
      .GetAccList(+this.SevenDaysWithdrawalForm.value.MemberNo)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.AccList = data;
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
          alert(err);
        }
      );
  }

  checkHandler(item) {
    this.CurrentAccount = item;
    this.AccList?.map((e, i) => {
      if (e.Id == item.Id) {
        e['CheckMark'] = e.CheckMark ? false : true;
      } else {
        e['CheckMark'] = false;
      }
    });
    if (!item.CheckMark) {
      this.NoticeList = [];
      this.ShowNoticeMessage = true;
      return;
    }
    this.spinner.show();
    this.pService
      .GetNoticeList(+item.AccNo)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.NoticeList = data;
          this.NoticeList?.length > 0
            ? (this.ShowNoticeMessage = false)
            : (this.ShowNoticeMessage = true);
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
          alert(err);
        }
      );
  }

  convertDateToString(str) {
    var date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join('/');
  }

  SetNoticeData() {
    let data: any = {};
    data.AccNo = this.CurrentAccount?.AccNo;
    data.AccType = this.CurrentAccount?.AccType;
    data.MemNo = this.CurrentAccount?.MemNo;
    data.NTCDrAmount = this.SevenDaysWithdrawalForm.value.WithdrawalAmount;

    data.NTCDate =
      typeof this.SevenDaysWithdrawalForm.value.NoticeDate == 'string'
        ? this.SevenDaysWithdrawalForm.value.NoticeDate
        : this.convertDateToString(
            this.SevenDaysWithdrawalForm.value.NoticeDate
          );

    data.NTCDrDate =
      typeof this.SevenDaysWithdrawalForm.value.WithdrawalDate == 'string'
        ? this.SevenDaysWithdrawalForm.value.WithdrawalDate
        : this.convertDateToString(
            this.SevenDaysWithdrawalForm.value.WithdrawalDate
          );

    data.NTCNote = this.SevenDaysWithdrawalForm.value.Note;
    return data;
  }

  AddEditCancelNotice(flag: number) {
    var data = this.SetNoticeData();
    data.nFlag = flag;
    if (flag != 0) data.Id = this.CurrentNotice.Id ?? null;

    if (!this.validate(1, data)) return;
    if (
      confirm(
        `Are you sure you want to ${
          data.nFlag == 0 ? 'Add' : data.nFlag == 1 ? 'Edit' : 'Cancel'
        } Notice?`
      )
    ) {
      this.spinner.show();
      this.pService
        .AddUpdateNotice(data)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (data) => {
            this.spinner.hide();
            alert('Savings Parameter Update Successfully.');
            setTimeout(() => {
              location.reload();
            }, 1000);
          },
          (err) => {
            this.spinner.hide();
            alert(err);
          }
        );
    }
  }

  OnEdit(item: any) {
    this.CurrentNotice = item;
    this.SevenDaysWithdrawalForm.patchValue({
      WithdrawalAmount: item.NoticeAmount,
      WithdrawalDate: item.WithdrawalDate,
      NoticeDate: item.NoticeDate,
      Note: item.Note,
      NoticeStatus: item.Status,
      StatusDate: item.StatusDate,
    });
  }

  // show all member info
  showAllMember() {
    const modalRef = this.modalService.open(AllMemberInformationComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.result.then((data) => {
      if (data != 0) {
        this.SevenDaysWithdrawalForm.controls['MemberNo'].setValue(data);
        this.MemberHandler();
      }
    });
  }
}
