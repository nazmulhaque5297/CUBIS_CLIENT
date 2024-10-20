import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { IApplicationCommonModel } from 'src/app/Models/Common.model';
import { AllMemberInformationComponent } from 'src/app/pages/public/all-member-information/all-member-information.component';
import { getCommonData } from 'src/app/selector/user.selectors';
import { EditLoanAccountService } from 'src/app/services/edit-loan-account.service';
import { MemberApplicationService } from 'src/app/services/member-application.service';
import { ReportCommonService } from 'src/app/services/report-common.service';
import {
  EditMemberInformationModel,
  IVillageDetails,
  MemberApplicationInputHelp,
} from '../../models/member-application.model';
import { AccountingService } from '../../services/accounting.service';
import { CreateMemberDdlService } from '../../services/create-member-control-events';
@Component({
  selector: 'app-edit-member-informations',
  templateUrl: './edit-member-informations.component.html',
  styleUrls: ['./edit-member-informations.component.css'],
})
export class EditMemberInformationsComponent implements OnInit {
  memberInfo: EditMemberInformationModel;

  editMemberInformationsForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  public inputHelpData: MemberApplicationInputHelp = new MemberApplicationInputHelp();
  public presentVillage: IVillageDetails;
  public permanentVillage: IVillageDetails;
  public memberName1: string;
  public memberName2: string;
  relationInfo = [];
  memInfoList = [];
  allInfo = [];
  tabularData: boolean = false;
  toogle: boolean = false;
  memInfo: any;
  storefDate: any;
  storetDate: any;
  CommonData: IApplicationCommonModel;
  applicationDate: any;
  storeAppDate: any;

  constructor(
    private accountingService: AccountingService,
    private applicationService: MemberApplicationService,
    private accountingservice: AccountingService,
    public datepipe: DatePipe,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private aService: ReportCommonService,
    private editAccountService: EditLoanAccountService,
    private store: Store,
    private modalService: NgbModal
  ) {
    this.presentVillage = { VillageCode: 0 };
    this.permanentVillage = { VillageCode: 0 };
  }

