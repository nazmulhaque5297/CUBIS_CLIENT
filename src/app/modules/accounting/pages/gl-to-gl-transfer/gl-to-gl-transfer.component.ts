import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { first, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GlToGlTransferService } from 'src/app/services/gl-to-gl-transfer.service';
import {
  GlToGlFromModel,
  GlToGlToTransModel,
  GlTranferDataModel,
} from '../../models/Gl-To-Gl-From.model';
import {
  TransferFromModel,
  TransferToModel,
} from '../../models/special-account-balance-transfer.model';
import { IdDescription } from 'src/app/interfaces/id-description';
import { SelectListFilter } from 'src/app/filters/select-list-filter';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-gl-to-gl-transfer',
  templateUrl: './gl-to-gl-transfer.component.html',
  styleUrls: ['./gl-to-gl-transfer.component.css'],
})
export class GlToGlTransferComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  GlToGlTransferForm: FormGroup;
  IsMiscAccTypeFromstatus: boolean = true;
  IsMiscAccTypeTostatus: boolean = true;
  public glAmtFromModel: GlToGlFromModel = new GlToGlFromModel();
  public glToGlToTransModel: GlToGlToTransModel = new GlToGlToTransModel();
  public transferModel: GlTranferDataModel = new GlTranferDataModel();
  public fromMemberDetails: TransferFromModel = new TransferFromModel();
  public toMemberDetails: TransferToModel = new TransferToModel();
  public fromAccountTypeList: IdDescription[];
  public toAccountTypeList: IdDescription[];
  demo: any;
  constructor(
    private glTransferService: GlToGlTransferService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }
  private initializeForm() {
    this.GlToGlTransferForm = new FormGroup({
      FromMemberNo: new FormControl('', [Validators.required]),
      FromGlCode: new FormControl(''),
      ToGlCode: new FormControl(''),
      FromAccountTypeCode: new FormControl(''),
      FromAccountTypeId: new FormControl(''),
      IsMiscAccTypeFrom: new FormControl(false),
      IsMiscAccTypeTo: new FormControl(false),
      ToAccountTypeCode: new FormControl(''),
      ToAccountTypeId: new FormControl(''),
      TransactionAmount: new FormControl(''),
      ToMemberNo: new FormControl(''),
      TransactionDate: new FormControl(''),
      VoucherNo: new FormControl(''),
      ToGlCodeNotMisc: new FormControl(''),
      FromGlCodeNon: new FormControl(''),
      ToAccNo: new FormControl(''),
    });
    this.pageLoad();
  }

  public pageLoad() {
    this.glTransferService
      .getAccListDetails()
      .pipe(first())
      .subscribe((data: any) => {
        this.fromAccountTypeList = data.AccountTyeList;
        this.toAccountTypeList = data.AccountTyeList;
        // console.log('AccData==>', this.fromAccountTypeList);
      });
  }

  public Transfer() {
    if (this.IsMiscAccTypeFromstatus && this.IsMiscAccTypeTostatus) {
      this.spinner.show();
      console.log('Calling MISC To MISC');
      this.transferModel.FromGlAccNo = this.GlToGlTransferForm.controls[
        'FromGlCode'
      ].value;
      this.transferModel.ToGlAccNo = this.GlToGlTransferForm.controls[
        'ToGlCode'
      ].value;

      if (
        this.GlToGlTransferForm.value.TransactionDate.toString().length > 10
      ) {
        var testDate = this.GlToGlTransferForm.controls['TransactionDate']
          .value;
        this.transferModel.TransactionDate = this.datepipe.transform(
          testDate,
          'dd/MM/yyyy'
        );
        console.log('coming here==> ', this.transferModel.TransactionDate);
      }
      this.transferModel.VoucherNo = this.GlToGlTransferForm.controls[
        'VoucherNo'
      ].value;

      this.transferModel.ToAccNo = this.GlToGlTransferForm.controls[
        'ToAccNo'
      ].value;

      console.log('AllData===>', this.transferModel);
      this.glTransferService
        .amtTransfer(this.transferModel)
        .pipe(takeUntil(this.destroy$))
        .subscribe((response) => {
          this.spinner.hide();
          alert(response.Success);
          // alert("Transfer Successfull!!");
          location.reload();
        });
    }
  }

  // public onFromGLChange(e)
  // {
  //   this.spinner.show();
  //   var GlAccNo=e;
  //   console.log("GlAccNo",GlAccNo);
  //   this.glTransferService.getFromGlValue(GlAccNo)
  //   .pipe(takeUntil(this.destroy$))
  //   .subscribe((response)=>
  //   {
  //     console.log("Amount==>",response);
  //     this.fromMemberDetails=response;
  //     this.spinner.hide();

  //   });

  // }

  // public ToGlCodeChange(e)
  // {
  //   this.spinner.show();
  //   var GlAccNo=e;
  //   console.log("GlAccNo",GlAccNo);
  //   this.glTransferService.getToGlTrnasValue(GlAccNo)
  //   .pipe(takeUntil(this.destroy$))
  //   .subscribe((response)=>
  //   {
  //     console.log("Amount==>",response);
  //     this.toMemberDetails=response;
  //     this.spinner.hide();

  //   });

  // }

  // onFromMemberChange(value: number): any {
  //   this.spinner.show();
  //   this.glTransferService
  //     .getMemberDetails(value)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((sResponse) => {

  //       console.log("AllMemberInfo===>",sResponse)
  //       this.fromMemberDetails.Member = sResponse;
  //       this.fromMemberDetails.AccountNo = null;
  //       this.fromMemberDetails.Balance = null;
  //       this.fromMemberDetails.LienAmount = null;
  //       this.fromMemberDetails.LoanAmount = null;
  //       this.GlToGlTransferForm.controls['FromAccountTypeCode'].setValue('');
  //       this.GlToGlTransferForm.controls['FromAccountTypeId'].setValue('');
  //       // this.fromAccountTypeList = sResponse.AccountTyeList;
  //       this.spinner.hide();
  //     });
  // }

  // public onToMemberChange(value: number): any {
  //   console.log("Hello");
  //   this.spinner.show();
  //   this.glTransferService
  //     .getMemberDetails(value)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((sResponse) => {

  //       console.log("AllMemberInfo===>",sResponse)

  //       this.toMemberDetails.Member = sResponse;
  //       this.toMemberDetails.AccountNo = null;
  //       this.toMemberDetails.Balance = null;
  //       this.GlToGlTransferForm.controls['FromAccountTypeCode'].setValue('');
  //       this.GlToGlTransferForm.controls['FromAccountTypeId'].setValue('');
  //       this.spinner.hide();
  //       //this.fromAccountTypeList = sResponse.AccountTyeList;
  //     });
  // }

  // onFromTypeChange(value: number): any {
  //   console.log('This is value>>', value);
  //   this.spinner.show();
  //   var item = new SelectListFilter().getItem(this.fromAccountTypeList, value);
  //   this.GlToGlTransferForm.controls['FromAccountTypeCode'].setValue(
  //     item != null ? item.Id : value
  //   );
  //   var formValue = this.GlToGlTransferForm.value;
  //   this.fromMemberDetails.AccTypeId = formValue.FromAccountTypeId;
  //   this.fromMemberDetails.AccountNo = null;
  //   this.fromMemberDetails.Balance = null;

  //   this.glTransferService
  //     .GetFromMemberDetails({ data: this.fromMemberDetails })
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe(
  //       (sResponse) => {

  //         console.log("AllFrom Data",sResponse)
  //         if (sResponse.AccountNo) {
  //           this.fromMemberDetails = sResponse;
  //           this.spinner.hide();
  //         } else {
  //           this.spinner.hide();
  //           this.toMemberDetails = sResponse;
  //           this.fromMemberDetails.AccountNo = null;
  //           this.fromMemberDetails.Balance = null;
  //           alert('Account Not Found!');
  //         }
  //       },
  //       (err) => {
  //         this.spinner.hide();
  //         this.fromMemberDetails = null;
  //         alert('Something went wrong.');
  //       }
  //     );
  //   //document.getElementById(`ToMemberNo`).focus();
  // }

  // onToTypeChange(value: number): any {
  //   this.spinner.show();
  //   var item = new SelectListFilter().getItem(this.toAccountTypeList, value);
  //   this.GlToGlTransferForm.controls['ToAccountTypeCode'].setValue(
  //     item != null ? item.Id : value
  //   );
  //   var formValue = this.GlToGlTransferForm.value;
  //   this.toMemberDetails.AccTypeId = formValue.ToAccountTypeId;
  //   this.toMemberDetails.AccountNo = null;
  //   this.toMemberDetails.Balance = null;

  //   console.log("Testt",this.toMemberDetails)
  //   this.glTransferService
  //     .GetToMemberDetails(this.toMemberDetails)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe(
  //       (sResponse) => {

  //         console.log("Testttss==>",sResponse)
  //         if (sResponse.AccountNo) {
  //           this.toMemberDetails = sResponse;
  //           this.spinner.hide();
  //         } else {
  //           this.spinner.hide();
  //           this.toMemberDetails = sResponse;
  //           this.toMemberDetails.AccountNo = null;
  //           this.toMemberDetails.Balance = null;
  //           alert('Account Not Found!');
  //         }
  //       },
  //       (err) => {
  //         this.spinner.hide();
  //         this.fromMemberDetails = null;
  //         alert('Something went wrong.');
  //       }
  //     );

  // }
}
