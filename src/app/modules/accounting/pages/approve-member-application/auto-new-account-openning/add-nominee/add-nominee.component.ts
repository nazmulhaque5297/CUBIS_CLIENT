import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import {
  GenerateNewAccountModel,
  IVillageDetails,
  MemberApplicationInputHelp,
  NomineeDataModel,
} from 'src/app/modules/accounting/models/member-application.model';
import { ApproveMemberApplicationService } from 'src/app/modules/accounting/services/approve-member-application.service';
import { AccountOpenService } from 'src/app/services/account-open.service';
import { MemberApplicationService } from 'src/app/services/member-application.service';

@Component({
  selector: 'app-add-nominee',
  templateUrl: './add-nominee.component.html',
  styleUrls: ['./add-nominee.component.css'],
})
export class AddNomineeComponent implements OnInit {
  public inputHelpData: MemberApplicationInputHelp =
    new MemberApplicationInputHelp();

  nomineeList = [];
  accTypeNonMemberInfo: GenerateNewAccountModel[] = [];
  newAccTypeMemberInfo: GenerateNewAccountModel[] = [];
  selectedNominee: any;
  getMemInfo: any;
  newAccType: any;
  nomineeForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  public nomineeVillage: IVillageDetails;
  updateButtonState: boolean = false;
  submitButtonState: boolean = true;
  memNo: any;
  patchAdd: any;
  check: any;
  sumOfPercentage:any;

  constructor(
    private route: ActivatedRoute,
    private approveMemberApplicationService: ApproveMemberApplicationService,
    private accountOpenService: AccountOpenService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private applicationService: MemberApplicationService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private toaster: ToastrService
  ) {
    this.nomineeVillage = { VillageCode: 0 };
  }

