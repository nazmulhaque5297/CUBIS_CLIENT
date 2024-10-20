import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoanApplicationService } from 'src/app/services/loan-application.service';
import { PropertyGuarantorDetailsModel } from '../../../models/loan-application.model';
import { NewLoanApplicationService } from '../../../services/loan-application.service';

@Component({
  selector: 'app-loan-property-guarantor',
  templateUrl: './loan-property-guarantor.component.html',
  styleUrls: ['./loan-property-guarantor.component.css']
})
export class LoanPropertyGuarantorComponent implements OnInit {
  @Output() callParentFunction:EventEmitter<any> = new EventEmitter<any>();
  @Input() formGroupName: string;
  propertyGuarantorInfoForm: FormGroup;
  public totalProperty:number = 0;
  public dataList:PropertyGuarantorDetailsModel[] = [];
  parentForm:FormGroup;

  constructor(private rootFormGroup: FormGroupDirective,
    private applicationService: LoanApplicationService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private toaster: ToastrService,
    private newLoanApplicationService: NewLoanApplicationService) { }

  ngOnInit(): void {
    this.parentForm = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
    this.propertyGuarantorInfoForm = new FormGroup({
      SerialNo: new FormControl(''),
      NameOfProperty: new FormControl(''),
      FileNo: new FormControl(''),
      Description: new FormControl(''),
      Amount: new FormControl(''),
    });
  }

  addShareData():void{
    var fValue = this.propertyGuarantorInfoForm.value;
    if(fValue.SerialNo.length!=0 && fValue.NameOfProperty.length!=0 && fValue.FileNo.length!=0 && fValue.Description.length!=0 && fValue.Amount.length!=0){
      if(Number(fValue.Amount)){
        this.propertyGuarantorInfoForm.value.Amount = Number(this.propertyGuarantorInfoForm.value.Amount);
        this.propertyGuarantorInfoForm.value.FileNo = Number(this.propertyGuarantorInfoForm.value.FileNo);
        this.propertyGuarantorInfoForm.value.SerialNo = Number(this.propertyGuarantorInfoForm.value.SerialNo);
        this.dataList.push(this.propertyGuarantorInfoForm.value);
        console.log(this.dataList);
        this.parentForm.controls['DataPropertyList'].setValue(this.dataList);
        this.totalProperty += Number(this.propertyGuarantorInfoForm.value.Amount);
        this.parentForm.controls['TotalPropertyGuarantorAmount'].setValue(this.totalProperty);
        let sendData = {
          singleValue:1,
          Data:this.propertyGuarantorInfoForm.value.Amount,
        }
        this.callParentFunction.emit(sendData);
        this.clearForm();
      }
      else{
        alert("Please provide a valid number in Amount!");
      }
    }
    else{
      alert("Please fillup the empty field!");
    }
  }
  deleteData(data:any):void{
    console.log(data);
    this.dataList = this.dataList.filter(item=> item!=data);
    this.parentForm.controls['DataPropertyList'].setValue(this.dataList);
    this.totalProperty -= data.Amount;
    data.Amount = Number(data.Amount) * -1;
    this.parentForm.controls['TotalPropertyGuarantorAmount'].setValue(this.totalProperty);
    let sendData = {
      singleValue:1,
      Data:data.Amount,
    }
    this.callParentFunction.emit(sendData);
  }

  clearForm():void{
    this.propertyGuarantorInfoForm.controls['SerialNo'].setValue('');
    this.propertyGuarantorInfoForm.controls['NameOfProperty'].setValue('');
    this.propertyGuarantorInfoForm.controls['FileNo'].setValue('');
    this.propertyGuarantorInfoForm.controls['Description'].setValue('');
    this.propertyGuarantorInfoForm.controls['Amount'].setValue('');
  }



}
