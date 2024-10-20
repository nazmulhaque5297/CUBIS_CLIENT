import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { GridDataModel } from '../../models/gl-verify-daily-transaction.model';
import { BudgetParameterService } from '../../services/accounting module/budget-parameter.service';
import { CsVerifyDailyTransactionService } from '../../services/cs-verify-daily-transaction.service';

@Component({
  selector: 'app-cs-verify-daily-transaction',
  templateUrl: './cs-verify-daily-transaction.component.html',
  styleUrls: ['./cs-verify-daily-transaction.component.css']
})
export class CsVerifyDailyTransactionComponent implements OnInit {
  dataList:any[] = [];
  procDate: any;
  voucherNo: string;
  transactionDate: string;
  memberNo: number;
  memberName: string;
  userId: number;
  userIdName: string;
  memType:number;
  totalAmount:number;
  totalAmountText: string;
  itemType: string;
  showOther: boolean = true;
  verifyDataList:[];
  showVerifyDataList: boolean;
  constructor(
    private budgetParameterService: BudgetParameterService,
    private csVerifyDailyTrnService: CsVerifyDailyTransactionService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.showVerifyDataList = false;
    this.showOther = true;
    this.onSearch();
  }

  onSearch(){
    this.spinner.show();
    this.csVerifyDailyTrnService.pageLoadData().pipe(first()).subscribe((x: any) => {
      this.spinner.hide();
      console.log(x);
      this.dataList = x.TrnList;
      this.procDate = x.ProcDate;
      if(this.dataList.length>0){
        this.showOther = false;
      }
    }, err => {
      this.spinner.hide();
    })
  }
  exitPage(){
    this.router.navigate(['accounting/']);
  }
  onSelect(item:any){
    this.csVerifyDailyTrnService.ValidDataCheck(item).pipe(first()).subscribe((x: any) => {
      console.log(x);
      if(x.Success){
        this.voucherNo = item.VoucherNo;
        this.verifyDataList = x.AccList;
        this.memberName = x.MemName;
        this.memberNo = x.MemNo;
        this.memType = x.MemType;
        this.totalAmountText = x.TotalAmountText;
        this.totalAmount = x.TotalAmount;
        this.transactionDate = x.TranDate;
        this.userId = x.UserId;
        this.userIdName = x.UserIdMemName;
        this.showVerifyDataList = true;
        this.itemType = item.FuncOptDesc;
      }
      else{
        alert(x.Message);
      }
    }, err => {
    });
  }
  verifyData(){
    this.csVerifyDailyTrnService.VerifyData(this.voucherNo, this.transactionDate).pipe(first()).subscribe((x: any) => {
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