  ngOnInit(): void {
    this.initializeForm();
    this.tabularData = false;
    this.spinner.show();
    this.applicationService
      .getInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        this.applicationDate = data.ApplicationDate;
        console.log('This is InputData', this.inputHelpData);
        this.editMemberInformationsForm.controls['MemApplicationDate'].setValue(
          data.ApplicationDate
        );
        console.log('AlllData:::->', data);
        this.storefDate = data.ApplicationDate;
        this.spinner.hide();
      });
    this.store
      .pipe(select(getCommonData))
      .subscribe((cd: IApplicationCommonModel) => {
        this.CommonData = cd;
      });
    if (this.CommonData?.MemCollectorFlag) {
      this.editMemberInformationsForm
        .get('MemColCode')
        .setValidators(Validators.required);
    } else {
      this.editMemberInformationsForm.get('MemColCode').clearValidators();
    }
    if (this.CommonData?.MemGroupFlag) {
      this.editMemberInformationsForm
        .get('MemRegNo')
        .setValidators(Validators.required);
    } else {
      this.editMemberInformationsForm.get('MemRegNo').clearValidators();
    }
    this.getRelationInformation();
  }

  private initializeForm() {
    this.editMemberInformationsForm = new FormGroup({
      MemberNo: new FormControl(''),
      MemType: new FormControl('0'),
      MemberName: new FormControl('', [Validators.required]),
      MemberNameBang: new FormControl(''),
      FatherName: new FormControl('', [Validators.required]),
      MotherName: new FormControl('', [Validators.required]),
      SpouseName: new FormControl('', [Validators.required]),
      MemApplicationDate: new FormControl(''),
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
      MemRelationType: new FormControl('0'),
      Nature: new FormControl('0'),
      RelationMemberNo: new FormControl(''),
      FatherNameBang: new FormControl(''),
      MotherNameBang: new FormControl(''),
      SpouseNameBang: new FormControl(''),
      RelationMemberName: new FormControl(''),
    });
  }

  onPreVillage(value: number): any {
    this.applicationService
      .GetVillageDetails(value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.presentVillage = res;
        this.editMemberInformationsForm.controls['PreVillageCode'].setValue(
          this.presentVillage.VillageCode
        );
        this.editMemberInformationsForm.controls['PreVillage'].setValue(
          this.presentVillage.VillageCode
        );
      });
    document.getElementById(`PreMobile`).focus();
  }

  onPerVillage(value: number): any {
    this.applicationService
      .GetVillageDetails(value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.permanentVillage = res;
        this.editMemberInformationsForm.controls['PerVillageCode'].setValue(
          this.permanentVillage.VillageCode
        );
        this.editMemberInformationsForm.controls['PerVillage'].setValue(
          this.permanentVillage.VillageCode
        );
      });
  }
  onGenderChange(value: number): any {
    new CreateMemberDdlService(
      this.editMemberInformationsForm,
      this.inputHelpData
    ).setGender(value);
    document.getElementById(`ReligionCode`).focus();
  }
  onReligionChange(value: number): any {
    new CreateMemberDdlService(
      this.editMemberInformationsForm,
      this.inputHelpData
    ).setReligion(value);
    document.getElementById(`MaritalStatusCode`).focus();
  }
  onMaritalStatusChange(value: number): any {
    new CreateMemberDdlService(
      this.editMemberInformationsForm,
      this.inputHelpData
    ).setMaritalStatus(value);
    document.getElementById(`placeOfBirth`).focus();
  }

  onGroupChange(value: number): any {
    console.log('this is value', value);
    new CreateMemberDdlService(
      this.editMemberInformationsForm,
      this.inputHelpData
    ).setMemberGroup(value);
  }
  onCollectorChange(value: number): any {
    new CreateMemberDdlService(
      this.editMemberInformationsForm,
      this.inputHelpData
    ).setCollector(value);
  }

  onBirthDateChange(value: string) {
    if (value.toString().length > 10)
      value = this.datepipe.transform(value, 'dd/MM/yyyy');
    new CreateMemberDdlService(
      this.editMemberInformationsForm,
      this.inputHelpData
    ).setAge(value);
  }

  getMemberInformation = () => {
    this.tabularData = false;
    this.spinner.show();
    this.accountingservice
      .getMemberInformation(this.editMemberInformationsForm.value.MemberNo)
      .pipe(first())
      .subscribe(
        (x: EditMemberInformationModel) => {
          this.memberInfo = x;
          console.log('This is member info', this.memberInfo);
          if (x.MemberNo == 0 || x.MemberNo == null) {
            alert('Member not found');
            this.spinner.hide();
            this.editMemberInformationsForm.controls['MemberNo'].setValue('');
            this.initializeForm();
            return;
          }
          this.spinner.hide();
          this.editMemberInformationsForm.controls['MemType'].setValue(
            this.memberInfo.MemType
          );
          this.editMemberInformationsForm.controls['MemberName'].setValue(
            this.memberInfo.MemberName
          );
          this.editMemberInformationsForm.controls['MemberNameBang'].setValue(
            this.memberInfo.MemberNameBang
          );
          this.editMemberInformationsForm.controls['FatherName'].setValue(
            this.memberInfo.FatherName
          );
          this.editMemberInformationsForm.controls['MotherName'].setValue(
            this.memberInfo.MotherName
          );
          this.editMemberInformationsForm.controls['SpouseName'].setValue(
            this.memberInfo.SpouseName
          );
          this.editMemberInformationsForm.controls[
            'MemApplicationDate'
          ].setValue(this.memberInfo.OpenDate);
          this.editMemberInformationsForm.controls['DateOfBirth'].setValue(
            this.memberInfo.DateOfBirth
          );
          console.log('this is member age', this.memberInfo.DateOfBirth);
          this.editMemberInformationsForm.controls['MemRegNo'].setValue(
            this.memberInfo.MemRegNo
          );
          this.editMemberInformationsForm.controls['Gender'].setValue(
            this.memberInfo.Gender
          );
          this.editMemberInformationsForm.controls['Religion'].setValue(
            this.memberInfo.Religion
          );
          this.editMemberInformationsForm.controls['MaritalStatus'].setValue(
            this.memberInfo.MaritalStatus
          );
          this.editMemberInformationsForm.controls['PlaceofBirth'].setValue(
            this.memberInfo.PlaceofBirth
          );
          this.editMemberInformationsForm.controls['PreAddressLine1'].setValue(
            this.memberInfo.PreAddressLine1
          );
          this.editMemberInformationsForm.controls['PreVillage'].setValue(
            this.memberInfo.PreVillage
          );
          this.editMemberInformationsForm.controls['PreTelephone'].setValue(
            this.memberInfo.PreTelephone
          );
          this.editMemberInformationsForm.controls['PreMobile'].setValue(
            this.memberInfo.PreMobile
          );
          this.editMemberInformationsForm.controls['PreEmail'].setValue(
            this.memberInfo.PreEmail
          );
          this.editMemberInformationsForm.controls['PerAddressLine1'].setValue(
            this.memberInfo.PerAddressLine1
          );
          this.editMemberInformationsForm.controls['PerVillage'].setValue(
            this.memberInfo.PerVillage
          );
          this.editMemberInformationsForm.controls['MemIntroMemNo'].setValue(
            this.memberInfo.MemIntroMemNo
          );
          this.editMemberInformationsForm.controls['MemIntroMemNo2'].setValue(
            this.memberInfo.MemIntroMemNo2
          );
          this.editMemberInformationsForm.controls['NationalIdNo'].setValue(
            this.memberInfo.NationalIdNo
          );
          this.editMemberInformationsForm.controls['PassportNo'].setValue(
            this.memberInfo.PassportNo
          );
          this.editMemberInformationsForm.controls[
            'PassportIssuePlace'
          ].setValue(this.memberInfo.PassportIssuePlace);
          this.editMemberInformationsForm.controls['TIN'].setValue(
            this.memberInfo.TIN
          );
          this.editMemberInformationsForm.controls['MemBloodGroup'].setValue(
            this.memberInfo.MemBloodGroup
          );
          this.editMemberInformationsForm.controls['Nature'].setValue(
            this.memberInfo.Nature
          );
          if (this.memberInfo.IDIssueDt == '01/01/0001') {
            this.memberInfo.IDIssueDt = '';
          }
          this.editMemberInformationsForm.controls['IDIssueDt'].setValue(
            this.memberInfo.IDIssueDt
          );
          if (this.memberInfo.PassportIssueDate == '01/01/0001') {
            this.memberInfo.PassportIssueDate = '';
          }
          this.editMemberInformationsForm.controls[
            'PassportIssueDate'
          ].setValue(this.memberInfo.PassportIssueDate);

          if (this.memberInfo.PassportExpiryDate == '01/01/0001') {
            this.memberInfo.PassportExpiryDate = '';
          }
          this.editMemberInformationsForm.controls[
            'PassportExpiryDate'
          ].setValue(this.memberInfo.PassportExpiryDate);

          if (this.memberInfo.LastTaxPayDate == '01/01/0001') {
            this.memberInfo.LastTaxPayDate = '';
          }
          this.editMemberInformationsForm.controls['LastTaxPayDate'].setValue(
            this.memberInfo.LastTaxPayDate
          );
          if (this.memberInfo.MemAnniversaryDate == '01/01/0001') {
            this.memberInfo.MemAnniversaryDate = '';
          }
          this.editMemberInformationsForm.controls[
            'MemAnniversaryDate'
          ].setValue(this.memberInfo.MemAnniversaryDate);

          this.editMemberInformationsForm.controls['EmployerName'].setValue(
            this.memberInfo.EmployerName
          );
          this.editMemberInformationsForm.controls['EmployerAddress'].setValue(
            this.memberInfo.EmployerAddress
          );
          this.editMemberInformationsForm.controls['Occupation'].setValue(
            this.memberInfo.Occupation
          );
          this.editMemberInformationsForm.controls['Nationality'].setValue(
            this.memberInfo.Nationality
          );
          this.editMemberInformationsForm.controls['MemColNo'].setValue(
            this.memberInfo.MemColCode
          );
          this.editMemberInformationsForm.controls[
            'MemEduQualification'
          ].setValue(this.memberInfo.MemEduQualification);

          this.editMemberInformationsForm.controls['FatherNameBang'].setValue(
            this.memberInfo.FatherNameBang
          );

          this.editMemberInformationsForm.controls['MotherNameBang'].setValue(
            this.memberInfo.MotherNameBang
          );
          this.editMemberInformationsForm.controls['SpouseNameBang'].setValue(
            this.memberInfo.SpouseNameBang
          );
          this.onPreVillage(this.memberInfo.PreVillage);
          this.onPerVillage(this.memberInfo.PerVillage);
          this.onGenderChange(this.memberInfo.Gender);
          this.onReligionChange(this.memberInfo.Religion);
          this.onMaritalStatusChange(this.memberInfo.MaritalStatus);
          this.onGroupChange(this.memberInfo.MemRegNo);
          this.onCollectorChange(this.memberInfo.MemColCode);
          this.onBirthDateChange(this.memberInfo.DateOfBirth);
          this.getOldMemberInfo1(this.memberInfo.MemIntroMemNo);
          this.getOldMemberInfo2(this.memberInfo.MemIntroMemNo2);
          document.getElementById(`MemberName`).focus();
          setTimeout(() => {
            this.getAllInformation();
          }, 100);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  updateMember = () => {
    if (this.editMemberInformationsForm.invalid) {
      alert('Please Filled the required field!');
      return;
    }
    var mem = new EditMemberInformationModel();
    if (
      this.editMemberInformationsForm.value.MemApplicationDate.toString()
        .length > 10
    )
      mem.OpenDate = this.editAccountService.convertDateToString(
        this.datepipe.transform(
          this.editMemberInformationsForm.value.MemApplicationDate,
          'dd-MM-yyyy'
        )
      );
    else
      mem.OpenDate = this.editMemberInformationsForm.value.MemApplicationDate;

    if (
      this.editMemberInformationsForm.value.DateOfBirth.toString().length > 10
    )
      mem.DateOfBirth = this.editAccountService.convertDateToString(
        this.datepipe.transform(
          this.editMemberInformationsForm.value.DateOfBirth,
          'dd-MM-yyyy'
        )
      );
    else mem.DateOfBirth = this.editMemberInformationsForm.value.DateOfBirth;

    mem.MemberNo = this.editMemberInformationsForm.value.MemberNo;
    mem.MemType = this.editMemberInformationsForm.value.MemType;
    mem.MemberName = this.editMemberInformationsForm.value.MemberName.trim();
    mem.MemberNameBang = this.editMemberInformationsForm.value.MemberNameBang.trim();
    mem.FatherName = this.editMemberInformationsForm.value.FatherName.trim();
    mem.MotherName = this.editMemberInformationsForm.value.MotherName.trim();
    mem.SpouseName = this.editMemberInformationsForm.value.SpouseName.trim();
    mem.Gender = this.editMemberInformationsForm.value.Gender;
    mem.Religion = this.editMemberInformationsForm.value.Religion;
    mem.MaritalStatus = this.editMemberInformationsForm.value.MaritalStatus;
    mem.PlaceofBirth = this.editMemberInformationsForm.value.PlaceofBirth;
    mem.PreAddressLine1 = this.editMemberInformationsForm.value.PreAddressLine1;
    mem.PreVillage = this.editMemberInformationsForm.value.PreVillage;
    mem.PerAddressLine1 = this.editMemberInformationsForm.value.PerAddressLine1;
    mem.PerVillage = this.editMemberInformationsForm.value.PerVillage;
    mem.PreTelephone = this.editMemberInformationsForm.value.PreTelephone.trim();
    mem.PreMobile = this.editMemberInformationsForm.value.PreMobile.trim();
    mem.PreEmail = this.editMemberInformationsForm.value.PreEmail;
    mem.NationalIdNo = this.editMemberInformationsForm.value.NationalIdNo;
    mem.PassportNo = this.editMemberInformationsForm.value.PassportNo;
    mem.PassportIssuePlace = this.editMemberInformationsForm.value.PassportIssuePlace;
    mem.TIN = this.editMemberInformationsForm.value.TIN;
    mem.MemBloodGroup = this.editMemberInformationsForm.value.MemBloodGroup;
    mem.Nature = this.editMemberInformationsForm.value.Nature;
    mem.MotherNameBang = this.editMemberInformationsForm.value.MotherNameBang;
    mem.SpouseNameBang = this.editMemberInformationsForm.value.SpouseNameBang;
    mem.FatherNameBang = this.editMemberInformationsForm.value.FatherNameBang;

    if (this.editMemberInformationsForm.value.IDIssueDt.toString().length > 10)
      mem.IDIssueDt = this.editAccountService.convertDateToString(
        this.datepipe.transform(
          this.editMemberInformationsForm.value.IDIssueDt,
          'dd-MM-yyyy'
        )
      );
    else mem.IDIssueDt = this.editMemberInformationsForm.value.IDIssueDt;

    if (
      this.editMemberInformationsForm.value.PassportIssueDate.toString()
        .length > 10
    )
      mem.PassportIssueDate = this.editAccountService.convertDateToString(
        this.datepipe.transform(
          this.editMemberInformationsForm.value.PassportIssueDate,
          'dd-MM-yyyy'
        )
      );
    else
      mem.PassportIssueDate = this.editMemberInformationsForm.value.PassportIssueDate;

    if (
      this.editMemberInformationsForm.value.PassportExpiryDate.toString()
        .length > 10
    )
      mem.PassportExpiryDate = this.editAccountService.convertDateToString(
        this.datepipe.transform(
          this.editMemberInformationsForm.value.PassportExpiryDate,
          'dd-MM-yyyy'
        )
      );
    else
      mem.PassportExpiryDate = this.editMemberInformationsForm.value.PassportExpiryDate;

    if (
      this.editMemberInformationsForm.value.LastTaxPayDate.toString().length >
      10
    )
      mem.LastTaxPayDate = this.editAccountService.convertDateToString(
        this.datepipe.transform(
          this.editMemberInformationsForm.value.LastTaxPayDate,
          'dd-MM-yyyy'
        )
      );
    else
      mem.LastTaxPayDate = this.editMemberInformationsForm.value.LastTaxPayDate;

    if (
      this.editMemberInformationsForm.value.MemAnniversaryDate.toString()
        .length > 10
    )
      mem.MemAnniversaryDate = this.editAccountService.convertDateToString(
        this.datepipe.transform(
          this.editMemberInformationsForm.value.MemAnniversaryDate,
          'dd-MM-yyyy'
        )
      );
    else
      mem.MemAnniversaryDate = this.editMemberInformationsForm.value.MemAnniversaryDate;

    mem.EmployerName = this.editMemberInformationsForm.value.EmployerName;
    mem.EmployerAddress = this.editMemberInformationsForm.value.EmployerAddress;
    mem.Occupation = this.editMemberInformationsForm.value.Occupation;
    mem.Nationality = this.editMemberInformationsForm.value.Nationality;
    mem.MemRegNo = this.editMemberInformationsForm.value.MemRegNo;
    mem.MemIntroMemNo = this.editMemberInformationsForm.value.MemIntroMemNo;
    mem.MemIntroMemNo2 = this.editMemberInformationsForm.value.MemIntroMemNo2;
    mem.MemEduQualification = this.editMemberInformationsForm.value.MemEduQualification;

    mem.RelaMemNo = this.editMemberInformationsForm.value.RelationMemberNo;
    console.log('---', this.memInfoList);

    mem.RelaMemType =
      this.memInfoList.length == 0 ? 0 : this.memInfoList[0].MemType;
    mem.MemRelationType = this.editMemberInformationsForm.value.MemRelationType;
    let selectedCode = this.relationInfo.find(
      (x) => x.Id == this.editMemberInformationsForm.value.MemRelationType
    );
    console.log('this is selected code', selectedCode);
    if (selectedCode != null) {
      mem.MemRelDesc = selectedCode.Description;
    } else {
      mem.MemRelDesc = '';
    }

    mem.MemColCode = this.editMemberInformationsForm.value.MemColNo;
    console.log('This is member Information', mem);

    this.spinner.show();
    this.accountingservice
      .editMemberInformation(mem)
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          alert('Information Updated !');
          this.presentVillage = { VillageCode: 0 };
          this.permanentVillage = { VillageCode: 0 };
          this.memberName1 = '';
          this.memberName2 = '';
          this.initializeForm();
          location.reload();
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  getAllInformation = () => {
    this.spinner.show();
    this.accountingservice
      .getAllInformation(this.editMemberInformationsForm.value.MemberNo)
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

  getRelationInformation = () => {
    this.spinner.show();
    this.accountingservice
      .getRelationInfo(this.editMemberInformationsForm.value.RelationMemberNo)
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

  // Get Member Info
  getMemInformation = () => {
    if (
      this.editMemberInformationsForm.value.MemberNo ==
      this.editMemberInformationsForm.value.RelationMemberNo
    ) {
      alert('Member Relation No and Member No Cannot be Same');
      this.editMemberInformationsForm.controls['RelationMemberNo'].setValue('');
      return;
    }
    this.spinner.show();
    if (this.editMemberInformationsForm.value.RelationMemberNo == '') {
      this.editMemberInformationsForm.controls['RelationMemberNo'].setValue('');
      this.editMemberInformationsForm.controls['RelationMemberName'].setValue(
        ''
      );
      this.spinner.hide();
      return;
    }
    if (this.editMemberInformationsForm.value.RelationMemberNo == '') {
      this.editMemberInformationsForm.controls['RelationMemberNo'].setValue('');
      this.editMemberInformationsForm.controls['RelationMemberName'].setValue(
        ''
      );
      return;
    }
    this.accountingService
      .GetMemInformation(this.editMemberInformationsForm.value.RelationMemberNo)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          console.log('This is response of x', x);
          this.memInfoList = x;
          this.getRelationInformation();
          if (x[0].Message != null) {
            alert(x[0].Message);
            this.editMemberInformationsForm.controls[
              'RelationMemberNo'
            ].setValue('');
          }
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  keyPress(event: any) {
    const pattern = /[0-9\+\-\, ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  onEnterMemberNoHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`MemberName`).focus();
  }
  onEnterMemColNoHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`MemRegNoCode`).focus();
  }
  onEnterMemRegNoCodeHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`GenderCode`).focus();
  }
  onEnterMemberNameHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`FatherName`).focus();
  }
  onEnterFatherNameHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`MotherName`).focus();
  }
  onEnterMotherNameHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`SpouseName`).focus();
  }
  onEnterSpouseNameHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`AddmissionDate`).focus();
  }
  admissionDate(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`dateFormat`).focus();
  }
  DateOfBirth(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`GenderCode`).focus();
  }
  onEnterGenderCodeHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`ReligionCode`).focus();
  }
  onEnterReligionCodeHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`MaritalStatusCode`).focus();
  }
  onEnterMaritalStatusCodeHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`placeOfBirth`).focus();
  }
  onPOBChange() {
    document.getElementById(`MemIntroMemNo`).focus();
  }
  villageHander(e: KeyboardEvent) {
    document.getElementById(`PreMobile`).focus();
  }
  mobileHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`updateBtn`).focus();
  }
  MemIntro1Key(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`MemIntroMemNo2`).focus();
  }
  MemIntro2Key(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`NationalIdNo`).focus();
  }

  onEnterIdcardHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`PreAddressLine1`).focus();
  }
  onEnterAddLineHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`PreVillageCode`).focus();
  }

  getOldMemberInfo1(value: number): any {
    this.applicationService
      .GetOldMemberInfo(value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.MemberName != null) {
          this.memberName1 = res.MemberName;
        } else {
          this.editMemberInformationsForm.controls['MemIntroMemNo'].setValue(
            ''
          );
          this.memberName1 = '';
        }
      });
  }

  getOldMemberInfo2(value: number): any {
    this.applicationService
      .GetOldMemberInfo(value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.MemberName != null) {
          this.memberName2 = res.MemberName;
        } else {
          this.editMemberInformationsForm.controls['MemIntroMemNo2'].patchValue(
            ''
          );
          this.memberName2 = '';
        }
      });
  }

  dateChecker(e) {
    this.toogle = true;
    if (e.target.value == 5) {
      var value = new Date(
        this.editMemberInformationsForm.value.PassportIssueDate
      );
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
      this.editMemberInformationsForm.controls['PassportExpiryDate'].setValue(
        expLimit
      );
      this.toogle = false;
      return;
    } else if (e.target.value == 10) {
      var value = new Date(
        this.editMemberInformationsForm.value.PassportIssueDate
      );
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
      this.editMemberInformationsForm.controls['PassportExpiryDate'].setValue(
        expLimit
      );
      this.toogle = false;
      return;
    }
  }

  viewTable() {
    this.tabularData = true;
  }

  // show all member info
  showAllMember() {
    const modalRef = this.modalService.open(AllMemberInformationComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.result.then((data) => {
      if (data != 0) {
        this.editMemberInformationsForm.controls['MemberNo'].setValue(data);
        this.getMemberInformation();
      }
    });
  }

  public ChangeDate() {}

  // Date change event
  applicationDateChange() {
    var fv = this.editMemberInformationsForm.value;
    var value = this.datepipe.transform(fv.MemApplicationDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.editMemberInformationsForm.value.MemApplicationDate = formatedValue;
    this.storefDate = formatedValue;

    var value2 = this.datepipe.transform(this.applicationDate, 'dd-MM-yyyy');
    var formatedValue2 = this.aService.convertDateToString(value2);
    this.applicationDate = formatedValue2;
    this.storeAppDate = this.applicationDate;
    console.log(this.editMemberInformationsForm.value);

    console.log('This is inputed date :', this.storefDate);

    console.log('This is process date :', this.applicationDate);

    if (this.storefDate > this.applicationDate) {
      alert('Invallid Future Date!!!');
      this.editMemberInformationsForm.controls['MemApplicationDate'].setValue(
        this.inputHelpData.ApplicationDate
      );
    }
  }

  // applicationDateChange2() {
  //   var fv = this.editMemberInformationsForm.value;
  //   var value = this.datepipe.transform(fv.IssueToDate, 'dd-MM-yyyy');
  //   var formatedValue = this.aService.convertDateToString(value);
  //   this.editMemberInformationsForm.value.IssueToDate = formatedValue;
  //   this.storetDate = formatedValue;
  //   console.log(this.editMemberInformationsForm.value);
  //   console.log(this.storetDate);
  // }
}
