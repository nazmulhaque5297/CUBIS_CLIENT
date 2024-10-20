import { select } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { AccountingService } from '../../services/accounting.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-booth-gl-code-control-maintenance',
  templateUrl: './booth-gl-code-control-maintenance.component.html',
  styleUrls: ['./booth-gl-code-control-maintenance.component.css'],
})
export class BoothGlCodeControlMaintenanceComponent implements OnInit {
  boothGlCodeForm: FormGroup;
  dataList = [];
  selectedList = [];
  constructor(
    private accountingService: AccountingService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.GetAllInfo();
    this.GetSelectedItems();
  }

  private initializeForm() {
    this.boothGlCodeForm = new FormGroup({});
  }

  changeCheck(num: any) {
    if (this.dataList[num].selected == true) {
      this.dataList[num].selected = false;
    } else {
      this.dataList[num].selected = true;
    }
    console.log(this.dataList);
  }

  //Get All Data
  GetAllInfo = () => {
    this.spinner.show();
    this.accountingService
      .GetAllData()
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

  // Get Selected Items
  GetSelectedItems = () => {
    this.spinner.show();
    this.accountingService
      .GetSelectedItems()
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.selectedList = x;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  // Submit Data

  SubmitData = () => {
    this.spinner.show();
    var data = this.dataList;
    this.accountingService
      .Submit(data)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.toaster.success('Data Updated Successfully.', 'Success');
          this.ngOnInit();
        },
        (err) => {
          this.spinner.hide();
          this.toaster.error('Something Went Wrong', 'Error');
        }
      );
  };
}
