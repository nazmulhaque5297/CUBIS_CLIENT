import {
  Component,
  OnInit,
  AfterViewChecked,
  ChangeDetectorRef,
  Directive,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoanApplicationService } from 'src/app/services/loan-application.service';
import {
  LoanApplicationCreateModel,
  ShareGuarantorDetailsModel,
} from '../../models/loan-application.model';
import { NewLoanApplicationService } from '../../services/loan-application.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { getModuleNo } from 'src/app/selector/user.selectors';
import { select, Store } from '@ngrx/store';
import { ImageProcessingService } from 'src/app/services/image-processing.service';
@Component({
  selector: 'app-new-loan-application',
  templateUrl: './new-loan-application.component.html',
  styleUrls: ['./new-loan-application.component.css'],
})
export class NewLoanApplicationComponent implements OnInit, AfterViewChecked {
  module: string = '1';
  loanApplicationForm: FormGroup;
  totalGuaranty: number = 0;
  newLoanApplication: LoanApplicationCreateModel;
  showModal: boolean = false;
  totalNeed: number;
  imageUrl: string = '';
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private applicationService: LoanApplicationService,
    private newLoanApplicationService: NewLoanApplicationService,
    private route: ActivatedRoute,
    private router: Router,
    private imageService: ImageProcessingService,
    
  ) {}

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
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
  getModuleName(urlData: any) {
    console.log(urlData);
    var result = '';
    for (var i = 1; i < urlData.length; i++) {
      if (urlData[i] == '/') return result;
      result += urlData[i];
    }
  }
  ngOnInit(): void {
    this.initializeForm();
    this.showModal = false;
    var urlData = this.getResolvedUrl(this.route.snapshot);
    urlData = this.getModuleName(urlData);
    console.log(urlData);
    if (urlData == 'booth') this.module = '3';
    else if (urlData == 'accounting') this.module = '1';
  }

  private initializeForm() {
    this.loanApplicationForm = this.fb.group({
      TotalGaurantyAmount: new FormControl(''),
      LoanModule: new FormControl(''),
      
      loanInfo: this.fb.group({
        ApplicationDate: new FormControl(''),
        AccAtyClass:new FormControl(''),
        MemType: new FormControl('0'),
        LoanAccountTypeCode: new FormControl('', [Validators.required]),
        LoanAccountType: new FormControl('0'),
        LoanAccCorrType: new FormControl(null), //as a hidden for correct account type get
        CorrAccountNo: new FormControl(''),
        CorrAccountTitle: new FormControl(''),
        IsAutoTrfCorrAccount: new FormControl(false),
        LoanMemberNo: new FormControl('', [Validators.required]),
        LoanMemberName: new FormControl('', [Validators.required]),
        LoanApplicationAmount: new FormControl('', [Validators.required]),
        LoanInterestRate: new FormControl(''),
        LoanCategoryCode: new FormControl('1'),
        LoanCategory: new FormControl('1'),
        LoanExpDate: new FormControl(''),
        LoanPurposeCode: new FormControl(''),
        LoanPurpose: new FormControl('0'),
        LoanInterestCalMethodCode: new FormControl('1'),
        LoanInterestCalMethod: new FormControl('1'),
        LoanSuretyMemNo: new FormControl(''),
        LoanSuretyMemName: new FormControl(''),
        AccPeriod: new FormControl(''),
        StepsOfLoan: new FormControl(''),
        LoanPerformance: new FormControl(''),
        TotalDepAmount: new FormControl(''),

        LoanNoInstallment: new FormControl(''),
        LoanInstallmentAmount: new FormControl(''),
        LoanLastInstallmentAmount: new FormControl(''),
        LoanFirstInstallmentdate: new FormControl(''),
        LoanGracePeriod: new FormControl(''),
        AccTypeMode: new FormControl(''),
        LoanSecondInstallmentdate: new FormControl(''),
        LoanSuretyMemType: new FormControl(''),
        DepositMode: new FormControl(''),
        LoanCalculationMethod: new FormControl(''),
        PrmLoanGuarantyAmtPerc: new FormControl(''),
      }),
      shareGuarantorInfo: this.fb.group({
        DataShareList: [],
        TotalShareGuarantorAmount: new FormControl(''),
      }),
      depositGuarantorInfo: this.fb.group({
        DataDepositList: [],
        TotalDepositGuarantorAmount: new FormControl(''),
      }),
      propertyGuarantorInfo: this.fb.group({
        DataPropertyList: [],
        TotalPropertyGuarantorAmount: new FormControl(''),
      }),
    });
  }

  checkEverything() {
    if (this.loanApplicationForm.invalid) {
      alert('Please fill all the required field!');
      return;
    }
    if (Number(this.loanApplicationForm.value.TotalGaurantyAmount) == 0) {
      alert('Please add guarantor info!');
      return;
    }
    var gurantyAmtPerc = Number(
      this.loanApplicationForm.value.loanInfo.PrmLoanGuarantyAmtPerc
    );
    var loanAppAmount = Number(
      this.loanApplicationForm.value.loanInfo.LoanApplicationAmount
    );
    console.log(gurantyAmtPerc, '  ', loanAppAmount);
    if (!(gurantyAmtPerc != 0)) {
      this.onCreate();
    } else {
      var num4 = loanAppAmount + (loanAppAmount * gurantyAmtPerc) / 100;
      if (Number(this.totalGuaranty) < num4) {
        console.log('problem is here need to show modal and verify.');
        if (this.module == '3') this.totalNeed = gurantyAmtPerc;
        else this.totalNeed = num4;
        this.showModal = true;
      } else {
        this.onCreate();
      }
    }
  }

  modalYes() {
    this.showModal = false;
    this.onCreate();
  }

  modalNo() {
    this.showModal = false;
  }

  public onCreate(): void {
    this.loanApplicationForm.controls['LoanModule'].setValue(this.module);
    console.log('this is module', this.module);
    var fv = this.loanApplicationForm.value;
    console.log('this is fv value', fv);
    this.newLoanApplication =
      this.newLoanApplicationService.setNewLoanApplication(fv);
    console.log(this.newLoanApplication);
    if (confirm('Are you you want to submit information?')) {
      if (this.applicationService.HoLoadApplication == '1') {
        this.applicationService
          .Insert(this.newLoanApplication)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data) => {
            if (data.Success) {
              // this.toaster.success(
              //   data.Message + data.LastApplicationNo,
              //   'Success'
              // );
              alert(data.Message + data.LastApplicationNo);
              this.ngOnInit();
              setTimeout(() => {
                location.reload();
              }, 1000);
            } else {
              alert(data.Message);
            }
          });
      } else if (this.applicationService.HoLoadApplication == '0') {
        this.applicationService
          .InsertHO(this.newLoanApplication)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data) => {
            if (data.Success) {
              alert('New Generated Account No.:' + data.NewAccNo);
              // this.toaster.success(
              //   data.Message + data.LastApplicationNo,
              //   'Success'
              // );
              this.ngOnInit();
              setTimeout(() => {
                location.reload();
              }, 1000);
              // location.reload();
            } else {
              alert(data.Message);
            }
          });
      } else {
        alert('Something Went Wrong!');
      }
    }
  }

  parentFunction(data) {
    if (data.singleValue == 0) {
      var tot = 0;
      for (var i = 0; i < data.Data.length; i++) {
        tot += data.Data[0].ShareAmount;
      }
      this.totalGuaranty += Number(tot);
      this.loanApplicationForm.controls['TotalGaurantyAmount'].setValue(
        this.totalGuaranty
      );
      this.loanApplicationForm.value.shareGuarantorInfo.DataShareList =
        data.Data;
      this.loanApplicationForm.value.TotalShareGuarantorAmount =
        data.Data.Length != undefined && data.Data.Length != 0
          ? data.Data[0].ShareAmount
          : 0;
    } else {
      this.totalGuaranty += Number(data.Data);
      this.loanApplicationForm.controls['TotalGaurantyAmount'].setValue(
        this.totalGuaranty
      );
    }
  }

  onReturnSchedule() {
    let checkData = this.loanApplicationForm.value;
    if (checkData.loanInfo.LoanAccountTypeCode != '') {
      if (checkData.loanInfo.LoanAccountTypeCode == '670') {
        alert('Return Schedule is not possible on Credit Celling Loan Type.');
      } else {
        if (checkData.loanInfo.LoanApplicationAmount == '') {
          alert('Please Input Loan Application Amount');
        } else if (checkData.loanInfo.LoanNoInstallment == '') {
          alert('Please Input No of Insatallment.');
        } else if (checkData.loanInfo.LoanInterestRate == '') {
          alert('Please Input Interest Rate.');
        } else {
          localStorage.setItem(
            'returnScheduleData',
            JSON.stringify(this.loanApplicationForm.value.loanInfo)
          );
          const url: string = String(
            this.router.createUrlTree(['accounting/loan-return-schedule'])
          );
          window.open(url, '_blank');
        }
      }
    } else {
      alert('Please Select Loan A/C Type');
    }
  }

  ViewImage() {
    console.log('This is memno', this.applicationService.memType,this.applicationService.memNo);
    this.spinner.show();
    this.imageService
      .GetMemberImages(this.applicationService.memNo, this.applicationService.memType)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        this.imageUrl = data.ImagePicture;
      });
  }
  hideImageModal() {
    this.imageUrl = '';
  }
}
