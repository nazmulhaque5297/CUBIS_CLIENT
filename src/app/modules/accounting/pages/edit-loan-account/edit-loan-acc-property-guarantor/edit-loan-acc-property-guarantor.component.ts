import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormGroupDirective, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { EditLoanAccountService } from 'src/app/services/edit-loan-account.service';
import { LoanApplicationService } from 'src/app/services/loan-application.service';
import { PropertyGuarantorDetailsModel } from '../../../models/loan-application.model';
import { NewLoanApplicationService } from '../../../services/loan-application.service';

@Component({
  selector: 'app-edit-loan-acc-property-guarantor',
  templateUrl: './edit-loan-acc-property-guarantor.component.html',
  styleUrls: ['./edit-loan-acc-property-guarantor.component.css']
})
export class EditLoanAccPropertyGuarantorComponent implements OnInit {
  @Output() callParentFunction:EventEmitter<any> = new EventEmitter<any>();
  @Input() formGroupName: string;
  propertyGuarantorInfoForm: FormGroup;
  public totalProperty:number = 0;
  public dataList:PropertyGuarantorDetailsModel[] = [];
  parentForm:FormGroup;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private rootFormGroup: FormGroupDirective,
    private applicationService: LoanApplicationService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private toaster: ToastrService,
    private newLoanApplicationService: NewLoanApplicationService,
    private editAccountService: EditLoanAccountService,
    ) { }

  ngOnInit(): void {
    this.applicationService.currentProperty.subscribe(data=> this.dataList = data);
    this.applicationService.currentTotalProperty.subscribe(data=> this.totalProperty = data);
    this.parentForm = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
    this.parentForm.controls['DataPropertyList'].setValue(this.dataList);
    this.parentForm.controls['TotalPropertyGuarantorAmount'].setValue(this.totalProperty);
    this.propertyGuarantorInfoForm = new FormGroup({
      SerialNo: new FormControl(''),
      NameOfProperty: new FormControl(''),
      FileNo: new FormControl(''),
      Description: new FormControl(''),
      Amount: new FormControl(''),
    });
  }

  addPropertyData():void{
    var fValue = this.propertyGuarantorInfoForm.value;
    if(fValue.SerialNo.length!=0 && fValue.NameOfProperty.length!=0 && fValue.FileNo.length!=0 && fValue.Description.length!=0 && fValue.Amount.length!=0){
      if(Number(fValue.Amount)){
        let data = {
          LoanApplicationNo: this.editAccountService.getLoanApplicationNo(),
          SerialNo: this.propertyGuarantorInfoForm.value.SerialNo,
          NameOfTheProperty: this.propertyGuarantorInfoForm.value.NameOfProperty,
          FileNo: this.propertyGuarantorInfoForm.value.FileNo,
          Description: this.propertyGuarantorInfoForm.value.Description,
          Amount: this.propertyGuarantorInfoForm.value.Amount
        }
        this.dataList = [];
        this.totalProperty = 0;
        this.editAccountService.AddAndGetPropertyDataToTemp(data).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
          for(var i=0;i<data.length;i++){
            this.dataList.push(data[i]);
            this.totalProperty+=data[i].PrAmount;
          }
          this.parentForm.controls['DataPropertyList'].setValue(this.dataList);
          this.parentForm.controls['TotalPropertyGuarantorAmount'].setValue(this.totalProperty);
        });
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
    var neg = Number(data.PrAmount) * -1;
    this.dataList = [];
    this.totalProperty = 0;
    this.editAccountService.RemoveAndGetPropertyDataToTemp(data.Id,this.editAccountService.getLoanApplicationNo()).pipe(takeUntil(this.destroy$)).subscribe((x:any)=>{
      for(var i=0;i<x.length;i++){
        this.dataList.push(x[i]);
        this.totalProperty+=x[i].PrAmount;
      }
      this.parentForm.controls['DataPropertyList'].setValue(this.dataList);
      this.parentForm.controls['TotalPropertyGuarantorAmount'].setValue(this.totalProperty);
    });
    let sendData = {
      singleValue:1,
      Data:neg,
    }
    this.callParentFunction.emit(sendData);
    this.parentForm.controls['DataPropertyList'].setValue(this.dataList);
    this.parentForm.controls['TotalPropertyGuarantorAmount'].setValue(this.totalProperty);
  }

  clearForm():void{
    this.propertyGuarantorInfoForm.controls['SerialNo'].setValue('');
    this.propertyGuarantorInfoForm.controls['NameOfProperty'].setValue('');
    this.propertyGuarantorInfoForm.controls['FileNo'].setValue('');
    this.propertyGuarantorInfoForm.controls['Description'].setValue('');
    this.propertyGuarantorInfoForm.controls['Amount'].setValue('');
  }



}
