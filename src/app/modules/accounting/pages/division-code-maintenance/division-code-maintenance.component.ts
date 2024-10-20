import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { AccountingService } from '../../services/accounting.service';

@Component({
  selector: 'app-division-code-maintenance',
  templateUrl: './division-code-maintenance.component.html',
  styleUrls: ['./division-code-maintenance.component.css'],
})
export class DivisionCodeMaintenanceComponent implements OnInit {
  dataList = [];
  submitButtonText: string = 'Submit';
  submitButtonState: boolean = false;
  displayTabularData: boolean = false;
  selectedCode: any = null;
  DivisionCodeForm: FormGroup;

  constructor(
    private accountingService: AccountingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.submitButtonState = true;
    this.getDataList();
    this.initializeForm();
  }

  private initializeForm() {
    this.submitButtonText = 'Submit';
    this.DivisionCodeForm = new FormGroup({
      DivisionCode: new FormControl(''),
      selectedOptionCode: new FormControl('0'),
      DivisionDescription: new FormControl('' , [Validators.required]),
      DiviDescriptionBang: new FormControl(''),
      DivisionOrgCode: new FormControl(''),
    });
  }

    // Get All Division  Code Data
    getDataList = () => {
      this.spinner.show();
      this.accountingService
        .getDivisionCodeInfo()
        .pipe(first())
        .subscribe(
          (x: any[]) => {
            this.spinner.hide();
            this.dataList = x;
          },
          (err) => {
            this.spinner.hide();
          }
        );
    };

    public getTableReportData() {
      this.displayTabularData = true;
    }
    changeSelectValue = (e) => {
      if (e.target.value) {
        let selectedCode = this.dataList.find(
          (x) =>
            x.DivisionCode ==
            this.DivisionCodeForm.get('DivisionCode').value
        );
        console.log("This is if")
        if (selectedCode) {
          this.DivisionCodeForm.patchValue({
            selectedOptionCode: selectedCode.DivisionCode,
            DivisionDescription: selectedCode.DivisionDescription,
            DiviDescriptionBang: selectedCode.DiviDescriptionBang
          });
          this.selectedCode = selectedCode.DivisionCode;
          this.submitButtonText = 'Update';
        } else {
          console.log("Invalid")
          alert('Invalid District Code !');
          this.DivisionCodeForm.patchValue({
            selectedOptionCode: 0,
            DivisionCode: '',
            DivisionDescription: '',
            DiviDescriptionBang: ''
          });
          this.submitButtonText = 'Submit';
        }
        console.log(selectedCode);
      }
    };
  
    // DivisionCode
  
    selectChangeHandler(event: any) {
      let ChangeSelectedOption = event.target.value;
      if (ChangeSelectedOption) {
        let selectedCode = this.dataList.find(
          (x) => x.DivisionCode == ChangeSelectedOption
        );
        this.DivisionCodeForm.patchValue({
          selectedOptionCode: selectedCode.DivisionCode,
          DivisionDescription:
            selectedCode.DivisionCode == 0 ? '' : selectedCode.DivisionDescription,
            DivisionCode:
            selectedCode.DivisionCode == 0 ? '' : selectedCode.DivisionCode,
            DiviDescriptionBang: selectedCode.DivisionCode == 0 ? '' : selectedCode.DiviDescriptionBang,
            DivisionOrgCode: selectedCode.DivisionOrgCode==0?'':selectedCode.DivisionOrgCode
        });
        this.selectedCode = selectedCode.DivisionCode;
        this.submitButtonText =
          selectedCode.DivisionCode == 0 ? 'Submit' : 'Update';
        console.log(selectedCode);
      }
    }
  
    //Insert and Update Division code data
  
    saveOrUpdate = () => {
      if (this.DivisionCodeForm.value.DivisionDescription == '') {
        alert('You Must Fillup Description Field !');
      }else{
      console.log("clicked");
      this.spinner.show();
      var formValue = this.DivisionCodeForm.value;
      console.log("value", formValue)
      if (formValue.DivisionCode == '') formValue.DivisionCode = 0;
      this.accountingService
        .insertDivi(formValue)
        .pipe(first())
        .subscribe(
          (x: any[]) => {
            this.getDataList();
            this.initializeForm();
            this.spinner.hide();
          },
          (err) => {
            this.spinner.hide();
          }
        );
      }
    };
}
