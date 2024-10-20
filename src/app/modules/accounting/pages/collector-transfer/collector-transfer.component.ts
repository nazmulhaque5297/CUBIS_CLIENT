import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { from } from 'rxjs';
import { first } from 'rxjs/operators';
import { AccountingService } from '../../services/accounting.service';

@Component({
  selector: 'app-collector-transfer',
  templateUrl: './collector-transfer.component.html',
  styleUrls: ['./collector-transfer.component.css'],
})
export class CollectorTransferComponent implements OnInit {
  CollectorTransferForm: FormGroup;
  fromCollectorCode: any[] = [];
  fromGroupName: any[] = [];
  toCollectorCode: any[] = [];
  toGroupName: any[] = [];
  constructor(
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private router: Router,
    private accService: AccountingService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.CollectorTransferForm = new FormGroup({
      FromCollectorCode: new FormControl('0'),
      FromGroupCode: new FormControl('0'),
      ToCollectorCode: new FormControl('0'),
      ToGroupCode: new FormControl('0'),
    });
    this.pageLoad();
  }

  async pageLoad() {
    this.spinner.show();
    await this.accService
      .CollectorTransferPageLoad()
      .pipe(first())
      .toPromise()
      .then(
        (x: any) => {
          console.log(x);
          this.fromCollectorCode = x.FromCollectorList;
          this.toCollectorCode = x.ToCollectorList;
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
          console.log(err);
        }
      );
  }

  fromCollectorDrop(event: any) {
    this.CollectorTransferForm.controls['FromCollectorCode'].setValue(
      event.target.value
    );
    this.fromCollectorChange();
  }

  fromGroupDrop(event: any) {
    this.CollectorTransferForm.controls['FromGroupCode'].setValue(
      event.target.value
    );
    this.fromGroupNameChange();
  }

  toCollectorDrop(event: any) {
    this.CollectorTransferForm.controls['ToCollectorCode'].setValue(
      event.target.value
    );
    this.toCollectorChange();
  }

  toGroupDrop(event: any) {
    this.CollectorTransferForm.controls['ToGroupCode'].setValue(
      event.target.value
    );
    this.toGroupNameChange();
  }

  fromCollectorChange() {
    if (this.CollectorTransferForm.value.FromCollectorCode == '0') return;
    let selectedCode = this.fromCollectorCode.find(
      (x) => x.Id == this.CollectorTransferForm.value.FromCollectorCode
    );
    if (!selectedCode) {
      this.toaster.error('Please enter a valid From Collector Code');
      return;
    }
    this.CollectorTransferForm.controls['FromCollectorCode'].setValue(
      this.CollectorTransferForm.value.FromCollectorCode
    );
    this.accService
      .FromCollectorChangeData(
        this.CollectorTransferForm.value.FromCollectorCode
      )
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.fromGroupName = x;
        },
        (err) => {
          this.spinner.hide();
          console.log(err);
        }
      );
    document.getElementById(`FromGroupCode`).focus();
  }

  toCollectorChange() {
    if (this.CollectorTransferForm.value.ToCollectorCode == '0') return;
    let selectedCode = this.toCollectorCode.find(
      (x) => x.Id == this.CollectorTransferForm.value.ToCollectorCode
    );
    if (!selectedCode) {
      this.toaster.error('Please enter a valid To Collector Code');
      return;
    }
    this.CollectorTransferForm.controls['ToCollectorCode'].setValue(
      this.CollectorTransferForm.value.ToCollectorCode
    );
    this.accService
      .ToCollectorChangeData()
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.toGroupName = x;
        },
        (err) => {
          this.spinner.hide();
          console.log(err);
        }
      );
    document.getElementById(`ToGroupCode`).focus();
  }

  fromGroupNameChange() {
    if (this.CollectorTransferForm.value.FromGroupCode == '0') return;
    let selectedCode = this.fromCollectorCode.find(
      (x) => x.Id == this.CollectorTransferForm.value.FromGroupCode
    );
    if (!selectedCode) {
      this.toaster.error('Please enter a valid From Group Name');
      return;
    }
    this.CollectorTransferForm.controls['FromGroupCode'].setValue(
      this.CollectorTransferForm.value.FromGroupCode
    );
    document.getElementById(`ToCollectorCode`).focus();
  }

  toGroupNameChange() {
    if (this.CollectorTransferForm.value.ToGroupCode == '0') return;
    let selectedCode = this.toGroupName.find(
      (x) => x.Id == this.CollectorTransferForm.value.ToGroupCode
    );
    if (!selectedCode) {
      this.toaster.error('Please enter a valid To Group Name');
      return;
    }
    this.CollectorTransferForm.controls['ToGroupCode'].setValue(
      this.CollectorTransferForm.value.ToGroupCode
    );
  }

  btnTransferClick() {
    var formValue = this.CollectorTransferForm.value;
    if (
      formValue.FromCollectorCode == '0' ||
      formValue.ToCollectorCode == '0' ||
      formValue.FromGroupCode == '0' ||
      formValue.ToGroupCode == '0'
    ) {
      alert('Please enter all the required fileds!');
      return;
    }
    this.spinner.show();
    this.accService
      .CollectorTransfer(formValue)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          if (!x.Success) {
            alert(x.Message);
            return;
          }
          alert(x.Message);
          this.initializeForm();
        },
        (err) => {
          this.spinner.hide();
          console.log(err);
        }
      );
  }

  exitPage() {
    this.router.navigate(['accounting/']);
  }
}
