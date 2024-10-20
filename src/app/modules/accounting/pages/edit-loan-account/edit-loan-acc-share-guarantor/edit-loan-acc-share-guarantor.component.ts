import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormGroupDirective, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EditLoanAccountService } from 'src/app/services/edit-loan-account.service';
import { LoanApplicationService } from 'src/app/services/loan-application.service';
import { EditLoanAccShareMemDetails } from '../../../models/edit-loan-account.model';
import { ShareGuarantorDetailsModel, LoanAccountTypeViewModel } from '../../../models/loan-application.model';
import { LoanShareGuarantorEventServiceService } from '../../../services/loan-share-guarantor-event-service.service';

@Component({
  selector: 'app-edit-loan-acc-share-guarantor',
  templateUrl: './edit-loan-acc-share-guarantor.component.html',
  styleUrls: ['./edit-loan-acc-share-guarantor.component.css']
})
export class EditLoanAccShareGuarantorComponent implements OnInit {
  @Output() callParentFunction:EventEmitter<any> = new EventEmitter<any>();
  @Input() formGroupName: string;
  shareGuarantorInfoForm: FormGroup;
  parentForm: FormGroup;
  private loanShareGuarantorService: LoanShareGuarantorEventServiceService;
  private destroy$: Subject<void> = new Subject<void>();
  public memberDetails: ShareGuarantorDetailsModel=new ShareGuarantorDetailsModel();
  public accountTypeDetails:LoanAccountTypeViewModel=new LoanAccountTypeViewModel();
  public dataList:EditLoanAccShareMemDetails[] = [];
  public totalShare:number = 0;
  loanMemberNo:string;

  constructor(
    private rootFormGroup: FormGroupDirective,
    private applicationService: LoanApplicationService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private toaster: ToastrService,
    private editAccountService: EditLoanAccountService,
    ) { }

  ngOnInit(): void {
    this.applicationService.currentLoanMemberNo.subscribe(data=> this.dataList = data);
    this.applicationService.currentTotalShare.subscribe(data=> this.totalShare = data);
    this.parentForm = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
    this.parentForm.controls['DataShareList'].setValue(this.dataList);
    this.parentForm.controls['TotalShareGuarantorAmount'].setValue(this.totalShare);
    this.initializeForm();
    this.accountTypeDetails = this.applicationService.getShareData();
    this.loanShareGuarantorService=new LoanShareGuarantorEventServiceService(this.shareGuarantorInfoForm);
  }
  initializeForm(){
    this.shareGuarantorInfoForm = new FormGroup({
      MemberNo: new FormControl(''),
      MemberName: new FormControl(''),
      NoOfGuarantor: new FormControl(''),
      MemberType: new FormControl(''),
      AccountNo: new FormControl(''),
      ShareAmount: new FormControl(''),
      LoanApplicationNo: new FormControl(''),
    });
  }

  public onMemberNoChange():void{
    let selectAcc = this.dataList.find((x)=> x.MemNo == this.shareGuarantorInfoForm.value.MemberNo);
    if(selectAcc){
      alert("Already Used as a Guarantor.");
    }
    else{
      var fValue = this.shareGuarantorInfoForm.value;
      if(fValue.MemberNo!=""){
        this.editAccountService.editLoanAccShareMemberData(fValue.MemberNo,this.editAccountService.getAccountType()).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
          console.log(data);
          if(data.Success){
            this.shareGuarantorInfoForm.controls['MemberName'].setValue(data.MemberName);
            this.shareGuarantorInfoForm.controls['NoOfGuarantor'].setValue(data.NoGuarantor);
            this.shareGuarantorInfoForm.controls['MemberType'].setValue(data.AccType);
            this.shareGuarantorInfoForm.controls['AccountNo'].setValue(data.AccNo);
            this.shareGuarantorInfoForm.controls['ShareAmount'].setValue(data.AccAmount);
          }
          else{
            alert(data.Message);
            this.initializeForm();
          }
        });
      }
    }
  }
  public addShareData():void{
    let data = {
      MemberNo: this.shareGuarantorInfoForm.value.MemberNo,
      MemberType: this.shareGuarantorInfoForm.value.MemberType,
      LoanApplicationNo: this.editAccountService.getLoanApplicationNo(),
      AccountNo: this.shareGuarantorInfoForm.value.AccountNo,
      ShareAmount: this.shareGuarantorInfoForm.value.ShareAmount,
      NoOfGuarantor: this.shareGuarantorInfoForm.value.NoOfGuarantor,
    }
    this.editAccountService.editLoanAccAddAndGetShareDataToTemp(data).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
      console.log(data);
      this.dataList = [];
      this.totalShare = 0;
      for(var i=0;i<data.length;i++){
        this.dataList.push(data[i]);
        this.totalShare+=data[i].AccAmount;
      }
      let sendData = {
        singleValue:1,
        Data:this.shareGuarantorInfoForm.value.ShareAmount,
      }
      this.callParentFunction.emit(sendData);
      this.initializeForm();
    });
    this.parentForm.controls['DataShareList'].setValue(this.dataList);
    this.parentForm.controls['TotalShareGuarantorAmount'].setValue(this.totalShare);
  }
  public removeShareData():void{
    var fValue = new ShareGuarantorDetailsModel();
    this.loanShareGuarantorService.setShareGuarantorDetails(fValue);
  }
  public deleteData(data:any):void{
    var neg = Number(data.AccAmount) * -1;
    this.editAccountService.editLoanRemoveAndGetShareDataToTemp(data.Id,this.editAccountService.getLoanApplicationNo()).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
      console.log(data);
      this.dataList = [];
      this.totalShare = 0;
      for(var i=0;i<data.length;i++){
        this.dataList.push(data[i]);
        this.totalShare+=data[i].AccAmount;
      }
    });
    let sendData = {
      singleValue:1,
      Data:neg,
    }
    this.callParentFunction.emit(sendData);
    this.parentForm.controls['DataShareList'].setValue(this.dataList);
    this.parentForm.controls['TotalShareGuarantorAmount'].setValue(this.totalShare);
  }
}
