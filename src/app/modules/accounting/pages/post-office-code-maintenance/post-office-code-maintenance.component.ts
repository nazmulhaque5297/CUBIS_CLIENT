import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { AccountingService } from '../../services/accounting.service';

@Component({
  selector: 'app-post-office-code-maintenance',
  templateUrl: './post-office-code-maintenance.component.html',
  styleUrls: ['./post-office-code-maintenance.component.css'],
})
export class PostOfficeCodeMaintenanceComponent implements OnInit {
  dataList = [];
  submitButtonText: string = 'Submit';
  submitButtonState: boolean = false;
  displayTabularData: boolean = false;
  selectedCode: any = null;
  PostOfficeCodeForm: FormGroup;

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
    this.PostOfficeCodeForm = new FormGroup({
      PostOfficeCode: new FormControl('', [Validators.required]),
      selectedOptionCode: new FormControl('0'),
      PostOfficeName: new FormControl('',[Validators.required]),
      PostOfficeNameBang: new FormControl('')
    });
  }
  // Get All post office  Code Data
  getDataList = () => {
    this.spinner.show();
    this.accountingService
      .getPostOfficeInfo()
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.spinner.hide();
          this.dataList = x;
          console.log("Datalist", this.dataList)
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
          x.PostOfficeCode ==
          this.PostOfficeCodeForm.get('PostOfficeCode').value
      );
      if (selectedCode) {
        this.PostOfficeCodeForm.patchValue({
          selectedOptionCode: selectedCode.PostOfficeCode,
          PostOfficeName: selectedCode.PostOfficeName,
          PostOfficeNameBang: selectedCode.PostOfficeNameBang
        });
        this.selectedCode = selectedCode.PostOfficeCode;
        this.submitButtonText = 'Update';
      } else {
        this.PostOfficeCodeForm.patchValue({
          selectedOptionCode: 0,
          PostOfficeCode: '',
          PostOfficeName: '',
          PostOfficeNameBang:''
          
        });
        alert('Please give the valid Post office code !');
        this.submitButtonText = 'Submit';
      }
      console.log(selectedCode);
    }
  };

  // PostOfficeCode

  selectChangeHandler(event: any) {
    let ChangeSelectedOption = event.target.value;
    console.log(ChangeSelectedOption)
    if (ChangeSelectedOption) {
      let selectedCode = this.dataList.find(
        (x) => x.PostOfficeCode == ChangeSelectedOption
      );
      if(selectedCode){
        this.PostOfficeCodeForm.patchValue({
          selectedOptionCode: selectedCode.PostOfficeCode,
          PostOfficeName:
            selectedCode.PostOfficeCode == 0 ? '' : selectedCode.PostOfficeName,
          PostOfficeCode:
            selectedCode.PostOfficeCode == 0 ? '' : selectedCode.PostOfficeCode,
          PostOfficeNameBang: selectedCode == 0? '' : selectedCode.PostOfficeNameBang
        });
        this.selectedCode = selectedCode.PostOfficeCode;
        this.submitButtonText =
          selectedCode.PostOfficeCode == 0 ? 'Submit' : 'Update';
      }
      else{
        this.PostOfficeCodeForm.patchValue({
          PostOfficeName: '',
          PostOfficeCode: '',
          PostOfficeNameBang: ''
        });
        this.submitButtonText = 'Submit';
      }

    }
  }

  //Insert and Update Post office code data

  saveOrUpdate = () => {
    if (this.PostOfficeCodeForm.value.PostOfficeName == '') {
      alert('You Must Fillup Description Field !');
    }else{
    console.log("clicked");
    this.spinner.show();
    var formValue = this.PostOfficeCodeForm.value;
    console.log("value", formValue)
    if (formValue.PostOfficeCode == '') formValue.PostOfficeCode = 0;
    this.accountingService
      .insert(formValue)
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.getDataList();
          this.initializeForm();
          this.spinner.hide();
          alert('Data Submitted Successfully !',);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }
  };
}
