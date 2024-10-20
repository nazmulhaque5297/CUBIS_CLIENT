import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { first, takeUntil } from 'rxjs/operators';
import { HouseKeepingService } from '../../house-keeping.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  FieldsSetupCode,
  FieldsSetupCode2,
} from '../../../Models/HoseKeepingModel';
import { updateFieldsSetupDescriptionBody } from '../professional-code/viewmodel/IfieldsetupDescription';
import {
  FieldsSetupMainInputHelp,
  FieldsSetupMainViewModel,
  FieldsSetupDetailsCode,
} from 'src/app/interfaces/fields-setup-maintenance';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FieldsSetupMainService } from 'src/app/services/fields-setup-maintenance.service';

@Component({
  selector: 'app-fields-setup-maintenance',
  templateUrl: './fields-setup-maintenance.component.html',
  styleUrls: ['./fields-setup-maintenance.component.css'],
})
export class FieldsSetupMaintenanceComponent implements OnInit {
  dataList: FieldsSetupCode[] = [];

  submitButtonText: string = 'Submit';
  submitButtonState: boolean = false;
  displayTabularData: boolean = false;
  selectedCode: any = null;

  FieldsSetupMaintenanceForm: FormGroup;

  FieldsSetupMaintenanceFormBody: updateFieldsSetupDescriptionBody;

  private destroy$: Subject<void> = new Subject<void>();
  public inputHelpData: FieldsSetupMainInputHelp = new FieldsSetupMainInputHelp();
  public detailsData: FieldsSetupMainViewModel = new FieldsSetupMainViewModel();
  CodeList: FieldsSetupCode2[] = [];
  public CodeDetailsList: FieldsSetupDetailsCode = new FieldsSetupDetailsCode();

