import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { GroupCodeModel } from '../../models/approve-loan-application.model';
import {
  GroupModel,
  ThanaDataRecModel,
  UpizilaDataRecModel,
} from '../../models/member-application.model';
import { AccountingService } from '../../services/accounting.service';

@Component({
  selector: 'app-new-group-maintenace',
  templateUrl: './new-group-maintenace.component.html',
  styleUrls: ['./new-group-maintenace.component.css'],
})
export class NewGroupMaintenaceComponent implements OnInit {
  divisionList = [];
  districtList = [];
  upzilaList = [];
  thanaList = [];
  collectorList = [];
  collectorInfoList = [];
  DataList = [];
  groupInfo: GroupModel;
  selectedCode: any;
  GroupCodeForm: FormGroup;
  btnUpdate: boolean = false;
  btnSubmit: boolean = true;
  Show: boolean = true;
  constructor(
    private accountingService: AccountingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  pageLoadInfo = () => {
    this.spinner.show();
    this.accountingService
      .pageLoadInfo()
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          if (x.Open == false) {
            this.router.navigate(['accounting/']);
          } else if (x.Visible != null) {
            this.Show = x.Visible;
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
    this.getCollectors();
    this.getDivisionList();
    this.getCollectorsInfo();
  }

  private initializeForm() {
    this.GroupCodeForm = new FormGroup({
      Division: new FormControl('0'),
      District: new FormControl('0'),
      UpZila: new FormControl('0'),
      Thana: new FormControl('0'),
      AddressL1: new FormControl(''),
      AddressL2: new FormControl(''),
      AddressL3: new FormControl(''),
      RegNo: new FormControl('', [Validators.required]),
      Regdesc: new FormControl('0'),
      RegName: new FormControl(''),
    });
    this.btnUpdate = false;
    this.btnSubmit = true;
  }

  // Get Collectors
  getCollectors = () => {
    this.spinner.show();
    this.accountingService
      .getCollectors()
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.spinner.hide();
          this.collectorList = x;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  getCollectorsInfo = () => {
    this.spinner.show();
    this.accountingService
      .getCollectorsInfo()
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.spinner.hide();
          this.collectorInfoList = x;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  getCollectorsInfoAfter = () => {
    var fValue = this.GroupCodeForm.value.Regdesc;
    this.spinner.show();
    this.accountingService
      .getCollectorsInfoAfter(fValue)
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.spinner.hide();
          this.collectorInfoList = x;
          for (var i = 0; i < this.collectorInfoList.length; i++) {
            if (this.collectorInfoList[i].Check == true) {
              let value = {
                CollectorName: this.collectorInfoList[i].ColName,
                Code: this.collectorInfoList[i].ColNo,
              };
              this.DataList.push(value);
            }
          }
          console.log('here is value', this.collectorInfoList);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  // Change Handler
  changeSelectValue = (e) => {
    this.getGroupInfoByRegNo();
    if (e.target.value) {
      let selectedCode = this.collectorList.find(
        (x) => x.RegNo == this.GroupCodeForm.get('RegNo').value
      );
      if (selectedCode) {
        this.GroupCodeForm.patchValue({
          Regdesc: selectedCode.RegNo,
          RegName: selectedCode.RegName,
        });
        this.selectedCode = selectedCode.RegNo;
        this.btnUpdate = true;
        this.btnSubmit = false;
      } else {
        this.GroupCodeForm.patchValue({
          Regdesc: 0,
          RegNo: '',
          RegName: '',
        });
        this.btnUpdate = false;
        this.btnSubmit = true;
      }
      console.log(selectedCode);
    }
    document.getElementById(`RegName`).focus();
  };

  onEnterRegNoHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`RegName`).focus();
  }

  onEnterRegNameHandler(e: KeyboardEvent) {
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
    document.getElementById(`Division`).focus();
  }

  // Select Handler
  selectChangeHandler(event: any) {
    this.getGroupInfo();
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.collectorList.find(
        (x) => x.RegNo == ChangeSelectedOption
      );
      console.log('Ths is selected code', selectedCode);
      if (selectedCode) {
        this.GroupCodeForm.patchValue({
          RegName: selectedCode.RegName,
          RegNo: selectedCode.RegNo,
        });
        this.getCollectorsInfoAfter();
      } else {
        this.GroupCodeForm.patchValue({
          RegName: '',
          RegNo: '',
        });
      }

      this.selectedCode = selectedCode.RegNo;
      this.btnUpdate = selectedCode.RegNo == 0 ? false : true;
      this.btnSubmit = selectedCode.RegNo == 0 ? true : false;
    }
    document.getElementById(`RegName`).focus();
  }
  // Get Group Details
  getGroupInfo = () => {
    console.log('This is form data', this.GroupCodeForm.value.Regdesc);
    this.spinner.show();
    this.accountingService
      .getGroupInfo(this.GroupCodeForm.value.Regdesc)
      .pipe(first())
      .subscribe(
        (x: GroupModel) => {
          this.spinner.hide();
          this.groupInfo = x;
          console.log('This is response', this.groupInfo);
          this.patchValuefunc();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  // Get Group Details
  getGroupInfoByRegNo = () => {
    console.log('This is form data', this.GroupCodeForm.value.RegNo);
    this.spinner.show();
    this.accountingService
      .getGroupInfo(this.GroupCodeForm.value.RegNo)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.groupInfo = x;
          console.log('This is response', this.groupInfo);
          this.patchValuefunc();
        },

        (err) => {
          this.spinner.hide();
        }
      );
  };

  patchValuefunc() {
    this.getUpizila();
    this.getThana();
    this.GroupCodeForm.controls['AddressL1'].setValue(this.groupInfo.AddressL1);
    this.GroupCodeForm.controls['AddressL2'].setValue(this.groupInfo.AddressL2);
    this.GroupCodeForm.controls['AddressL3'].setValue(this.groupInfo.AddressL3);
    this.GroupCodeForm.controls['Division'].setValue(this.groupInfo.Division);
    this.GroupCodeForm.controls['District'].setValue(this.groupInfo.District);
    this.GroupCodeForm.controls['UpZila'].setValue(this.groupInfo.UpZila);
    this.GroupCodeForm.controls['Thana'].setValue(this.groupInfo.Thana);
    this.sentDiviCode();
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
    console.log('This is form data', this.GroupCodeForm.value.Division);
    this.spinner.show();
    this.accountingService
      .sentDiviCode(this.GroupCodeForm.value.Division)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.districtList = x;
          this.getUpizila();
          this.getThana();
          console.log('This is response', this.districtList);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  // Get Upazila List
  getUpizila() {
    // this.getThana();
    var n = new UpizilaDataRecModel();
    n.Divicode = this.GroupCodeForm.value.Division;
    n.Distcode = this.GroupCodeForm.value.District;
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
    n.DivisionCode = this.GroupCodeForm.value.Division;
    n.DistrictCode = this.GroupCodeForm.value.District;
    n.UpzilaCode = this.GroupCodeForm.value.UpZila;
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

  //Insert and Update  data

  saveInformation = () => {
    console.log('clicked');
    this.spinner.show();
    var fValue = new GroupCodeModel();
    fValue.RegNo = this.GroupCodeForm.value.RegNo;
    fValue.RegName = this.GroupCodeForm.value.RegName;
    fValue.AddressL1 = this.GroupCodeForm.value.AddressL1;
    fValue.AddressL2 = this.GroupCodeForm.value.AddressL2;
    fValue.AddressL3 = this.GroupCodeForm.value.AddressL3;
    fValue.Division = this.GroupCodeForm.value.Division;
    fValue.District = this.GroupCodeForm.value.District;
    fValue.UpZila = this.GroupCodeForm.value.UpZila;
    fValue.Thana = this.GroupCodeForm.value.Thana;
    fValue.CheckValue = this.DataList;
    console.log('value', fValue);
    this.accountingService
      .insertGrpInfo(fValue)
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.getCollectors();
          this.sentDiviCode();
          this.getUpizila();
          this.getThana();
          alert('Data Saved');
          location.reload();
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  updateInformation = () => {
    console.log('clicked');
    this.spinner.show();
    var fValue = new GroupCodeModel();
    fValue.RegNo = this.GroupCodeForm.value.RegNo;
    fValue.RegName = this.GroupCodeForm.value.RegName;
    fValue.AddressL1 = this.GroupCodeForm.value.AddressL1;
    fValue.AddressL2 = this.GroupCodeForm.value.AddressL2;
    fValue.AddressL3 = this.GroupCodeForm.value.AddressL3;
    fValue.Division = this.GroupCodeForm.value.Division;
    fValue.District = this.GroupCodeForm.value.District;
    fValue.UpZila = this.GroupCodeForm.value.UpZila;
    fValue.Thana = this.GroupCodeForm.value.Thana;
    fValue.CheckValue = this.DataList;
    console.log('value', fValue);
    this.accountingService
      .updateGrpInfo(fValue)
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.getCollectors();
          this.initializeForm();
          this.sentDiviCode();
          this.getUpizila();
          this.getThana();
          alert('Data Updated');
          location.reload();
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  checkValue(data: any) {
    let selectedCode = this.DataList.find((x) => x.Code == data.ColNo);
    let value = {
      CollectorName: data.ColName,
      Code: data.ColNo,
    };
    if (!selectedCode) {
      this.DataList.push(value);
    } else {
      this.DataList = this.DataList.filter((item) => item.Code != data.ColNo);
    }
    console.log('This is checked value', this.DataList);
  }
}
