import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import {
  IVillageDetails,
  VillageCodeModel,
} from '../../models/member-application.model';
import { AccountingService } from '../../services/accounting.service';

@Component({
  selector: 'app-village-code-maintenance',
  templateUrl: './village-code-maintenance.component.html',
  styleUrls: ['./village-code-maintenance.component.css'],
})
export class VillageCodeMaintenanceComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  public currentChange: IVillageDetails;
  divisionList = [];
  postOfficeList = [];
  villageList = [];
  distList = [];
  upzilaList = [];
  thanaList: any[] = [];
  response: VillageCodeModel;
  VillageCodeForm: FormGroup;
  applicationService: any;
  inputHelpData: any;
  submitButtonText: string = 'Submit';
  displayTabularData: boolean = false;
  constructor(
    private accountingService: AccountingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getDivisionList();
    this.getPostOfficeList();
    this.getVillageCodeInfo();
    this.getDistCodeInfo();
    this.getUpzilaCodeInfo();
    this.getThanaCodeInfo();
  }

  private initializeForm() {
    this.submitButtonText = 'Submit';
    this.VillageCodeForm = new FormGroup({
      VillageCode: new FormControl('', [Validators.required]),
      Village: new FormControl('0'),
      VillageDescription: new FormControl(''),
      VillageDescriptionBeng: new FormControl(''),
      PostOfficeName: new FormControl('0'),
      ThanaName: new FormControl('0'),
      UpzilaDescription: new FormControl('0'),
      DistDescription: new FormControl('0'),
      DivisionDescription: new FormControl('0'),
    });
  }

  // Get All Division  Code Data
  getDivisionList = () => {
    this.spinner.show();
    this.accountingService
      .getDivisionInfo()
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.spinner.hide();
          x.sort((a, b) =>
            a.DivisionDescription.localeCompare(b.DivisionDescription)
          );
          this.divisionList = x;
          console.log('this is division list', this.divisionList);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  // Get All post office  Code Data
  getPostOfficeList = () => {
    this.spinner.show();
    this.accountingService
      .getPostOfficeInfo()
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.spinner.hide();
          x.sort((a, b) => a.PostOfficeName.localeCompare(b.PostOfficeName));
          this.postOfficeList = x;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  getVillageCodeInfo = () => {
    this.spinner.show();
    this.accountingService
      .getVillageCodeInfo()
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.spinner.hide();
          this.villageList = x;
          console.log('This is villageList', this.villageList);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  getDistCodeInfo = () => {
    this.spinner.show();
    this.accountingService
      .getDistCodeInfo()
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.spinner.hide();
          x.sort((a, b) => a.DistDescription.localeCompare(b.DistDescription));
          this.distList = x;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  getUpzilaCodeInfo = () => {
    this.spinner.show();
    this.accountingService
      .getUpzilaCodeInfo()
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.spinner.hide();
          x.sort((a, b) =>
            a.UpzilaDescription.localeCompare(b.UpzilaDescription)
          );
          this.upzilaList = x;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  getThanaCodeInfo = () => {
    this.spinner.show();
    this.accountingService
      .getThanaCodeInfo()
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.spinner.hide();
          x.sort((a, b) =>
            a.ThanaDescription.localeCompare(b.ThanaDescription)
          );
          this.thanaList = x;
          console.log('this is thana list ', x);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  sentVillageCode = (e) => {
    this.VillageCodeForm.controls['VillageCode'].setValue(e.target.value);
    this.VillageCodeForm.controls['Village'].setValue(e.target.value);
    this.submitButtonText = 'Update';
    var fvalue = e.target.value;
    this.spinner.show();
    this.accountingService
      .sentVillageCode(fvalue)
      .pipe(first())
      .subscribe(
        (x: VillageCodeModel) => {
          this.spinner.hide();
          this.response = x;
          console.log('This is village response', this.response);
          this.VillageCodeForm.controls['VillageDescription'].setValue(
            this.response.VillageName
          );
          this.VillageCodeForm.controls['VillageDescriptionBeng'].setValue(
            this.response.VillageNameBang
          );
          this.VillageCodeForm.controls['PostOfficeName'].setValue(
            this.response.PostOfficeCode
          );
          this.VillageCodeForm.controls['ThanaName'].setValue(
            this.response.ThanaCode
          );
          this.VillageCodeForm.controls['UpzilaDescription'].setValue(
            this.response.UpzilaCode
          );
          this.VillageCodeForm.controls['DistDescription'].setValue(
            this.response.DistrictCode
          );
          this.VillageCodeForm.controls['DivisionDescription'].setValue(
            this.response.DivisionCode
          );
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  saveOrUpdate = () => {

    if(!this.VillageCodeForm.value.VillageDescription)
    {
      alert("Please Add Description!!!");
      return;
    }
    let data = {
      VillageCode: this.VillageCodeForm.value.VillageCode,
      VillageName: this.VillageCodeForm.value.VillageDescription,
      PostOfficeCode: this.VillageCodeForm.value.PostOfficeName,
      DivisionDescription: this.VillageCodeForm.value.DivisionDescription,
      DistDescription: this.VillageCodeForm.value.DistDescription,
      UpzilaDescription: this.VillageCodeForm.value.UpzilaDescription,
      ThanaDescription: this.VillageCodeForm.value.ThanaName,
      VillageNameBang: this.VillageCodeForm.value.VillageDescriptionBeng,
    };

    this.spinner.show();
    this.accountingService
      .insertAndUpdate(data)
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.getVillageCodeInfo();
          this.initializeForm();
          alert('Data Saved Successfully !');
          this.spinner.hide();
        },
        (err) => {
          this.toastr.error('Something Went Wrong !', 'Error');
          this.spinner.hide();
        }
      );
  };

  public getTableReportData() {
    this.displayTabularData = true;
  }
  getDist(e) {
    this.spinner.show();
    this.accountingService
      .getDistByDiv(e.target.value)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.distList = x;
          console.log('this is dist list ', x);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }
  getUpz(e) {
    this.spinner.show();
    this.accountingService
      .getUpzByDist(e.target.value)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.upzilaList = x;
          console.log('this is Upz list ', x);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }
  getThana(e) {
    this.spinner.show();
    this.accountingService
      .getThByUpz(e.target.value)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.thanaList = x;
          console.log('this is thana list ', x);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }

}
