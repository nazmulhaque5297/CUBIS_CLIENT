import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { GridDataModel } from '../../models/gl-verify-daily-transaction.model';
import { BudgetParameterService } from '../../services/accounting module/budget-parameter.service';

@Component({
  selector: 'app-gl-verify-daily-transaction',
  templateUrl: './gl-verify-daily-transaction.component.html',
  styleUrls: ['./gl-verify-daily-transaction.component.css']
})
export class GlVerifyDailyTransactionComponent implements OnInit {
  GLVerifyDailyTrnForm: FormGroup;
  dataList:GridDataModel[] = [];
  showOther: boolean = true;
  cashCode: number;
  ctrlModule: number;
  voucherNo:number;
  transactionDate:string;
  verifyDataList:[];
  totalAmount:number;
  showVerifyDataList: boolean;
  constructor(
    private budgetParameterService: BudgetParameterService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.showVerifyDataList = false;
    this.showOther = true;
    this.initializeForm();
    this.onSearch();
  }

  initializeForm(){
    this.GLVerifyDailyTrnForm = new FormGroup({
      VoucherNo: new FormControl(""),
    });
  }
  onSearch(){
    this.spinner.show();
    this.budgetParameterService.GetVerifyGLDailyTrnVchData().pipe(first()).subscribe((x: any) => {
      this.cashCode = x.CashCode;
      this.ctrlModule = x.CtrlModule;
      this.dataList = x.GridData;
      if(this.dataList.length>0){
        this.showOther = false;
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    })
  }
  exitPage(){
    this.router.navigate(['accounting/']);
  }
  onSelect(item:any){
    //console.log(item);
    let selectedCode =  this.dataList.find(x=>x.VchNo==item);
    this.budgetParameterService.GetVerifyGLDailySelectVchData(selectedCode).pipe(first()).subscribe((x: any) => {
      console.log(x);
      if(x.Success){
        this.vchLoadData(item);
      }
      else{
        alert(x.Message);
      }
    }, err => {
    });
  }
  vchLoadData(item:any){
    this.spinner.show();
    this.budgetParameterService.GetGLViewDailyTrnLoadData(item).pipe(first()).subscribe((x: any) => {
      console.log(x);
      this.spinner.hide();
      this.verifyDataList = x.DataList;
      this.totalAmount = x.TotalAmt;
      this.transactionDate = x.TranDate;
      this.voucherNo = item;
      this.showVerifyDataList = true;      
    }, err => {
    });
  }
  verifyData(){
    this.budgetParameterService.GLViewDailyTrnVerifyData(this.voucherNo).pipe(first()).subscribe((x: any) => {
      if(x==1){
        alert("Data Verified Successfully.!");
        this.ngOnInit();
      }
      else{
        alert("Data Verified not possible.!");
      }     
    }, err => {
    });
  }
}
