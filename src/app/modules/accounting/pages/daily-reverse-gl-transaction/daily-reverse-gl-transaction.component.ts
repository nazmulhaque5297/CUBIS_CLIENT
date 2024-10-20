import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { BudgetParameterService } from '../../services/accounting module/budget-parameter.service';

@Component({
  selector: 'app-daily-reverse-gl-transaction',
  templateUrl: './daily-reverse-gl-transaction.component.html',
  styleUrls: ['./daily-reverse-gl-transaction.component.css']
})
export class DailyReverseGlTransactionComponent implements OnInit {
  module:string = "1";
  DailyReverseGlTrnForm: FormGroup;
  showOk: boolean = false;
  showDelete: boolean = false;
  searchBtnDis: boolean = true;
  DataList:any[]=[];
  constructor(
    private budgetParameterService: BudgetParameterService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  getResolvedUrl(route: ActivatedRouteSnapshot): string {
    let url = route.pathFromRoot.map((v) => v.url.map((segment) => segment.toString()).join('/')).join('/');
    const queryParam = route.queryParamMap;
    if (queryParam.keys.length > 0) {
      url += '?' + queryParam.keys.map(key => queryParam.getAll(key).map(value => key + '=' + value).join('&')).join('&');
    }
    return this.getModuleName(url);
  }
  getModuleName(urlData:any){
    console.log(urlData)
    var result = '';
    for(var i=1;i<urlData.length;i++){
      if(urlData[i]=='/') return result;
      result+=urlData[i];
    }
  }

  ngOnInit(): void {
    var urlData = this.getResolvedUrl(this.route.snapshot);
    if(urlData=='booth') this.module = '3'
    else if(urlData=='accounting') this.module = '1';
    this.initializeForm();
    this.showOk = false;
    this.showDelete = false;
    this.searchBtnDis = true;
    this.DataList=[];
  }
  initializeForm(){
    this.DailyReverseGlTrnForm = new FormGroup({
      VoucherNo: new FormControl(""),
      ModuleNo: new FormControl(""),
      UserLevel: new FormControl(""),
      CashCode: new FormControl(""),
    });
    this.inputLoadData();
  }
  inputLoadData(){
    this.spinner.show();
    this.budgetParameterService.GetDailyReverseGlTrnLoadData().pipe(first()).subscribe((x: any) => {
      this.spinner.hide();
      this.showOk = x.ShowOk;
      this.DailyReverseGlTrnForm.controls['UserLevel'].setValue(x.UserLevel);
      this.DailyReverseGlTrnForm.controls['CashCode'].setValue(x.CashCode);
    }, err => {
      this.spinner.hide();
    })
    if(this.showOk==true){
      this.DailyReverseGlTrnForm.controls['VoucherNo'].disable();
      this.searchBtnDis = false;
    }
  }
  exitPage(){
    this.router.navigate(['accounting/']);
  }
  onSearch(){
    this.DataList = [];
    this.DailyReverseGlTrnForm.controls['ModuleNo'].setValue(this.module);
    if(this.DailyReverseGlTrnForm.value.VoucherNo==""){
      alert("Please input the voucher no.");
    }
    else{
      console.log(this.DailyReverseGlTrnForm.value);
      this.budgetParameterService.FindDailyReverseGlTrnData(this.DailyReverseGlTrnForm.value).pipe(first()).subscribe((x: any) => {
        this.spinner.hide();
        console.log(x);
        if(x.Success==false){
          alert(x.Message);
          this.DailyReverseGlTrnForm.controls['VoucherNo'].setValue('');
        }
        else{
          for(var i=0;i<x.GridViewData.length;i++)
          {
            this.DataList.push(x.GridViewData[i]);
          }
          this.showDelete = true;
        }
      }, err => {
        this.spinner.hide();
      })
    }
  }

  onInputEnterHandler(e: KeyboardEvent){
    if( e.keyCode != 13 ) return;
    else{
      this.onSearch();     
    }
  }

  onDelete(){
    if(confirm("Are you you want to Delete information?")){
      this.budgetParameterService.DeleteDailyReverseGlTrnData(this.DailyReverseGlTrnForm.value.VoucherNo, Number(this.module)).pipe(first()).subscribe((x: any) => {
        this.spinner.hide();
        if(x.Success==false){
          alert(x.Message);
        }
        else{
          alert(x.Message);
          this.ngOnInit();
        }
      }, err => {
        this.spinner.hide();
      })
    }
  }
}
