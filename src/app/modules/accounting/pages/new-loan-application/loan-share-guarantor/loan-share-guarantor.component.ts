import { Component, Input, OnInit, Output, EventEmitter,Directive } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoanApplicationService } from 'src/app/services/loan-application.service';
import { ShareGuarantorDetailsModel, LoanAccountTypeViewModel } from '../../../models/loan-application.model';
import { LoanShareGuarantorEventServiceService } from '../../../services/loan-share-guarantor-event-service.service';
@Component({
  selector: 'app-loan-share-guarantor',
  templateUrl: './loan-share-guarantor.component.html',
  styleUrls: ['./loan-share-guarantor.component.css']
})
export class LoanShareGuarantorComponent implements OnInit {
  @Output() callParentFunction:EventEmitter<any> = new EventEmitter<any>();
  @Input() formGroupName: string;
  shareGuarantorInfoForm: FormGroup;
  parentForm: FormGroup;
  private loanShareGuarantorService: LoanShareGuarantorEventServiceService;
  private destroy$: Subject<void> = new Subject<void>();
  public memberDetails: ShareGuarantorDetailsModel=new ShareGuarantorDetailsModel();
  public accountTypeDetails:LoanAccountTypeViewModel=new LoanAccountTypeViewModel();
  public dataList:ShareGuarantorDetailsModel[] = [];
  public totalShare:number = 0;
  loanMemberNo:string;

  constructor(private rootFormGroup: FormGroupDirective,
    private applicationService: LoanApplicationService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.applicationService.currentLoanMemberNo.subscribe(data=> this.dataList = data);
    this.applicationService.currentTotalShare.subscribe(data=> this.totalShare = data);
    this.parentForm = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
    this.shareGuarantorInfoForm = new FormGroup({
      MemberNo: new FormControl(''),
      MemberName: new FormControl(''),
      NoOfGuarantor: new FormControl(''),
      AccountType: new FormControl(''),
      AccountNo: new FormControl(''),
      ShareAmount: new FormControl(''),
      MemberType: new FormControl(''),
    });
    this.accountTypeDetails = this.applicationService.getShareData();
    this.loanShareGuarantorService=new LoanShareGuarantorEventServiceService(this.shareGuarantorInfoForm);
  }

  public onMemberNoChange():void{
    console.log(this.dataList);
    var fValue = this.shareGuarantorInfoForm.value;
    this.accountTypeDetails = this.applicationService.getShareData();
    if(this.accountTypeDetails){
      this.applicationService.GetShareGuarantorDetails(this.accountTypeDetails,fValue.MemberNo).pipe(takeUntil(this.destroy$)).subscribe(data=>{
        this.memberDetails = data;
        console.log(data);
        if(this.memberDetails.Success==false){
          this.toaster.warning(data.Message);
          this.loanShareGuarantorService.setShareGuarantorDetails(data);
        }
        else{
          this.loanShareGuarantorService.setShareGuarantorDetails(data);
        }
      });
    }
    else{
      alert("Please Select the Loan Account Type on Loan Application Section!");
      var data = new ShareGuarantorDetailsModel();
      this.loanShareGuarantorService.setShareGuarantorDetails(data);
    }
  }
  public addShareData():void{
    if(this.shareGuarantorInfoForm.value.MemberNo == this.memberDetails.MemberNo){
      let selectAcc = this.dataList.find((x)=> x.MemberNo == this.shareGuarantorInfoForm.value.MemberNo);
      if(selectAcc){
        alert("Already Used as a Guarantor.");
        var fValue = new ShareGuarantorDetailsModel();
        this.loanShareGuarantorService.setShareGuarantorDetails(fValue);
      }
      else{
        if(Number(this.shareGuarantorInfoForm.value.ShareAmount)|| this.shareGuarantorInfoForm.value.ShareAmount=="0"){
          if(this.shareGuarantorInfoForm.value.ShareAmount.length!=0){
            if(this.shareGuarantorInfoForm.value.ShareAmount>this.memberDetails.ShareAmount){
              this.loanShareGuarantorService.setShareGuarantorDetails(this.memberDetails);
              this.shareGuarantorInfoForm.value.AccountType = this.memberDetails.AccountType;
              this.shareGuarantorInfoForm.value.AccountNo = this.memberDetails.AccountNo;
              alert("Insufficent Balance");
            }
            else{
              this.shareGuarantorInfoForm.value.AccountType = this.memberDetails.AccountType;
              this.shareGuarantorInfoForm.value.AccountNo = this.memberDetails.AccountNo;
              this.dataList.push(this.shareGuarantorInfoForm.value);
              this.totalShare += this.shareGuarantorInfoForm.value.ShareAmount;
              this.parentForm.controls['DataShareList'].setValue(this.dataList);
              this.parentForm.controls['TotalShareGuarantorAmount'].setValue(this.totalShare);
              let sendData = {
                singleValue:1,
                Data:this.shareGuarantorInfoForm.value.ShareAmount,
              }
              this.callParentFunction.emit(sendData);
              var fValue = new ShareGuarantorDetailsModel();
              this.loanShareGuarantorService.setShareGuarantorDetails(fValue);
              this.memberDetails = fValue;
            }
          }
          else{
            alert("Should be filled up empty fields.");
          }
        }
        else{
          alert("Please provide a valid number in Share Amount!");
        }
      }

    }
  }
  public removeShareData():void{
    var fValue = new ShareGuarantorDetailsModel();
    this.loanShareGuarantorService.setShareGuarantorDetails(fValue);
  }
  public deleteData(data:any):void{
    this.dataList = this.dataList.filter(item=> item!=data);
    this.parentForm.controls['DataShareList'].setValue(this.dataList);
    this.totalShare -= data.ShareAmount;
    data.ShareAmount = Number(data.ShareAmount) * -1;
    this.parentForm.controls['TotalShareGuarantorAmount'].setValue(this.totalShare);
    let sendData = {
      singleValue:1,
      Data:data.ShareAmount,
    }
    this.callParentFunction.emit(sendData);
  }

  shareAmountChange(){
    if(this.memberDetails==null){
      alert("Please enter member no.")
      return;
    }
    console.log(this.memberDetails.ShareAmount, ' ', this.shareGuarantorInfoForm.value.ShareAmount);
    if(this.memberDetails.ShareAmount<this.shareGuarantorInfoForm.value.ShareAmount){
      this.shareGuarantorInfoForm.value.AccountType = this.memberDetails.AccountType;
      this.shareGuarantorInfoForm.value.AccountNo = this.memberDetails.AccountNo;
      this.shareGuarantorInfoForm.value.ShareAmount = this.memberDetails.ShareAmount;
      this.loanShareGuarantorService.setShareGuarantorDetails(this.memberDetails);
      alert("Insufficent Balance");
      return;
    }
  }
}
