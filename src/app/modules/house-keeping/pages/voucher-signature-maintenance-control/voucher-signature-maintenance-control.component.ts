import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { SmsMessageMaintenancePageLoadModel, SmsMessageMaintenanceTextDataModel } from 'src/app/modules/accounting/models/sms-message-meintenance.model';
import { VoucherSignatureMaintenancePageLoadModel, VoucherSignatureMaintenanceTextDataModel } from 'src/app/modules/accounting/models/voucher-signature-maintenance.model';
import { Module, ModuleListByUser } from 'src/app/modules/Models/HoseKeepingModel';
import { SmsMessageMaintenanceService } from 'src/app/services/sms-message-maintenance-control.service';
import { VoucherSignatureMaintenanceService } from 'src/app/services/voucher-signature-maintenance.service';
import { HouseKeepingService } from '../../house-keeping.service';

@Component({
  selector: 'app-voucher-signature-maintenance-control',
  templateUrl: './voucher-signature-maintenance-control.component.html',
  styleUrls: ['./voucher-signature-maintenance-control.component.css']
})
export class VoucherSignatureMaintenanceControlComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  dataList = [];
  SmsDdlForm: FormGroup;
  GetInputHelpData: VoucherSignatureMaintenancePageLoadModel = new VoucherSignatureMaintenancePageLoadModel();
  GetTextBoxData:VoucherSignatureMaintenanceTextDataModel=new VoucherSignatureMaintenanceTextDataModel();
  selectedCode: any = null;
  allModuleList: Module[] = [];
  smsData:any;
  getFunId:any;
  text1Status:any;
  Message1:any;
  textBStatus:any;
  text2Status:any;
  text3Status:boolean=true;
  text4Status:boolean=true;

  

  constructor(
    // private houseKeepingService: HouseKeepingService,
    private voucherSignatureMaintenanceService:VoucherSignatureMaintenanceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getInputHelpData();
  }
  private initializeForm() {
    this.text1Status=true;
    this.SmsDdlForm = new FormGroup({
      SelectedOptionCode: new FormControl('0'),
      Signature1: new FormControl(''),
      Signature2: new FormControl(''),
      Signature3: new FormControl(''),
      Signature4: new FormControl(''),
      //Signature5: new FormControl(''),
      
    });
  }
  onChangeFunctionName() {
    let funIdList = [];
    var x= this.SmsDdlForm.value.SelectedOptionCode
    console.log(x)
    this.voucherSignatureMaintenanceService.VoucherSignatureMaintenanceTextData(x).pipe(first()).subscribe((data:any)=>{
      console.log(data);
      this.SmsDdlForm.controls['Signature1'].setValue(data.SignatureData.Signature1)
      this.SmsDdlForm.controls['Signature2'].setValue( data.SignatureData.Signature2);
      // this.SmsDdlForm.controls['textMessage3'].setValue( data.SignatureData.Signature3); 
      // this.SmsDdlForm.controls['textMessage4'].setValue( data.SignatureData.Signature4)
      
      this.text3Status=data.Success; 
      this.text4Status=data.Success2;
      if((this.text3Status)&& (this.text4Status))
      {
        this.SmsDdlForm.controls['Signature3'].setValue( data.SignatureData.Signature3)
        this.SmsDdlForm.controls['Signature4'].setValue( data.SignatureData.Signature4)
      }
      else
      {
        this.SmsDdlForm.controls['Signature3'].setValue( " ")
        this.SmsDdlForm.controls['Signature4'].setValue( " ")
      }

      console.log(data.SignatureData.Signature1)
    })
     
  }

    public getInputHelpData()
    {
      this.voucherSignatureMaintenanceService.VoucherSignatureMaintenancePageLoad().pipe(first()).subscribe((data:any)=>{
        console.log(data);
        this.GetInputHelpData = data;

      })
    
    }
    updateData()
    {
      if(this.SmsDdlForm.value.SelectedOptionCode==0)
      {
        alert("Please Select Function Option");
        return;
      }
      if(this.SmsDdlForm.invalid)
      {
        alert('Please Fillup the Required Field ')
        return;
      }
      var fValue=this.SmsDdlForm.value;
      console.log(fValue);
      this.spinner.show();
      this.voucherSignatureMaintenanceService.UpdateAllInformation(fValue).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>
      {
        this.spinner.hide();
        console.log("This is data")
        if (data != 0) {
          alert("Data updated successfully");
          //location.reload();
          this.initializeForm();
        }
        else{
          alert("Data didn\'t updated.")
        }
      })

    }
    exitPage(){
      this.router.navigate(['housekeeping/']);
    }

}
