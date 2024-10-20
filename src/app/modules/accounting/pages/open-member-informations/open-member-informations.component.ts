import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { select, Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { IApplicationCommonModel } from 'src/app/Models/Common.model';
import { getCommonData } from 'src/app/selector/user.selectors';
import { MemberApplicationService } from 'src/app/services/member-application.service';
import { OpenMemberInformationService } from 'src/app/services/open-member-information.service';
import {
  IVillageDetails,
  MemberApplicationInputHelp,
  MemberApplicationModel,
  OldMemberInfo,
} from '../../models/member-application.model';
import { AccountingService } from '../../services/accounting.service';
import { ApproveMemberApplicationService } from '../../services/approve-member-application.service';
import { CreateMemberDdlService } from '../../services/create-member-control-events';

@Component({
  selector: 'app-open-member-informations',
  templateUrl: './open-member-informations.component.html',
  styleUrls: ['./open-member-informations.component.css'],
})
export class OpenMemberInformationsComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public inputHelpData: MemberApplicationInputHelp =
    new MemberApplicationInputHelp();
  public detailsData: MemberApplicationModel = new MemberApplicationModel();
  memberApplicationForm: FormGroup;
  public presentVillage: IVillageDetails;
  public permanentVillage: IVillageDetails;
  public OldMemberInfo: OldMemberInfo;
  public memberName1: string;
  public memberName2: string;
  toogle: boolean = false;
  module: string = '1';
  LastMemNo: string = '';
  mem: boolean = false;
  nonmem: boolean = false;
  intial: boolean = true;
  CommonData: IApplicationCommonModel;
  tabularData: boolean = false;
  relationInfo = [];
  memInfoList = [];
  allInfo = [];
  ManualFlag:boolean;
  constructor(
    private accountingService: AccountingService,
    private applicationService: MemberApplicationService,
    private openMemberInformationService: OpenMemberInformationService,
    public datepipe: DatePipe,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private approveMemberApplicationService: ApproveMemberApplicationService
  ) {
    this.presentVillage = { VillageCode: 0 };
    this.permanentVillage = { VillageCode: 0 };
  }

  getResolvedUrl(route: ActivatedRouteSnapshot): string {
    let url = route.pathFromRoot
      .map((v) => v.url.map((segment) => segment.toString()).join('/'))
      .join('/');
    const queryParam = route.queryParamMap;
    if (queryParam.keys.length > 0) {
      url +=
        '?' +
        queryParam.keys
          .map((key) =>
            queryParam
              .getAll(key)
              .map((value) => key + '=' + value)
              .join('&')
          )
          .join('&');
    }
    return url;
  }
  ngOnInit(): void {
    this.tabularData = false;
    this.initializeForm();
    this.spinner.show();
    this.applicationService
      .getInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        console.log("HelllpData--->",data)
        this.memberApplicationForm.controls['ApplicationDate'].setValue(
          data.ApplicationDate
        );
        this.spinner.hide();
      });
    this.store
      .pipe(select(getCommonData))
      .subscribe((cd: IApplicationCommonModel) => {
        this.CommonData = cd;
      });
    if (this.CommonData?.MemCollectorFlag) {
      this.memberApplicationForm
        .get('MemColCode')
        .setValidators(Validators.required);
    } else {
      this.memberApplicationForm.get('MemColCode').clearValidators();
    }
    if (this.CommonData?.MemGroupFlag) {
      this.memberApplicationForm
        .get('MemRegNo')
        .setValidators(Validators.required);
    } else {
      this.memberApplicationForm.get('MemRegNo').clearValidators();
    }
    var urlData = this.getResolvedUrl(this.route.snapshot);
    urlData = this.getModuleName(urlData);
    console.log(urlData);
    if (urlData == 'booth') this.module = '3';
    else if (urlData == 'accounting') this.module = '1';
    this.getRelationInformation();
  }
  getModuleName(urlData: any) {
    console.log(urlData);
    var result = '';
    for (var i = 1; i < urlData.length; i++) {
      if (urlData[i] == '/') return result;
      result += urlData[i];
    }
  }

  private initializeForm() {
    this.memberApplicationForm = new FormGroup({
      ApplicationDate: new FormControl(''),
      MemType: new FormControl('0'),
      MemTypeCode: new FormControl(''),
      MemberName: new FormControl('', [Validators.required]),
      MemberNameBang: new FormControl(''),
      FatherName: new FormControl('', [Validators.required]),
      MotherName: new FormControl('', [Validators.required]),
      SpouseName: new FormControl('', [Validators.required]),
      DateOfBirth: new FormControl(''),
      Age: new FormControl(null),
      MemColCode: new FormControl('0'),
      MemColNo: new FormControl(''),
      MemRegNo: new FormControl('0'),
      MemRegNoCode: new FormControl(''),
      Gender: new FormControl('0', [Validators.required]),
      GenderCode: new FormControl(''),
      Religion: new FormControl('0', [Validators.required]),
      ReligionCode: new FormControl(''),
      MaritalStatus: new FormControl('0', [Validators.required]),
      MaritalStatusCode: new FormControl(''),
      PlaceofBirth: new FormControl('0'),
      MemIntroMemNo: new FormControl(''),
      MemIntroMemNo2: new FormControl(''),
      PreAddressLine1: new FormControl(''),
      PreVillage: new FormControl('0'),
      PreVillageCode: new FormControl(''),
      PreTelephone: new FormControl(''),
      PreMobile: new FormControl('', [Validators.required]),
      PreEmail: new FormControl(null),
      PerAddressLine1: new FormControl(''),
      PerVillage: new FormControl('0'),
      PerVillageCode: new FormControl(''),
      NationalIdNo: new FormControl(''),
      PassportNo: new FormControl(''),
      PassportIssuePlace: new FormControl(''),
      TIN: new FormControl(''),
      MemBloodGroup: new FormControl('0'),
      IDIssueDt: new FormControl(''),
      PassportIssueDate: new FormControl(''),
      PassportExpiryDate: new FormControl(''),
      LastTaxPayDate: new FormControl(''),
      MemAnniversaryDate: new FormControl(''),
      EmployerName: new FormControl(''),
      EmployerAddress: new FormControl(''),
      Occupation: new FormControl('0'),
      Nationality: new FormControl('0'),
      MemEduQualification: new FormControl(''),
      MemFNameBang: new FormControl(''),
      MemMNameBang: new FormControl(''),
      MemSpouseNameBang: new FormControl(''),
      RelationMemberNo: new FormControl(''),
      MemRelationType: new FormControl('0'),
    });
    this.memberApplicationForm.controls['ApplicationDate'].setValue(
      this.inputHelpData.ApplicationDate
    );
    this.intial = true;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPreVillage(value: number): any {
    this.applicationService
      .GetVillageDetails(value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.presentVillage = res;
        this.memberApplicationForm.controls['PreVillageCode'].setValue(
          this.presentVillage.VillageCode
        );
        this.memberApplicationForm.controls['PreVillage'].setValue(
          this.presentVillage.VillageCode
        );
      });
    document.getElementById(`PreMobile`).focus();
  }

  getOldMemberInfo1(value: number): any {
    this.applicationService
      .GetOldMemberInfo(value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.MemberName != null) {
          this.memberName1 = res.MemberName;
        } else {
          this.memberApplicationForm.controls['MemIntroMemNo'].setValue('');
          this.memberName1 = '';
        }
      });
      document.getElementById(`MemIntroMemNo2`).focus();
  }

  getOldMemberInfo2(value: number): any {
    this.applicationService
      .GetOldMemberInfo(value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.MemberName != null) {
          this.memberName2 = res.MemberName;
        } else {
          this.memberApplicationForm.controls['MemIntroMemNo2'].patchValue('');
          this.memberName2 = '';
        }
      });
      document.getElementById(`NationalIdNo`).focus();
  }
  getLastMemNO(value: any): any {
    this.openMemberInformationService
      .getMemNo(value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res != null) {
          this.LastMemNo = res.toString();
        } else {
          this.LastMemNo = '';
        }
      });
  }

  onPerVillage(value: number): any {
    this.applicationService
      .GetVillageDetails(value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.permanentVillage = res;
        this.memberApplicationForm.controls['PerVillageCode'].setValue(
          this.permanentVillage.VillageCode
        );
        this.memberApplicationForm.controls['PerVillage'].setValue(
          this.permanentVillage.VillageCode
        );
      });
  }

  onMemberTypeChange(value: number): any {
    new CreateMemberDdlService(
      this.memberApplicationForm,
      this.inputHelpData
    ).setMemberType(value);
    if (value == 1) {
      this.mem = true;
      this.nonmem = false;
      this.intial = false;
    } else if (value == 2) {
      this.nonmem = true;
      this.mem = false;
      this.intial = false;
    }
    this.getLastMemNO(value);
    if(this.memberApplicationForm.controls['MemTypeCode'].value=='')
    {
      document.getElementById(`MemTypeCode`).focus();
      return

    }
    document.getElementById(`MemberName`).focus();
  }

  onGenderChange(value: number): any {
    new CreateMemberDdlService(
      this.memberApplicationForm,
      this.inputHelpData
    ).setGender(value);
    document.getElementById(`ReligionCode`).focus();
  }

  onReligionChange(value: number): any {
    new CreateMemberDdlService(
      this.memberApplicationForm,
      this.inputHelpData
    ).setReligion(value);
    document.getElementById(`MaritalStatusCode`).focus();
  }

  onMaritalStatusChange(value: number): any {
    new CreateMemberDdlService(
      this.memberApplicationForm,
      this.inputHelpData
    ).setMaritalStatus(value);
    document.getElementById(`PlaceofBirth`).focus();
  }

  onGroupChange(value: number): any {
    new CreateMemberDdlService(
      this.memberApplicationForm,
      this.inputHelpData
    ).setMemberGroup(value);
    document.getElementById(`PreAddressLine1`).focus();
  }

  onCollectorChange(value: number): any {
    new CreateMemberDdlService(
      this.memberApplicationForm,
      this.inputHelpData
    ).setCollector(value);
  }

  onBirthDateChange(value: string) {
    value = this.datepipe.transform(value, 'dd/MM/yyyy');
    new CreateMemberDdlService(
      this.memberApplicationForm,
      this.inputHelpData
    ).setAge(value);
    document.getElementById(`GenderCode`).focus();
  }
  onPOBChange() {
    document.getElementById(`MemIntroMemNo`).focus();
  }
  FillParmanentAddress(): void {
    if (!this.memberApplicationForm.controls['PreVillageCode'].value) {
      this.toaster.warning('Please fill Present Address First!');
      return;
    }
    this.permanentVillage = this.presentVillage;
    this.memberApplicationForm.controls['PerVillageCode'].setValue(
      this.presentVillage.VillageCode
    );
    this.memberApplicationForm.controls['PerVillage'].setValue(
      this.presentVillage.VillageCode
    );
    this.memberApplicationForm.controls['PerAddressLine1'].setValue(
      this.memberApplicationForm.controls['PreAddressLine1'].value ?? ''
    );
  }

  onCreate(): void {
    if (this.memberApplicationForm.invalid) {
      alert('Please fill all the required field!');
      return;
    }
    this.spinner.show();
    var fValue = this.memberApplicationForm.value;
    fValue.MemberNo = +this.LastMemNo + 1;
    fValue.RelaMemNo = this.memberApplicationForm.value.RelationMemberNo;
    console.log('---', this.memInfoList);
    fValue.RelaMemType =
      this.memInfoList.length == 0 ? 0 : this.memInfoList[0].MemType;

      if(fValue.MemTypeCode==1 && fValue.Age<18)
      {
        alert("For Member Age Cannot Be Less Than 18");
        this.spinner.hide();
        document.getElementById(`dateFormat`).focus();
        return;

      }
      // else if(fValue.MemTypeCode==2 && fValue.Age>18)
      // {
      //   alert("For Non Member Age Cannot Be Greater Than 18");
      //   this.spinner.hide();
      //   document.getElementById(`dateFormat`).focus();
      //   return;
      // }
    fValue.MemRelationType = this.memberApplicationForm.value.MemRelationType;
    let selectedCode = this.relationInfo.find(
      (x) => x.Id == this.memberApplicationForm.value.MemRelationType
    );
    console.log('this is selected code', selectedCode);
    if (selectedCode != null) {
      fValue.MemRelDesc = selectedCode.Description;
    } else {
      fValue.MemRelDesc = '';
    }
    console.log('this is fvalue', fValue);
    this.openMemberInformationService
      .Insert(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.spinner.hide();
          console.log('AllResponse Data:::--->>', res);
          alert('Generated New Member No ' + fValue.MemberNo);
          this.openMemberInformationService.MemNo = fValue.MemberNo;
          this.openMemberInformationService.MemType = fValue.MemTypeCode;
          this.approveMemberApplicationService.NewMemNo = fValue.MemberNo;
          this.approveMemberApplicationService.MemType = fValue.MemTypeCode;
          this.initializeForm();
          setTimeout(() => {
            this.router.navigate([
              'accounting/open-member-information-auto-acc',
            ]);
          }, 1000);
        },

        (err) => {
          this.spinner.hide();
          this.toaster.error('Something Went Wrong !', 'Error');
        }
      );
  }

  // Keypress event that only accept number not string

  keyPress(event: any) {
    const pattern = /[0-9\, ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  validation() {
    if (this.memberApplicationForm.controls.PreMobile.value.length < 11) {
      alert('Invalid Mobile Number !');
      this.memberApplicationForm.controls['PreMobile'].setValue('');
      return;
    }
  }
  dateChecker(e) {
    this.toogle = true;
    if (e.target.value == 5) {
      var value = new Date(this.memberApplicationForm.value.PassportIssueDate);
      var pickedMonth = (new Date(value).getMonth() + 1).toString();
      var pickedDate = new Date(value).getDate().toString();
      var pickedYear = new Date(value).getFullYear() + 5;
      if (pickedMonth.length == 1) {
        pickedMonth = '0' + pickedMonth;
      }
      if (pickedDate.length == 1) {
        pickedDate = '0' + pickedDate;
      }
      var expLimit = (
        pickedDate +
        '/' +
        pickedMonth +
        '/' +
        pickedYear
      ).toString();
      this.memberApplicationForm.controls['PassportExpiryDate'].setValue(
        expLimit
      );
      this.toogle = false;
      document.getElementById(`PassportIssuePlace`).focus();
      return;
    } else if (e.target.value == 10) {
      var value = new Date(this.memberApplicationForm.value.PassportIssueDate);
      var pickedMonth = (new Date(value).getMonth() + 1).toString();
      var pickedDate = new Date(value).getDate().toString();
      var pickedYear = new Date(value).getFullYear() + 10;
      if (pickedMonth.length == 1) {
        pickedMonth = '0' + pickedMonth;
      }
      if (pickedDate.length == 1) {
        pickedDate = '0' + pickedDate;
      }
      var expLimit = (
        pickedDate +
        '/' +
        pickedMonth +
        '/' +
        pickedYear
      ).toString();
      this.memberApplicationForm.controls['PassportExpiryDate'].setValue(
        expLimit
      );

      this.toogle = false;
      document.getElementById(`PassportIssuePlace`).focus();
      return;
    }
  }
  // Datevalidation() {
  //   var value = new Date(this.memberApplicationForm.value.PassportExpiryDate);
  //   var pickedYear = new Date(value).getFullYear();
  //   var EpickedMonth = new Date(value).getMonth();
  //   var EpickedDate = new Date(value).getDate();
  //   if (pickedYear > this.expLimit) {
  //     alert('Passport Expired Year Limit Exists');
  //     this.memberApplicationForm.value.PassportExpiryDate = 0;
  //     return;
  //   } else if (pickedYear > this.expLimit && EpickedMonth > this.pickedMonth) {
  //     alert('Passport Expired Year Limit Exists');
  //     return;
  //   } else if (
  //     pickedYear > this.expLimit &&
  //     EpickedMonth > this.pickedMonth &&
  //     EpickedDate > this.pickedDate
  //   ) {
  //     alert('Passport Expired Year Limit Exists');
  //     return;
  //   }
  // }

  // Enter Key Event

  onEnterMemNameHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if(this.memberApplicationForm.controls['MemberName'].value=='')
    {
      document.getElementById(`MemberName`).focus();
      return

    }
    document.getElementById(`FatherName`).focus();
  }

  onEnterFNameHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if(this.memberApplicationForm.controls['FatherName'].value=='')
    {
      document.getElementById(`FatherName`).focus();
      return

    }
    document.getElementById(`MotherName`).focus();
  }

  onEnterMNameHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if(this.memberApplicationForm.controls['MotherName'].value=='')
    {
      document.getElementById(`MotherName`).focus();
      return

    }
    document.getElementById(`SpouseName`).focus();
  }

  onEnterSNameHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if(this.memberApplicationForm.controls['SpouseName'].value=='')
    {
      document.getElementById(`SpouseName`).focus();
      return

    }
    document.getElementById(`dateFormat`).focus();
  }
  onEnterGenderHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`ReligionCode`).focus();
  }
  onEnterReligionHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if(this.memberApplicationForm.controls['ReligionCode'].value=='')
    {
      document.getElementById(`ReligionCode`).focus();
      return

    }
    document.getElementById(`MaritalStatusCode`).focus();
  }
  onEnterMaritalHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if(this.memberApplicationForm.controls['MaritalStatusCode'].value=='')
    {
      document.getElementById(`MaritalStatusCode`).focus();
      return

    }
    document.getElementById(`PlaceofBirth`).focus();
  }

  onEnterDOBHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;

    if(this.memberApplicationForm.controls['DateOfBirth'].value=='')
    {
      document.getElementById(`dateFormat`).focus();
      return

    }
    document.getElementById(`GenderCode`).focus();
  }

  onEnterGHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`PreAddressLine1`).focus();
  }

  onEnterPreAddressLinelHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`PreVillageCode`).focus();
  }

  onEnterPreTelephoneHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`PreMobile`).focus();
  }

  onEnterPreMobileHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if(this.memberApplicationForm.controls['PreMobile'].value=='')
    {
      document.getElementById(`PreMobile`).focus();
      return

    }
    document.getElementById(`PreEmail`).focus();
  }
  emailHandler(e:KeyboardEvent)
  {
    if (e.keyCode != 13) return;
    document.getElementById(`submitBtn`).focus();

  }
  onEnterPerAddressLine1Handler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`PerVillageCode`).focus();
  }
  onEnterMemberNameBangHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`MemFNameBang`).focus();
  }
  onEnterMemFNameBangHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`MemMNameBang`).focus();
  }
  onEnterMemMNameBangHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`MemSpouseNameBang`).focus();
  }
  onEnterIDNoHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`PreAddressLine1`).focus();
  }
  addLine(e:KeyboardEvent)
  {
    if (e.keyCode != 13) return;
    document.getElementById(`PreMobile`).focus();

  }
  onEnterPassHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`dateFormatP`).focus();
  }
  onEnterPassIssPHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`TIN`).focus();
  }
  onEnterTINHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`dateFormatLT`).focus();
  }


  introduceMem1(e:KeyboardEvent)
  {
    if (e.keyCode != 13) return;
    document.getElementById(`MemIntroMemNo2`).focus();

  }
  introduceMem2(e:KeyboardEvent)
  {
    if (e.keyCode != 13) return;
    document.getElementById(`NationalIdNo`).focus();

  }

  onEnterEmpHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`EmployerAddress`).focus();
  }

  onEnterEmpAddHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`Occupation`).focus();
  }
  onTaxDateChange() {
    document.getElementById(`MemBloodGroup`).focus();
  }

  onBloodGroupChange(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`dateFormatDOA`).focus();
  }
  onBloodChange() {
    document.getElementById(`dateFormatDOA`).focus();
  }
  onAnniversaryDateChange() {
    document.getElementById(`EmployerName`).focus();
  }
  onNationalityChange() {
    document.getElementById(`MemEduQualification`).focus();
  }
  OnOccupation() {
    document.getElementById(`Nationality`).focus();
  }

  // Get Member Info
  getMemInformation = () => {
    var fValue = this.memberApplicationForm.value;
    fValue.MemberNo = +this.LastMemNo + 1;
    // if (
    //   this.memberApplicationForm.value.MemberNo ==
    //   this.memberApplicationForm.value.RelationMemberNo
    // ) {
    //   alert('Member Relation No and Member No Cannot be Same');
    //   this.memberApplicationForm.controls['RelationMemberNo'].setValue('');
    //   return;
    // }
    this.spinner.show();
    this.accountingService
      .GetMemInformation(this.memberApplicationForm.value.RelationMemberNo)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          console.log('This is response of x', x);
          this.memInfoList = x;
          this.getRelationInformation();
          if (x[0].Message != null) {
            alert(x[0].Message);
            this.memberApplicationForm.controls['RelationMemberNo'].setValue(
              ''
            );
          }
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  getRelationInformation = () => {
    this.spinner.show();
    this.accountingService
      .getRelationInfo(this.memberApplicationForm.value.RelationMemberNo)
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.relationInfo = x;
          console.log('This is relation information', this.relationInfo);
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  getAllInformation = () => {
    var fValue = this.memberApplicationForm.value;
    fValue.MemberNo = +this.LastMemNo + 1;
    this.spinner.show();
    this.accountingService
      .getAllInformation(this.memberApplicationForm.value.MemberNo)
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.allInfo = x;
          console.log('This is relation information', this.allInfo);
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  viewTable() {
    this.tabularData = true;
  }
}
