import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import {
  CollectorsModel,
  ThanaDataRecModel,
  UpizilaDataRecModel,
} from '../../models/member-application.model';
import { AccountingService } from '../../services/accounting.service';

@Component({
  selector: 'app-new-collectors-maintenance',
  templateUrl: './new-collectors-maintenance.component.html',
  styleUrls: ['./new-collectors-maintenance.component.css'],
})
export class NewCollectorsMaintenanceComponent implements OnInit {
  collectorList = [];
  divisionList = [];
  districtList = [];
  upzilaList = [];
  thanaList = [];
  allInfo: CollectorsModel;
  selectedCode: any;
  submitButtonText: string = 'Submit';
  CollectorsCodeForm: FormGroup;
  displayTabularData: boolean = false;
  constructor(
    private accountingService: AccountingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  pageLoadInfo = () => {
    this.spinner.show();
    this.accountingService
      .pageCLoadInfo()
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          if (x.Open == false) {
            this.router.navigate(['accounting/']);
          }
          console.log('this is page load info', x);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  ngOnInit(): void {
    this.pageLoadInfo();
    this.initializeForm();
    this.getCollectorsInfo();
    this.getDivisionList();
  }

  private initializeForm() {
    this.CollectorsCodeForm = new FormGroup({
      CollectorNo: new FormControl(''),
      Collectordesc: new FormControl('0'),
      CollectorName: new FormControl(''),
      NationalIdNo: new FormControl('0'),
      AddressL1: new FormControl(''),
      AddressL2: new FormControl(''),
      AddressL3: new FormControl(''),
      Division: new FormControl('0'),
      District: new FormControl('0'),
      UpZila: new FormControl('0'),
      Thana: new FormControl('0'),
      TelephoneNo: new FormControl('0'),
      MobileNo: new FormControl('0'),
      Fax: new FormControl('0'),
      email: new FormControl(''),
    });
  }

  // Get Collectors
  getCollectorsInfo = () => {
    this.spinner.show();
    this.accountingService
      .getCollectorsinfo()
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.spinner.hide();
          this.collectorList = x;
          console.log('This is collectors', this.collectorList);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  public getTableReportData() {
    this.displayTabularData = true;
  }
  // Change Handler
  changeSelectValue = (e) => {
    this.getAllCollectorsinfobyColNO();
    if (e.target.value) {
      let selectedCode = this.collectorList.find(
        (x) => x.CollectorNo == this.CollectorsCodeForm.get('CollectorNo').value
      );
      console.log('This is selected code', selectedCode);
      if (selectedCode) {
        console.log('This is if');
        this.CollectorsCodeForm.patchValue({
          CollectorName: selectedCode.CollectorName,
          Collectordesc: selectedCode.CollectorNo,
        });
        this.selectedCode = selectedCode.CollectorNo;
        this.submitButtonText = 'Update';
      } else {
        this.CollectorsCodeForm.patchValue({
          CollectorName: '',
          CollectorNo: '',
          Collectordesc: 0,
        });
        this.submitButtonText = 'Submit';
      }
      console.log(selectedCode);
    }
    document.getElementById(`CollectorName`).focus();
  };

  changeSelectValuekeydown(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`CollectorName`).focus();
  }

  // Select Handler
  selectChangeHandler(event: any) {
    this.getAllCollectorsinfo();
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.collectorList.find(
        (x) => x.CollectorNo == ChangeSelectedOption
      );
      console.log('Ths is selected code', selectedCode);
      if (selectedCode) {
        this.CollectorsCodeForm.patchValue({
          CollectorName: selectedCode.CollectorName,
          CollectorNo: selectedCode.CollectorNo,
        });
      } else {
        this.CollectorsCodeForm.patchValue({
          CollectorName: '',
          CollectorNo: '',
        });
      }

      this.selectedCode = selectedCode.CollectorNo;
      this.submitButtonText =
        selectedCode.CollectorNo == 0 ? 'Submit' : 'Update';
    }
    document.getElementById(`CollectorName`).focus();
  }

  onEnterCollectorNameHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`NationalIdNo`).focus();
  }

  onEnterNationalIdNoHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`AddressL1`).focus();
  }

  onEnterAddressL1Handler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`AddressL2`).focus();
  }

  onEnterAddressL2Handler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`AddressL3`).focus();
  }

  onEnterAddressL3Handler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`TelephoneNo`).focus();
  }

  onEnterTelephoneNoHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`MobileNo`).focus();
  }

  onEnterMobileNoHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`Fax`).focus();
  }

  onEnterFaxHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`email`).focus();
  }

  // Get All Division  Code Data
  getDivisionList = () => {
    this.spinner.show();
    this.accountingService
      .getDivisionCodeInfo()
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.spinner.hide();
          this.divisionList = x;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  // Get District List
  sentDiviCode = () => {
    console.log('This is form data', this.CollectorsCodeForm.value.Division);
    this.spinner.show();
    this.accountingService
      .sentDiviCode(this.CollectorsCodeForm.value.Division)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.districtList = x;
          console.log('This is response', this.districtList);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  // Get Upazila List
  getUpizila() {
    var n = new UpizilaDataRecModel();
    n.Divicode = this.CollectorsCodeForm.value.Division;
    n.Distcode = this.CollectorsCodeForm.value.District;
    this.accountingService
      .getUpizila(n)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.upzilaList = x;
          console.log('This is upizilla response', this.upzilaList);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }

  // Get Thana
  getThana() {
    var n = new ThanaDataRecModel();
    n.DivisionCode = this.CollectorsCodeForm.value.Division;
    n.DistrictCode = this.CollectorsCodeForm.value.District;
    n.UpzilaCode = this.CollectorsCodeForm.value.UpZila;
    this.accountingService
      .getThana(n)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.thanaList = x;
          console.log('This is Thana  response', this.thanaList);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }

  // Get All Collector Information
  getAllCollectorsinfo = () => {
    this.spinner.show();
    this.accountingService
      .getAllCollectorsinfo(this.CollectorsCodeForm.value.Collectordesc)
      .pipe(first())
      .subscribe(
        (x: CollectorsModel) => {
          this.spinner.hide();
          this.allInfo = x;
          console.log('This is response', this.allInfo);
          this.patchValuefunc();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  // Get All Collector Information by ColNo
  getAllCollectorsinfobyColNO = () => {
    this.spinner.show();
    this.accountingService
      .getAllCollectorsinfo(this.CollectorsCodeForm.value.CollectorNo)
      .pipe(first())
      .subscribe(
        (x: CollectorsModel) => {
          this.spinner.hide();
          this.allInfo = x;
          console.log('This is response', this.allInfo);
          this.patchValuefunc();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  patchValuefunc() {
    this.CollectorsCodeForm.controls['NationalIdNo'].setValue(
      this.allInfo.NationalIdNo
    );
    this.CollectorsCodeForm.controls['AddressL1'].setValue(
      this.allInfo.AddressL1
    );
    this.CollectorsCodeForm.controls['AddressL2'].setValue(
      this.allInfo.AddressL2
    );
    this.CollectorsCodeForm.controls['AddressL3'].setValue(
      this.allInfo.AddressL3
    );
    this.CollectorsCodeForm.controls['Division'].setValue(
      this.allInfo.Division
    );
    this.CollectorsCodeForm.controls['District'].setValue(
      this.allInfo.District
    );
    this.CollectorsCodeForm.controls['UpZila'].setValue(this.allInfo.UpZila);
    this.CollectorsCodeForm.controls['Thana'].setValue(this.allInfo.Thana);
    this.CollectorsCodeForm.controls['TelephoneNo'].setValue(
      this.allInfo.TelephoneNo
    );
    this.CollectorsCodeForm.controls['MobileNo'].setValue(
      this.allInfo.MobileNo
    );
    this.CollectorsCodeForm.controls['Fax'].setValue(this.allInfo.Fax);
    this.CollectorsCodeForm.controls['email'].setValue(this.allInfo.email);
    this.sentDiviCode();
    this.getUpizila();
    this.getThana();
  }
  //Insert and Update Division code data

  saveOrUpdate = () => {
    console.log('clicked');
    this.spinner.show();
    var formValue = this.CollectorsCodeForm.value;
    console.log('value', formValue);
    this.accountingService
      .collectorsInsertUpdate(formValue)
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          console.log('This is seleted code', this.selectedCode);
          if (this.submitButtonText == 'Submit') {
            alert('Data Inserted !');
          } else {
            alert('Data Updated !');
          }
          console.log('This is response', x);
          this.initializeForm();
          this.getCollectorsInfo();
          this.sentDiviCode();
          this.getUpizila();
          this.getThana();
          this.spinner.hide();
          this.initializeForm();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
}
