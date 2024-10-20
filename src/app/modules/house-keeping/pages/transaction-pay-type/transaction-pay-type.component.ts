import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { HouseKeepingService } from '../../house-keeping.service'
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
//Model
import { AccountTypeClassModel, TransactionPayTypeMaintenanceModel } from '../../../Models/HoseKeepingModel';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-transaction-pay-type',
  templateUrl: './transaction-pay-type.component.html',
  styleUrls: ['./transaction-pay-type.component.css']
})

export class TransactionPayTypeComponent implements OnInit {
  
  TransactionPayTypeMaintenanceForm: FormGroup;
  dataAccountTypeCode: AccountTypeClassModel[] = [];
  dataTransactionPayType: TransactionPayTypeMaintenanceModel[] = [];
  dataTransactionPayShow: TransactionPayTypeMaintenanceModel[] = [];
  showPayType:boolean = false;
  showSubmit:boolean = true;
  showUpdate:boolean = false;
  displayTabularData: boolean = false;

  constructor(private houseKeepingService: HouseKeepingService, private spinner: NgxSpinnerService, private toastr: ToastrService,  public fb: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getDataList();
  }
  initializeForm(){
    this.TransactionPayTypeMaintenanceForm = this.fb.group({
      AccTypeClass: [''],
      PayTypeCode: [''],
      PayTypeDescription: [''],
      PayMode: [''],
      selectPayTypeCode: ['0'],
      selectAccTypeCode:['0'],
    });
  }
  getDataList = () =>{
    this.spinner.show();
    this.houseKeepingService.getAccountTypeList('PayTypeMaintenance').pipe(first()).subscribe((x: AccountTypeClassModel[])=>{
      this.spinner.hide();
      this.dataAccountTypeCode = x;
    },err => {
      this.spinner.hide();
    });
    this.houseKeepingService.getAllAccount().pipe(first()).subscribe((x: TransactionPayTypeMaintenanceModel[])=>{
      this.spinner.hide();
      this.dataTransactionPayShow = x;
    },err => {
      this.spinner.hide();
    });
  }

  selectChangeHandlerAccTypeCode(event: any){
    let needId  = event.target.value;
    if(needId!=0){
      this.houseKeepingService.getTransactionPayTypeList(needId).pipe(first()).subscribe((x: TransactionPayTypeMaintenanceModel[])=>{
        this.spinner.hide();
        this.dataTransactionPayType = x;
        console.log(x);
      },err => {
        this.spinner.hide();
      });
      this.TransactionPayTypeMaintenanceForm.patchValue({
        PayTypeDescription:'',
        PayTypeCode: '',
        PayMode: ''
      });
      this.showPayType = true;
    }
    else{
      this.dataTransactionPayType = [];
      this.TransactionPayTypeMaintenanceForm.patchValue({
        PayTypeDescription:'',
        PayTypeCode: '',
        PayMode: ''
      });
      this.showPayType = false;
      this.showSubmit = true;
      this.showUpdate = false;
    }
    document.getElementById(`PayTypeCode`).focus();
  }
  selectChangeHandler(event: any){
    let ChangeSelectedOption = (event.target.value);
    console.log(ChangeSelectedOption);
    if (ChangeSelectedOption!=0) {
      let selectedCode = this.dataTransactionPayType.find((x) => x.PayTypeCode == ChangeSelectedOption);
      console.log(selectedCode.PayTypeDescription);
      this.TransactionPayTypeMaintenanceForm.patchValue({
        PayTypeDescription: selectedCode.PayTypeDescription,
        PayTypeCode: selectedCode.PayTypeCode,
        PayMode: selectedCode.PayMode
      });
      this.showSubmit = false;
      this.showUpdate = true;
    }
    else{
      this.TransactionPayTypeMaintenanceForm.patchValue({
        PayTypeDescription: '',
        PayTypeCode: '',
        PayMode: '',
      });
      this.showSubmit = true;
      this.showUpdate = false;
    }
    document.getElementById(`PayTypeDescription`).focus();
  }
  changeSelectValue(event:any){
    let ChangeSelectedOption = (event.target.value);
    console.log(ChangeSelectedOption);
    if (ChangeSelectedOption!=0) {
      let selectedCode = this.dataTransactionPayType.find((x) => x.PayTypeCode == ChangeSelectedOption);
      console.log(this.dataTransactionPayType);
      if(selectedCode){
        this.TransactionPayTypeMaintenanceForm.patchValue({
          PayTypeDescription: selectedCode.PayTypeDescription,
          PayTypeCode: selectedCode.PayTypeCode,
          PayMode: selectedCode.PayMode,
          selectPayTypeCode: selectedCode.PayTypeCode,
        });
        this.showSubmit = false;
        this.showUpdate = true;
      }
      else{
        this.TransactionPayTypeMaintenanceForm.patchValue({
          PayTypeDescription: '',
          PayMode: '',
          selectPayTypeCode: '0',
        });
        this.showSubmit = true;
        this.showUpdate = false;
      }
      
    }
    else{
      this.TransactionPayTypeMaintenanceForm.patchValue({
        PayTypeDescription: '',
        PayTypeCode: '',
        PayMode: '',
      });
      this.showSubmit = true;
      this.showUpdate = false;
    }
    document.getElementById(`PayTypeDescription`).focus();
  }

  public getTableReportData(){
    this.displayTabularData=true;
  }

  insertData = () => {
    this.spinner.show();
    var formValue = this.TransactionPayTypeMaintenanceForm.value;
      formValue.AccTypeClass = formValue.selectAccTypeCode;
      this.houseKeepingService.insert('PayTypeMaintenance', formValue).pipe(first()).subscribe((x:TransactionPayTypeMaintenanceModel[]) => {
        this.dataTransactionPayType = [];
        this.getDataList();
        alert("Data saved successfully");
        this.initializeForm();
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      })
    
  }

  updateData = () =>{
    this.spinner.show();
    var formValue = this.TransactionPayTypeMaintenanceForm.value;
    if(formValue.PayMode==''){
      alert("Please Select Pay Mode");
      this.spinner.hide();
    }
    else{
      formValue.AccTypeClass = formValue.selectAccTypeCode;
      this.houseKeepingService.update('PayTypeMaintenance', formValue).pipe(first()).subscribe((x:TransactionPayTypeMaintenanceModel[]) => {
        this.dataTransactionPayType = [];
        this.getDataList();
        alert("Data update succeddfully");
        this.initializeForm();
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      })
      this.showSubmit = true;
      this.showUpdate = false;
    }
  }

}


