import { IdDescription } from 'src/app/interfaces/id-description';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { AccountingService } from './../../services/accounting.service';
import { formatDate } from '@angular/common';
import { MemberStatusModel } from '../../models/member-application.model';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-member-status-change',
  templateUrl: './member-status-change.component.html',
  styleUrls: ['./member-status-change.component.css'],
})
export class MemberStatusChangeComponent implements OnInit {
  MemberStatusChangeForm: FormGroup;
  updateButtonText: string = 'Update';
  MemNo: string = '';
  MemType: string = '';
  memStatusList: MemberStatusModel[];
  MemInfoList = [];
  warningValue: number;

  constructor(
    private AccountingService: AccountingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getMemberTypeList();
    this.initializeForm();
  }

  private initializeForm() {
    this.MemberStatusChangeForm = new FormGroup({
      MemberNo: new FormControl(''),
      Since: new FormControl(''),
      CurrentStatus: new FormControl(''),
      SelectedChangeStatus: new FormControl('0'),
      StatusDate: new FormControl(''),
    });
  }

  getMemberTypeList = () => {
    this.spinner.show();
    this.AccountingService.getMemberTypeListInfo()
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.memStatusList = x.IdDescription;
          this.MemberStatusChangeForm.controls['StatusDate'].setValue(
            x.StatusDate
          );
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  changeMemberInfoHandler = (e) => {
    const format = 'dd/MM/yyyy';
    const locale = 'en-US';
    this.MemNo = e.target.value;
    this.spinner.show();
    this.AccountingService.GetMemberInformation(Number(this.MemNo))
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          if (x.ID == 0) {
            alert('Member Not Found!');
            this.MemberStatusChangeForm.controls['MemberNo'].setValue('');
            return;
          } else {
            this.MemInfoList = x;
            this.MemType = x.MemType;
            let status = this.memStatusList.find((i) => i.Id == x.MemStatus);
            this.warningValue = status.Id;
            this.MemberStatusChangeForm.patchValue({
              CurrentStatus: status.Description,
              Since: formatDate(x.MemStatusDt, format, locale),
            });
          }
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  UpdateMemberStatus = () => {
    if (!this.MemNo) {
      alert('Member Id Not Found!');
    }
    this.spinner.show();
    let FormData = this.MemberStatusChangeForm.value;
    let StatusFormData = {
      MemStatus: FormData.SelectedChangeStatus,
      MemStatusDt: FormData.StatusDate,
      MemNo: this.MemNo,
      MemType: this.MemType,
    };
    this.AccountingService.UpdateMemberStatus(StatusFormData)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.initializeForm();
          this.MemInfoList = [];
          this.spinner.hide();
          alert('Status Updated !');
          this.ngOnInit();
        },
        (err) => {
          this.spinner.hide();
          alert(err);
        }
      );
  };
  statusChangeValidation = () => {
    if (
      this.MemberStatusChangeForm.value.SelectedChangeStatus ==
      this.warningValue
    ) {
      alert('Invalid Status Select');
      this.MemberStatusChangeForm.controls['SelectedChangeStatus'].setValue(
        '0'
      );
    }
  };
}
