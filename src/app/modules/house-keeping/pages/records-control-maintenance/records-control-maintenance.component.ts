import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { HouseKeepingService } from '../../house-keeping.service';

@Component({
  selector: 'app-records-control-maintenance',
  templateUrl: './records-control-maintenance.component.html',
  styleUrls: ['./records-control-maintenance.component.css'],
})
export class RecordsControlMaintenanceComponent implements OnInit {
  glcashcodelist = [];
  dataList = [];
  displayTabularData: boolean = false;
  RecordsControlForm: FormGroup;
  selectedCode: any = null;
  selectedRec: any = null;
  toastr: any;
  constructor(
    private houseKeepingService: HouseKeepingService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getAllInformation();
    this.GetGLCashCodeList();
    this.initializeForm();
  }

  private initializeForm() {
    this.RecordsControlForm = new FormGroup({
      GLCashCode: new FormControl(''),
      selectedOptionCode: new FormControl('0'),
      RecType: new FormControl(''),
      RecLastNo: new FormControl(''),
    });
  }

  GetGLCashCodeList = () => {
    this.spinner.show();
    this.houseKeepingService
      .GetGLCashCodeList('UserMaintenance')
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.glcashcodelist = x;
          console.log(this.glcashcodelist);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  // Get All information
  getAllInformation = () => {
    this.spinner.show();
    this.houseKeepingService
      .GetAllInformation()
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.spinner.hide();
          this.dataList = x;
          console.log('GetAllInformation:', this.dataList);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  public getAllData() {
    this.displayTabularData = true;
  }

  // GL Cash Code Chnage Handler
  changeSelectValue = (e) => {
    if (e.target.value) {
      let selectedCode = this.glcashcodelist.find(
        (x) => x.Id == this.RecordsControlForm.get('GLCashCode').value
      );
      if (selectedCode) {
        this.RecordsControlForm.patchValue({
          selectedOptionCode: selectedCode.Id,
        });
        this.selectedCode = selectedCode.Id;
        // } else {
        //   this.RecordsControlForm.patchValue({
        //     selectedOptionCode: 0,
        //     GLCashCode: '',
        //   });
      }
      console.log(selectedCode);
    }
    document.getElementById(`RecType`).focus();
  };

  selectChangeHandler(event: any) {
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.glcashcodelist.find(
        (x) => x.Id == ChangeSelectedOption
      );
      this.RecordsControlForm.patchValue({
        selectedOptionCode: selectedCode.Id,
        GLCashCode: selectedCode.Id,
      });
      this.selectedCode = selectedCode.Id;
      console.log(selectedCode);
    }
    document.getElementById(`RecType`).focus();
  }

  // Record Type focusout event
  changeRecordValue = (e) => {
    if (e.target.value) {
      console.log('TargetValue:', e.target.value);
      let selectedCode = this.dataList.find(
        (x) => x.RecType == this.RecordsControlForm.get('RecType').value
      );
      console.log('SelectedCode:', selectedCode);
      if (selectedCode) {
        this.RecordsControlForm.patchValue({
          RecLastNo: selectedCode.RecLastNo,
          GLCashCode: selectedCode.GLCashCode,
        });
        this.selectedCode = selectedCode.RecType;
      } else {
        //this.toastr.console.warning("Record Type is invallid!");
        this.RecordsControlForm.controls['RecLastNo'].setValue('');
        return;
        //this.initializeForm();
      }
      console.log('selectedCode:', selectedCode);
    }
    document.getElementById(`RecLastNo`).focus();
  };

  //Insert Data
  InsertData = () => {
    if (
      this.RecordsControlForm.value.GLCashCode == '' ||
      this.RecordsControlForm.value.RecLastNo == ''
    ) {
      alert('Please Fillup The Required Field!');
      return;
    } else {
      if (confirm('Are you sure you want to save information?')) {
        this.spinner.show();
        var formValue = this.RecordsControlForm.value;
        this.houseKeepingService
          .InsertRecordControl(formValue)
          .pipe(first())
          .subscribe(
            (x: any[]) => {
              this.getAllInformation();
              this.initializeForm();
              this.spinner.hide();
              alert('Information Inserted !');
            },
            (err) => {
              this.spinner.hide();
              this.toastr.error('Something Went Wrong !', 'Error');
            }
          );
      }
    }
  };

  //Update Data
  UpdateData = () => {
    if (
      this.RecordsControlForm.value.GLCashCode == '' ||
      this.RecordsControlForm.value.RecLastNo == ''
    ) {
      alert('Please Fillup The Required Field!');
      return;
    }
    if (confirm('Are you sure you want to Update information?')) {
      this.spinner.show();
      var formValue = this.RecordsControlForm.value;
      this.houseKeepingService
        .UpdateRecordControl(formValue)
        .pipe(first())
        .subscribe(
          (x: any[]) => {
            this.getAllInformation();
            this.initializeForm();
            this.spinner.hide();
            alert('Information Updated !');
          },
          (err) => {
            this.spinner.hide();
            this.toastr.error('Something Went Wrong !', 'Error');
          }
        );
    }
  };
}