  constructor(
    private fieldsSetupMainService: FieldsSetupMainService,
    private houseKeepingService: HouseKeepingService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.submitButtonState = true;
    this.initializeForm();
    this.fieldsSetupMainService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;

        console.log(this.inputHelpData);
      });

    this.getDataList();
  }

  private initializeForm() {
    this.submitButtonText = 'Submit';
    this.FieldsSetupMaintenanceForm = new FormGroup({
      Flag: new FormControl('0', [Validators.required]),
      Code: new FormControl(''),
      selectedOptionCode: new FormControl('0'),
      Description: new FormControl(''),
    });
  }

  getDataList = () => {
    this.spinner.show();
    this.fieldsSetupMainService
      .GetAllList()
      .pipe(first())
      .subscribe(
        (x: FieldsSetupCode[]) => {
          this.spinner.hide();
          this.dataList = x;
          console.log(this.dataList);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  public getTableReportData() {
    this.displayTabularData = true;
  }

  // changeSelectValue = (e) => {
  //   if (e.target.value) {
  //     let selectedCode = this.dataList.find(
  //       (x) => x.Code == this.FieldsSetupMaintenanceForm.get('Code').value
  //     );
  //     if (selectedCode) {
  //       this.FieldsSetupMaintenanceForm.patchValue({
  //         selectedOptionCode: selectedCode.Code,
  //         ProfessionDescription: selectedCode.Description,
  //       });
  //       this.selectedCode = selectedCode.Code;
  //       this.submitButtonText = 'Update';
  //     } else {
  //       this.FieldsSetupMaintenanceForm.patchValue({
  //         selectedOptionCode: 0,
  //         Code: '',
  //         Description: '',
  //       });
  //       this.submitButtonText = 'Submit';
  //     }
  //     // console.log(selectedCode);
  //   }
  // };

  // Code

  // selectChangeHandler(event: any) {
  //   let ChangeSelectedOption = event.target.value;
  //   if (ChangeSelectedOption) {
  //     let selectedCode = this.dataList.find(
  //       (x) => x.Code == ChangeSelectedOption
  //     );
  //     this.FieldsSetupMaintenanceForm.patchValue({
  //       selectedOptionCode: selectedCode.Code,
  //       Description: selectedCode.Code == 0 ? '' : selectedCode.Description,
  //       Code: selectedCode.Code == 0 ? '' : selectedCode.Code,
  //     });
  //     this.selectedCode = selectedCode.Code;
  //     this.submitButtonText = selectedCode.Code == 0 ? 'Submit' : 'Update';
  //     //console.log(selectedCode);
  //   }
  // }

  saveOrUpdate = () => {
    if (
      this.FieldsSetupMaintenanceForm.value.Flag == 0 ||
      this.FieldsSetupMaintenanceForm.value.Description == ''
    ) {
      alert('Please Select Required Field');
      return;
    } else if (
      this.FieldsSetupMaintenanceForm.controls['selectedOptionCode'].value == 0
    ) {
      this.submit();
    } else {
      if (confirm('Are You Sure Want Update Information?')) {
        this.spinner.show();
        var formValue = this.FieldsSetupMaintenanceForm.value;
        if (formValue.Code == '') formValue.Code = 0;
        this.houseKeepingService
          .insert('FieldsSetupMaintenance', formValue)
          .pipe(first())
          .subscribe(
            (x: FieldsSetupCode[]) => {
              alert('Updated Successfully!');
              this.getDataList();
              this.initializeForm();
              this.spinner.hide();
            },
            (err) => {
              this.spinner.hide();
            }
          );
      }
    }
  };

  submit = () => {
    if (confirm('Are You Sure Want Save Information?')) {
      this.spinner.show();
      var fValue = this.FieldsSetupMaintenanceForm.value;
      console.log('Fvalue:', fValue);
      this.fieldsSetupMainService
        .submit(fValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res: any) => {
            console.log('Res:', res);
            this.spinner.hide();
            if (res.Success) {
              this.getDataList();
              this.initializeForm();
              this.spinner.hide();
              alert('Information Submitted !');
            }
          },
          (err) => {
            this.spinner.hide();
            this.toaster.error('Something Went Wrong !', 'Error');
          }
        );
    }
  };

  onChangeFlag(FlagId: number) {
    if (FlagId) {
      console.log('FlagId', FlagId);
      this.spinner.show();
      this.fieldsSetupMainService
        .GetFieldList(FlagId)
        .pipe(first())
        .subscribe(
          (x: FieldsSetupCode2[]) => {
            this.spinner.hide();
            this.CodeList = x;
            console.log('OnChangeFlag', this.CodeList);
          },
          (err) => {
            this.spinner.hide();
          }
        );
    } else {
      this.CodeList = null;
    }
    this.FieldsSetupMaintenanceForm.patchValue({
      selectedOptionCode: 0,
      Description: '',
      Code: '',
    });
    this.submitButtonText =
      this.FieldsSetupMaintenanceForm.controls['selectedOptionCode'].value == 0
        ? 'Submit'
        : 'Update';

    document.getElementById(`Code`).focus();
  }

  onChangeselectedOptionCode(event: any) {
    let flagID = this.FieldsSetupMaintenanceForm.controls['Flag'].value;
    console.log(flagID);
    let CodeId = this.FieldsSetupMaintenanceForm.controls['selectedOptionCode']
      .value;
    console.log('CodeId:', CodeId);

    if (CodeId) {
      this.spinner.show();
      this.fieldsSetupMainService
        .GetFieldDetails(CodeId, flagID)
        .pipe(first())
        .subscribe(
          (x: any) => {
            this.spinner.hide();
            this.CodeDetailsList = x;
            console.log('CodeDEtailList:', this.CodeDetailsList);
            if (this.CodeDetailsList.Code) {
              this.FieldsSetupMaintenanceForm.patchValue({
                selectedOptionCode: this.CodeDetailsList.Code,
                Description:
                  this.CodeDetailsList.Code == 0
                    ? ''
                    : this.CodeDetailsList.Description,
                Code:
                  this.CodeDetailsList.Code == 0
                    ? ''
                    : this.CodeDetailsList.Code,
              });
              this.submitButtonText =
                this.CodeDetailsList.Code == 0 ? 'Submit' : 'Update';
            }

            console.log(this.CodeDetailsList);
            console.log(this.CodeDetailsList.Code);
          },
          (err) => {
            this.spinner.hide();
          }
        );
    } else {
      this.CodeDetailsList = null;
    }
    document.getElementById(`Description`).focus();
  }

  onChangeCode(event: any) {
    let flagID = this.FieldsSetupMaintenanceForm.controls['Flag'].value;
    console.log(flagID);
    let CodeId = this.FieldsSetupMaintenanceForm.controls['Code'].value;
    console.log(CodeId);
    if (CodeId) {
      this.spinner.show();
      this.fieldsSetupMainService
        .GetFieldDetails(CodeId, flagID)
        .pipe(first())
        .subscribe(
          (x: any) => {
            this.spinner.hide();
            this.CodeDetailsList = x;
            if (this.CodeDetailsList.Code) {
              this.FieldsSetupMaintenanceForm.patchValue({
                selectedOptionCode: this.CodeDetailsList.Code,
                Description:
                  this.CodeDetailsList.Code == 0
                    ? ''
                    : this.CodeDetailsList.Description,
                Code:
                  this.CodeDetailsList.Code == 0
                    ? ''
                    : this.CodeDetailsList.Code,
              });
              this.submitButtonText = 'Submit';
            }
            console.log('CodeDetailsList:', this.CodeDetailsList);
            console.log('CodeDetailListCode:', this.CodeDetailsList.Code);
          },
          (err) => {
            this.spinner.hide();
          }
        );
    } else {
      this.CodeDetailsList = null;
    }
    document.getElementById(`Description`).focus();
  }
}