  ngOnInit(): void {
    this.initializeForm();
    // var NewMemNo = this.approveMemberApplicationService.NewMemNo;
    this.applicationService
      .getInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        console.log('this is value of line 63==>', data);
      });
    this.memNo = this.approveMemberApplicationService.NewMemNo;
    this.check = this.accountOpenService.checkTemp;
    console.log('this is check', this.check);
    console.log(
      'This is member no',
      this.approveMemberApplicationService.NewMemNo
    );
    console.log(
      'This is acc tye',
      this.approveMemberApplicationService.AccType
    );
    this.selectedNominee = null;
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.selectedNominee = null;
  }

  private initializeForm() {
    this.nomineeForm = new FormGroup({
      Id: new FormControl(''),
      NomineeName: new FormControl(''),
      PreAddressLine1: new FormControl(''),
      PreVillage: new FormControl('0', [Validators.required]),
      PreVillageCode: new FormControl(''),
      PreTelephone: new FormControl(''),
      PreMobile: new FormControl(''),
      PreEmail: new FormControl(''),
      SharePer: new FormControl('', [Validators.required]),
      Relation: new FormControl('', [Validators.required]),
    });
    if( this.accountOpenService.checkTemp )
      this.getNomineeListTemp();
    else
      this.getNomineeList();
  }

  onPreVillage(value: number): any {
    this.applicationService
      .GetVillageDetails(value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.nomineeVillage = res;
        console.log('This is line number 248', this.nomineeVillage);
        this.nomineeForm.controls['PreVillageCode'].setValue(
          this.nomineeVillage.VillageCode
        );
        this.nomineeForm.controls['PreVillage'].setValue(
          this.nomineeVillage.VillageCode
        );
      });
  }

  saveNominee = () => {
    this.selectedNominee = null;
    if (this.nomineeForm.invalid) {
      alert('You Must Fillup Required Field !');
      return;
    } else {
      if (this.accountOpenService.checkTemp) {
        this.saveNomineeTemp();
        return;
      }
      console.log('This is final');
      console.log('This is nominee');
      var n = new NomineeDataModel();
      n.AccNo = this.accountOpenService.AccNo;
      n.MemNo = this.accountOpenService.MemNo;
      n.AccType = this.accountOpenService.AccType;
      n.MemType = this.accountOpenService.MemType;
      n.NomineeName = this.nomineeForm.value.NomineeName;
      n.PreAddressLine1 = this.nomineeForm.value.PreAddressLine1;
      n.PreVillage = this.nomineeForm.value.PreVillage;
      n.PreVillageCode = this.nomineeForm.value.PreVillageCode;
      n.PreTelephone = this.nomineeForm.value.PreTelephone;
      n.PreMobile = this.nomineeForm.value.PreMobile;
      n.PreEmail = this.nomineeForm.value.PreEmail;
      n.SharePer = this.nomineeForm.value.SharePer;
      n.Relation = this.nomineeForm.value.Relation;
      this.spinner.show();
      console.log('This is n', n);
      this.approveMemberApplicationService
        .nomineeAdd(n)
        .pipe(first())
        .subscribe(
          (x: any[]) => {
            this.initializeForm();
            this.nomineeVillage = { VillageCode: 0 };
            this.getNomineeList();
            this.spinner.hide();
            alert('Nominee Information Saved !');
          },
          (err) => {
            this.spinner.hide();
            this.toastr.error('Something Went Wrong !', 'Error');
          }
        );
    }
  };

  // Get Nominee List
  getNomineeList = () => {
    if (this.accountOpenService.checkTemp) {
      this.getNomineeListTemp();
      return;
    } else {
      let data = {
        MemNo: this.accountOpenService.MemNo,
        AccType: this.accountOpenService.AccType,
        AccNo: this.accountOpenService.AccNo
      };
      console.log('this is data', data);
      this.spinner.show();
      this.approveMemberApplicationService
        .getNomineeInfo(data)
        .pipe(first())
        .subscribe(
          (x: any) => {
            this.spinner.hide();
            this.nomineeList = x;
            console.log('NomineeList222',x.item.SharePer);
            console.log('NomineeList', this.nomineeList);
            
          },
          (err) => {
            this.spinner.hide();
          }
        );
    }
  };

  getNomineeListTemp = () => {
    let data = {
      MemNo: this.accountOpenService.MemNo,
      AccType: this.accountOpenService.AccType,
      AccNo: this.accountOpenService.AccNo
    };
    this.spinner.show();
    this.approveMemberApplicationService
      .getNomineeInfoTemp(data)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.nomineeList = x;
          console.log('NomineeList', this.nomineeList);
          console.log('NomineeList222', this.nomineeList[0].SharePer);
          let listLength=this.nomineeList.length;
           this.sumOfPercentage=0;
          for(let i=0;i<listLength;i++)
          {
            this.sumOfPercentage+=this.nomineeList[i].SharePer;
          }
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  // patch value
  patchNomineeValue = (item) => {
    let selectedValue = this.nomineeList.find((x) => x.Id == item.Id);
    this.selectedNominee = selectedValue;
    this.onPreVillage(selectedValue.PreVillageCode);

    this.nomineeForm.controls['Id'].setValue(selectedValue.Id);
    this.nomineeForm.controls['NomineeName'].setValue(
      selectedValue.NomineeName
    );
    this.nomineeForm.controls['PreAddressLine1'].setValue(
      selectedValue.PreAddressLine1
    );
    this.nomineeForm.controls['PreTelephone'].setValue(
      selectedValue.PreTelephone
    );
    this.nomineeForm.controls['PreMobile'].setValue(selectedValue.PreMobile);
    this.nomineeForm.controls['PreEmail'].setValue(selectedValue.PreEmail);
    this.nomineeForm.controls['Relation'].setValue(selectedValue.Relation);
    this.nomineeForm.controls['SharePer'].setValue(selectedValue.SharePer);
    this.nomineeForm.controls['PreVillage'].setValue(
      selectedValue.PreVillageCode
    );
    this.updateButtonState = true;
    this.submitButtonState = false;
  };

  updateNomineeee = () => {
    this.selectedNominee = null;
    if (this.accountOpenService.checkTemp) {
      this.updateNomineeeeTemp();
      return;
    } else {
      if (confirm('Are you sure you want Update nominee information??')) {
        console.log('Updated');
        var n = new NomineeDataModel();
        n.AccNo = this.approveMemberApplicationService.nomineeAccNo;
        n.MemNo = this.approveMemberApplicationService.NewMemNo;
        n.AccType = this.approveMemberApplicationService.AccType;
        n.MemType = this.approveMemberApplicationService.MemType;
        n.NomineeName = this.nomineeForm.value.NomineeName;
        n.PreAddressLine1 = this.nomineeForm.value.PreAddressLine1;
        n.PreVillage = this.nomineeForm.value.PreVillage;
        n.PreVillageCode = this.nomineeForm.value.PreVillageCode;
        n.PreTelephone = this.nomineeForm.value.PreTelephone;
        n.PreMobile = this.nomineeForm.value.PreMobile;
        n.PreEmail = this.nomineeForm.value.PreEmail;
        n.SharePer = this.nomineeForm.value.SharePer;
        n.Relation = this.nomineeForm.value.Relation;
        n.Id = this.nomineeForm.value.Id;
        this.spinner.show();
        let listLength=this.nomineeList.length;
        this.sumOfPercentage=0;
       for(let i=0;i<listLength;i++)
       {
         this.sumOfPercentage+=this.nomineeList[i].SharePer;
       }
        this.approveMemberApplicationService
          .updateNomineeInfo(n)
          .pipe(first())
          .subscribe(
            (x: any[]) => {
              this.initializeForm();
              this.nomineeVillage = { VillageCode: 0 };
              this.getNomineeList();
              this.updateButtonState = false;
              this.submitButtonState = true;
              this.spinner.hide();
              alert('Nominee Information Updated !');
            },
            (err) => {
              this.spinner.hide();
              this.toastr.error('Something Went Wrong !', 'Error');
            }
          );
      }
    }
  };

  updateNomineeeeTemp = () => {
    this.selectedNominee = null;
    console.log("Hello TemUpdate Page!!!")
    if (confirm('Are you sure you want Update nominee information??')) {
      console.log('Updated');
      var n = new NomineeDataModel();
      n.AccNo = this.accountOpenService.AccNo;
      n.MemNo = this.accountOpenService.MemNo;
      n.AccType = this.accountOpenService.AccType;
      n.MemType = this.accountOpenService.MemType;
      n.NomineeName = this.nomineeForm.value.NomineeName;
      n.PreAddressLine1 = this.nomineeForm.value.PreAddressLine1;
      n.PreVillage = this.nomineeForm.value.PreVillage;
      n.PreVillageCode = this.nomineeForm.value.PreVillageCode;
      n.PreTelephone = this.nomineeForm.value.PreTelephone;
      n.PreMobile = this.nomineeForm.value.PreMobile;
      n.PreEmail = this.nomineeForm.value.PreEmail;
      n.SharePer = this.nomineeForm.value.SharePer;
      n.Relation = this.nomineeForm.value.Relation;
      n.Id = this.nomineeForm.value.Id;
      this.spinner.show();

      if(this.nomineeForm.value.SharePer=='' )
      {
        alert("Please Fillup Share Percentage!!!")
        return
      }
      this.approveMemberApplicationService
        .updateNomineeInfoTemp(n)
        .pipe(first())
        .subscribe(
          (x: any[]) => {
            this.initializeForm();
            this.nomineeVillage = { VillageCode: 0 };
            this.getNomineeList();
            this.updateButtonState = false;
            this.submitButtonState = true;
            this.spinner.hide();
            alert('Nominee Information Updated !');
          },
          (err) => {
            this.spinner.hide();
            this.toastr.error('Something Went Wrong !', 'Error');
          }
        );
    }
  };

  saveNomineeTemp = () => {
    this.selectedNominee = null;
    console.log('this is temp nominee');
    var n = new NomineeDataModel();
    n.AccNo = this.accountOpenService.AccNo;
    n.MemNo = this.accountOpenService.MemNo;
    n.AccType = this.accountOpenService.AccType;
    n.MemType = this.accountOpenService.MemType;
    n.NomineeName = this.nomineeForm.value.NomineeName;
    n.PreAddressLine1 = this.nomineeForm.value.PreAddressLine1;
    n.PreVillage = this.nomineeForm.value.PreVillage;
    n.PreVillageCode = this.nomineeForm.value.PreVillageCode;
    n.PreTelephone = this.nomineeForm.value.PreTelephone;
    n.PreMobile = this.nomineeForm.value.PreMobile;
    n.PreEmail = this.nomineeForm.value.PreEmail;
    n.SharePer = this.nomineeForm.value.SharePer;
    n.Relation = this.nomineeForm.value.Relation;
    this.spinner.show();
    if(this.sumOfPercentage>=100)
    {
      alert("Share Percentage should not over 100%")
      return
    }
    this.approveMemberApplicationService
      .nomineeAddTemp(n)
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.initializeForm();
          this.nomineeVillage = { VillageCode: 0 };
          this.getNomineeList();
          this.spinner.hide();
          alert('Nominee Information Saved !');
        },
        (err) => {
          this.spinner.hide();
          this.toastr.error('Something Went Wrong !', 'Error');
        }
      );
  };
  keyPress(event: any) {
    const pattern = /[0-9\, ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  validation() {
    if (this.nomineeForm.controls.PreMobile.value.length < 11) {
      alert('Invalid Mobile Number !');
      this.nomineeForm.controls['PreMobile'].setValue('');
    }
  }
  deleteNomineeee = () => {
    this.selectedNominee = null;
    var Id = this.nomineeForm.value.Id;
    if (this.accountOpenService.checkTemp) {
      this.deleteNomineeeeTemp();
      return;
    } else {
      if (confirm('Are you sure to want to delete the information?')) {
        this.spinner.show();
        this.approveMemberApplicationService
          .deleteNomineeInfo(Id)
          .pipe(first())
          .subscribe(
            (x: any[]) => {
              this.getNomineeList();
              this.initializeForm();
              this.nomineeVillage = { VillageCode: 0 };
              this.updateButtonState = false;
              this.submitButtonState = true;
              this.spinner.hide();
            },
            (err) => {
              this.toaster.error('Something Went Wrong!');
              this.spinner.hide();
            }
          );
      }
    }
  };

  deleteNomineeeeTemp = () => {
    this.selectedNominee = null;
    if (confirm('Are you sure to want to delete information?')) {
      var Id = this.nomineeForm.value.Id;
      this.spinner.show();
      this.approveMemberApplicationService
        .deleteNomineeInfoTemp(Id)
        .pipe(first())
        .subscribe(
          (x: any[]) => {
            this.getNomineeListTemp();
            this.initializeForm();
            this.nomineeVillage = { VillageCode: 0 };
            this.updateButtonState = false;
            this.submitButtonState = true;
            this.spinner.hide();
          },
          (err) => {
            this.toaster.error('Something Went Wrong!');
            this.spinner.hide();
          }
        );
    }
  };

  addressPatch = () => {
    var MemNo = this.approveMemberApplicationService.NewMemNo;
    this.spinner.show();
    this.approveMemberApplicationService
      .SameAdd(MemNo)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          console.log('Addreess', x);
          this.onPreVillage(x.MemPreVillage);

          this.nomineeForm.controls['PreAddressLine1'].setValue(x.MemPreAdd1);
          this.nomineeForm.controls['PreVillage'].setValue(x.MemPreVillage);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  sharePercentageCalculate(event: any) {
    var sum = 0;
    for (var i = 0; i < this.nomineeList.length; i++) {
      if( this.selectedNominee != null && this.nomineeList[i].Id == this.selectedNominee.Id )
        continue;
      sum += this.nomineeList[i].SharePer;
    }
    if (sum + Number(event.target.value) > 100) {
      alert('You can not share more than 100%');
      this.nomineeForm.controls['SharePer'].setValue('');
      return;
    }
  }
}
