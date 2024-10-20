import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { AccountTypeClassModel, SlabGvDetails7Model, SlabMaintainHelpModel } from 'src/app/modules/Models/HoseKeepingModel';
import { HouseKeepingService } from '../../../house-keeping.service';
import { SlabMaintainService } from '../../../services/slab-maintain.service';

@Component({
  selector: 'app-slab-maintain-loan',
  templateUrl: './slab-maintain-loan.component.html',
  styleUrls: ['./slab-maintain-loan.component.css']
})
export class SlabMaintainLoanComponent implements OnInit {
  dataList:SlabGvDetails7Model[] =[];
  titleOftheSlab: string;
  btnUpdate:boolean =  false;
  btnDelete:boolean = false;
  SlabMaintainLoanForm: FormGroup;
  memberTypeEnum:AccountTypeClassModel[]=[];
  constructor( 
    public activeModal: NgbActiveModal,
    private slabService: SlabMaintainService,
    private houseKeepingService: HouseKeepingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.titleOftheSlab = this.slabService.data.AccountTitle;
    this.loadData();
  }
  loadData(){
    this.houseKeepingService.SlabMaintainHelpDataGet(this.slabService.data).pipe(first()).subscribe((x: any) => {
      this.dataList = x.GvDetails7;
    }, err => {
      this.spinner.hide();
    })
    this.houseKeepingService.SlabMaintainEnumData().pipe(first()).subscribe((x:any)=>{
      this.memberTypeEnum = x;
    })
  }
  initializeForm(){
    this.SlabMaintainLoanForm = new FormGroup({
      TypeClass: new FormControl(this.slabService.data.TypeClass),
      TypeCode: new FormControl(this.slabService.data.TypeCode),
      SlabFlag: new FormControl("0"),
      PensionRecord: new FormControl(""),
      PeriodMonth: new FormControl(""),
      BenefitAmount: new FormControl("0"),
      PensionInterestRate: new FormControl("0"),
      PenalAmount: new FormControl("0"),
      BonusAmount: new FormControl("0"),
    });
  }

  onSubmitClick(){
    var period = this.SlabMaintainLoanForm.value.PeriodMonth;
    var depositAmount = Number(this.SlabMaintainLoanForm.value.PensionRecord);
    var slabFlag = this.SlabMaintainLoanForm.value.SlabFlag;
    var selectedCode = this.dataList.find(x=> x.AtyFlag==slabFlag && x.AtyPeriod==period && x.AtyRecords==depositAmount);
    if(selectedCode){
      this.toastr.error("This data is already in the list!", "Error");
    }
    else{
      this.houseKeepingService.SubmitSlabData(this.SlabMaintainLoanForm.value).pipe(first()).subscribe((x: any) => {
        if(x==1){
          var data = new SlabGvDetails7Model();
          data.AtyAccType = this.SlabMaintainLoanForm.value.TypeCode;
          data.AtyFlag = this.SlabMaintainLoanForm.value.SlabFlag;
          data.AtyPeriod = this.SlabMaintainLoanForm.value.PeriodMonth;
          data.AtyRecords = Number(this.SlabMaintainLoanForm.value.PensionRecord);
          this.dataList.push(data);
          this.initializeForm();
        }
        else{
          this.toastr.error("Error Data didn't submit!", "Error");
        }
      }, err => {
        this.spinner.hide();
      })
    }
  }
  setDataOnUpdate(data:any){
    var value = new SlabGvDetails7Model();
    value=data;
    this.SlabMaintainLoanForm.controls['TypeCode'].setValue(value.AtyAccType);
    this.SlabMaintainLoanForm.controls['SlabFlag'].setValue(value.AtyFlag);
    this.SlabMaintainLoanForm.controls['PeriodMonth'].setValue(value.AtyPeriod);
    this.SlabMaintainLoanForm.controls['PensionRecord'].setValue(value.AtyRecords);
    this.btnUpdate = true;
  }
  onUpdateClick(){
    this.houseKeepingService.UpdateSlabData(this.SlabMaintainLoanForm.value).pipe(first()).subscribe((x: any) => {
      if(x==1){
        var data = new SlabGvDetails7Model();
        data.AtyAccType = this.SlabMaintainLoanForm.value.TypeCode;
        data.AtyFlag = this.SlabMaintainLoanForm.value.SlabFlag;
        data.AtyPeriod = this.SlabMaintainLoanForm.value.PeriodMonth;
        data.AtyRecords = this.SlabMaintainLoanForm.value.PensionRecord;
        this.loadData();
        this.initializeForm();
        this.btnUpdate = false;
      }
      else{
        this.toastr.error("Error Data didn't submit!", "Error");
      }
    }, err => {
      this.spinner.hide();
    })
  }
  onDeleteClick(data:any){
    var value = new SlabGvDetails7Model();
    value=data;
    this.SlabMaintainLoanForm.value.TypeCode = value.AtyAccType;
    this.SlabMaintainLoanForm.value.SlabFlag = value.AtyFlag;
    this.SlabMaintainLoanForm.value.PeriodMonth = value.AtyPeriod;
    this.SlabMaintainLoanForm.value.PensionRecord = value.AtyRecords;
    this.houseKeepingService.DeleteSlabData(this.SlabMaintainLoanForm.value).pipe(first()).subscribe((x: any) => {
      if(x==1){
        var data = new SlabGvDetails7Model();
        data.AtyAccType = this.SlabMaintainLoanForm.value.TypeCode;
        data.AtyFlag = this.SlabMaintainLoanForm.value.SlabFlag;
        data.AtyPeriod = this.SlabMaintainLoanForm.value.PeriodMonth;
        data.AtyRecords = this.SlabMaintainLoanForm.value.PensionRecord;
        this.loadData();
        this.initializeForm();
      }
      else{
        this.toastr.error("Error Data didn't submit!", "Error");
      }
    }, err => {
      this.spinner.hide();
    })
  }
}
