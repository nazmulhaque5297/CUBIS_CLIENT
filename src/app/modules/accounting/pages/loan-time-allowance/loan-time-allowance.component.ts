import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { TimeAllowenceService } from '../../services/time-allowence.service';

@Component({
  selector: 'app-loan-time-allowance',
  templateUrl: './loan-time-allowance.component.html',
  styleUrls: ['./loan-time-allowance.component.css']
})
export class LoanTimeAllowanceComponent implements OnInit {

  timeAllowenceForm: FormGroup;
  loanCalMethodList: any[] = [];
  memberName:string;
  showListData:any[] = [];
  tempTillDate:any;
  tempTimeAllowence: any;
  prevTimeAllowenceList: any[] = [];
  constructor(
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private toaster: ToastrService,
    private router: Router,
    private timeAllowenceService: TimeAllowenceService,
    public datepipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.showListData = [];
    this.prevTimeAllowenceList = [];
    this.memberName = '';
  }

  initializeForm(){
    this.timeAllowenceForm = new FormGroup({
      MemberNo: new FormControl(""),
      LoanDisburseDate: new FormControl("0"),
      ActualNoOfInstallment: new FormControl(""),
      DuePricAmt: new FormControl(""),
      LoanExpireDate: new FormControl("0"),
      InstallmentAmt: new FormControl(""),
      DueInterestAmt: new FormControl(""), 
      CurrentBalance: new FormControl(""), 
      LastInstallmentAmt: new FormControl(""),
      RemNoOfInstallment: new FormControl(""),
      MonthlyInterestPaid: new FormControl("1"),
      FromDate: new FormControl(""), 
      TillDate: new FormControl(""), 
      TimeAllowancePeriod: new FormControl(""), 
      NewNoOfInstallment: new FormControl(""), 
      NewInstallmentAmount: new FormControl(""), 
      LoanCalMethod: new FormControl("1"), 
      InterestRate: new FormControl(""), 
      NewLastInstallmentAmount: new FormControl(""),
      AccType: new FormControl(''),
      AccNo: new FormControl(''),
      MemType: new FormControl(''),
    });
    this.pageLoad();
  }

  pageLoad(){
    this.timeAllowenceService.pageLoadData().pipe(first()).subscribe((x:any)=>{
      console.log(x);
      this.timeAllowenceForm.controls['FromDate'].setValue(x.FromDate);
      this.timeAllowenceForm.controls['TillDate'].setValue(x.TillDate);
      this.loanCalMethodList = x.LoanCalculationEnum;
      this.tempTillDate = x.TillDate;
    })
  }


  memberNoChange(){
    if(this.timeAllowenceForm.value.MemberNo=='') return;
    else{
      this.spinner.show();
      this.timeAllowenceService.memberNoChngData(this.timeAllowenceForm.value.MemberNo).pipe(first()).subscribe((x:any)=>{
        console.log(x);
        if(x.MemberName==null){
          this.toaster.error('No such member.');
          this.timeAllowenceForm.controls['MemberNo'].setValue('');
        }
        else{
          this.memberName = x.MemberName;
          this.timeAllowenceForm.controls['MemType'].setValue(x.MemType);
        }
        this.spinner.hide();
      })
    }
  }

  submitButtonClick(){
    if(this.timeAllowenceForm.value.MemberNo=='') return;
    else{
      this.spinner.show();
      this.timeAllowenceService.memberNoAllData(this.timeAllowenceForm.value.MemberNo).pipe(first()).subscribe((x:any)=>{
        console.log(x);
        this.showListData = x;
        this.spinner.hide();
      })
    }
  }

  accountInfoGet(data:any){
    this.spinner.show();
    let selectedCode = this.showListData.find(x=>x.AccNo==data);
    this.timeAllowenceForm.controls['AccNo'].setValue(selectedCode.AccNo);
    this.timeAllowenceForm.controls['AccType'].setValue(selectedCode.AccType);
    this.timeAllowenceService.accInfoGet(data).pipe(first()).subscribe((x:any)=>{
      console.log(x);
      this.timeAllowenceForm.controls['LoanDisburseDate'].setValue(x.DisbruseDate);
      this.timeAllowenceForm.controls['ActualNoOfInstallment'].setValue(x.ActNoInstl);
      this.timeAllowenceForm.controls['DuePricAmt'].setValue(x.DuePricAmt);
      this.timeAllowenceForm.controls['LoanExpireDate'].setValue(x.LoanExpiryDate);
      this.timeAllowenceForm.controls['InstallmentAmt'].setValue(x.InstlAmt);
      this.timeAllowenceForm.controls['DueInterestAmt'].setValue(x.DueInterestAmt);
      this.timeAllowenceForm.controls['CurrentBalance'].setValue(x.LoanBalance);
      this.timeAllowenceForm.controls['LastInstallmentAmt'].setValue(x.LastInstlAmt);
      this.timeAllowenceForm.controls['RemNoOfInstallment'].setValue(x.RemNoInstl);
      this.timeAllowenceForm.controls['LoanCalMethod'].setValue(x.CalculationMethod);
      this.timeAllowenceForm.controls['InterestRate'].setValue(x.NewInterestRate);
      this.prevTimeAllowenceList = x.PrevAccTimeData;
      this.CalculateTimeAllotmentByFromTillDate();
    })
    this.spinner.hide();
  }



  CalculateTimeAllotmentByFromTillDate() {
    console.log(this.timeAllowenceForm.value.TillDate)
    var dYY = this.timeAllowenceForm.value.FromDate.toString().substr(6, 4);
    var dMM = this.timeAllowenceForm.value.FromDate.toString().substr(3, 2);
    var dDD = this.timeAllowenceForm.value.FromDate.toString().substr(0, 2);
    var inputFromDate = new Date((dYY + '-' + dMM + '-' + dDD));            
    console.log('here', this.timeAllowenceForm.value.TillDate)
    var checking = this.timeAllowenceForm.value.TillDate.toString();
    console.log(checking.length);
    if(checking.length>10){
      var value = this.datepipe.transform(this.timeAllowenceForm.value.TillDate, 'dd-MM-yyyy');
      this.timeAllowenceForm.value.TillDate = this.timeAllowenceService.convertDateToString(value);
    }
    dYY = this.timeAllowenceForm.value.TillDate.toString().substr(6, 4);
    dMM = this.timeAllowenceForm.value.TillDate.toString().substr(3, 2);
    dDD = this.timeAllowenceForm.value.TillDate.toString().substr(0, 2);

    if (dDD > 28) {
        dDD = 28;
    }
    
    var inputTillDate = new Date((dYY + '-' + dMM + '-' + dDD));                       

    var firstDay = new Date(inputFromDate.getFullYear(), inputFromDate.getMonth(), 1);
    var lastDay = new Date(inputTillDate.getFullYear(), inputTillDate.getMonth() + 1, 0);
    console.log('lastDay=> ', lastDay)
    var nDD = '0';
    var nMM = '0';

    if (firstDay.getDate() < 10) {
        nDD = nDD + firstDay.getDate();
    } else {
        nDD = firstDay.getDate().toString();
    }

    if (firstDay.getMonth() < 9) {
        nMM = nMM + (firstDay.getMonth() + 1);
    } else {
        nMM = (firstDay.getMonth() + 1).toString();
    }
    this.timeAllowenceForm.controls['FromDate'].setValue(nDD + '/' + nMM + '/' + inputFromDate.getFullYear());
    nDD = '0';
    nMM = '0';

    if (lastDay.getDate() < 10) {
        nDD = nDD + lastDay.getDate();
    } else {
        nDD = lastDay.getDate().toString();
    }

    if (lastDay.getMonth() < 9) {
        nMM = nMM + (lastDay.getMonth() + 1);
    } else {
        nMM = (lastDay.getMonth() + 1).toString();
    }
   // this.timeAllowenceForm.controls['TillDate'].setValue(nDD + '/' + nMM + '/' + inputTillDate.getFullYear());

    var amt = 0;
    var remaingPeriod = 0;
    var nBalance = Number(this.timeAllowenceForm.value.CurrentBalance);
    var nNofInstallment = Number(this.timeAllowenceForm.value.RemNoOfInstallment);

    var nInstallAmount = 0;
    var nLastInstallAmount = 0;

    dYY = this.timeAllowenceForm.value.FromDate.substr(6, 4);
    dMM = this.timeAllowenceForm.value.FromDate.substr(3, 2);
    dDD = this.timeAllowenceForm.value.FromDate.substr(0, 2);
    var fDate = new Date((dYY + '-' + dMM + '-' + dDD));

    //alert(fDate);

    console.log(fDate,'\n',this.timeAllowenceForm.value.TillDate);
    var check = this.timeAllowenceForm.value.TillDate.toString();
    console.log(check.length);
    if(check.length>10){
      var value = this.datepipe.transform(this.timeAllowenceForm.value.TillDate, 'dd-MM-yyyy');
      this.timeAllowenceForm.value.TillDate = this.timeAllowenceService.convertDateToString(value);
    }

    dYY = this.timeAllowenceForm.value.TillDate.toString().substr(6, 4);
    dMM = this.timeAllowenceForm.value.TillDate.toString().substr(3, 2);
    dDD = this.timeAllowenceForm.value.TillDate.toString().substr(0, 2);
    var tDate = new Date((dYY + '-' + dMM + '-' + dDD));

    console.log(tDate);
    //alert(tDate);
    console.log(dDD,' ', dMM, ' ', dYY, ' ',lastDay.getDate() )
    //alert(lastDay.getDate());
    tDate = new Date((dYY + '-' + dMM + '-' + lastDay.getDate()));
    console.log(tDate, '\n', fDate);

    //var dDiff = new Date(tDate - fDate);

    //dYY = (dDiff.toISOString().slice(0, 4) - 1970);
    //dMM = dDiff.getMonth();
    dMM = Number(tDate.getMonth() - fDate.getMonth())+1;
    if (dMM == 0) {
        dMM = (dMM + 1);
    }
    
    //$("#<%=lblMsg.ClientID%>").html(dYY + '-' + dMM + '-' + dDD);
    if(dMM<0){
      dMM = this.tempTimeAllowence;
    }
    if (dMM > 0) {
        remaingPeriod = nNofInstallment - dMM;
    } else {
        remaingPeriod = nNofInstallment - dMM;
    }

    console.log(nNofInstallment,'\n', dMM);

    this.timeAllowenceForm.controls['TimeAllowancePeriod'].setValue(dMM);

    remaingPeriod = parseInt(remaingPeriod.toString());
    this.timeAllowenceForm.controls['NewNoOfInstallment'].setValue(remaingPeriod);

    if (remaingPeriod > 0) {
        nInstallAmount = Math.round((nBalance / remaingPeriod));

        this.timeAllowenceForm.controls['NewInstallmentAmount'].setValue(remaingPeriod);

        nLastInstallAmount = nBalance - (nInstallAmount * remaingPeriod);

        if (nLastInstallAmount > 0) {
            nLastInstallAmount = nLastInstallAmount + nInstallAmount;
        } else {
            nLastInstallAmount = nInstallAmount + nLastInstallAmount;
        }

        this.timeAllowenceForm.controls['NewLastInstallmentAmount'].setValue(remaingPeriod);
    }


   // var sdt = new Date('1972-11-30');
    //var difdt = new Date(new Date() - sdt);
   // alert((difdt.toISOString().slice(0, 4) - 1970) + "Y " + (difdt.getMonth() + 1) + "M " + difdt.getDate() + "D");
  }

  tillDateChange(){
    console.log(this.timeAllowenceForm.value.TillDate);
    var tempo = this.datepipe.transform(this.timeAllowenceForm.value.TillDate, 'dd-MM-yyyy');

    if(this.timeAllowenceForm.value.TillDate!='' && this.timeAllowenceService.convertDateToString(tempo)!=this.tempTillDate){
      var fv = this.timeAllowenceForm.value;
      console.log(fv.TillDate);
      var value = this.datepipe.transform(fv.TillDate, 'dd-MM-yyyy');
      this.timeAllowenceForm.value.TillDate = this.timeAllowenceService.convertDateToString(value);
      console.log(this.timeAllowenceForm.value.TillDate);

      var dYY = this.timeAllowenceForm.value.FromDate.toString().substr(6, 4);
      var dMM = this.timeAllowenceForm.value.FromDate.toString().substr(3, 2);
      var dDD = this.timeAllowenceForm.value.FromDate.toString().substr(0, 2);
      var inputFromDate = new Date((dYY + '-' + dMM + '-' + dDD));            
      console.log(this.timeAllowenceForm.value.TillDate)
      dYY = this.timeAllowenceForm.value.TillDate.toString().substr(6, 4);
      dMM = this.timeAllowenceForm.value.TillDate.toString().substr(3, 2);
      dDD = this.timeAllowenceForm.value.TillDate.toString().substr(0, 2);

      var inputTillDate = new Date((dYY + '-' + dMM + '-' + dDD));
      dYY = this.tempTillDate.substr(6, 4);
      dMM = this.tempTillDate.substr(3, 2);
      dDD = this.tempTillDate.substr(0, 2);

      console.log(Number(inputTillDate.getFullYear())-Number(inputFromDate.getFullYear()),'\n',Number(dMM),'\n',Number(inputFromDate.getMonth()));
      if(Number(inputTillDate.getFullYear())<Number(dYY)){
        this.timeAllowenceForm.controls['TillDate'].setValue(this.tempTillDate);
        this.toaster.error('Year can not be less.');
      }
      else if(Math.abs(Number(inputTillDate.getFullYear())-Number(inputFromDate.getFullYear()))>1){
        this.timeAllowenceForm.controls['TillDate'].setValue(this.tempTillDate);
        this.toaster.error('Not possible.');
      }
      else if(Number(inputTillDate.getFullYear())-Number(inputFromDate.getFullYear())==0 && Number(this.timeAllowenceForm.value.TillDate.toString().substr(3, 2))<Number(inputFromDate.getMonth())){
        this.timeAllowenceForm.controls['TillDate'].setValue(this.tempTillDate);
        this.toaster.error('Not possible.');
      }
      else if(Number(inputTillDate.getDate())!=Number(dDD)){
        this.timeAllowenceForm.controls['TillDate'].setValue(this.tempTillDate);
        this.toaster.error('Not possible.');
      }
      else{
        if(Number(inputTillDate.getFullYear()>Number(inputFromDate.getFullYear()))){
          var tot = 12 - Number(inputFromDate.getMonth()) + 1;
          tot+= Number(inputTillDate.getMonth());
          if(tot>11){
            this.timeAllowenceForm.controls['TillDate'].setValue(this.tempTillDate);
            this.toaster.error('Not possible.');
          }
          else{
            this.tempTimeAllowence = tot;
            this.timeAllowenceForm.controls['TimeAllowancePeriod'].setValue(tot);
          }
        }
        else{
            this.tempTimeAllowence = Number(inputTillDate.getMonth())-Number(inputFromDate.getMonth())+1;
            this.timeAllowenceForm.controls['TimeAllowancePeriod'].setValue(Number(inputTillDate.getMonth())-Number(inputFromDate.getMonth())+1);
        }
        this.CalculateTimeAllotmentByFromTillDate();
      }
    
    }
  }
  updateData(){
    if(this.timeAllowenceForm.value.MemberNo==''){
      this.toaster.error('Please Enter Member No');
    }
    else if(this.timeAllowenceForm.value.AccNo==''){
      this.toaster.error('Please select an Account No.');
    }
    else{
      if(this.timeAllowenceForm.value.TillDate.toString().length>10){
        var value = this.datepipe.transform(this.timeAllowenceForm.value.TillDate, 'dd-MM-yyyy');
        this.timeAllowenceForm.value.TillDate = this.timeAllowenceService.convertDateToString(value);
      }

      console.log(this.timeAllowenceForm.value);
      this.timeAllowenceService.timeAllowenceUpdateData(this.timeAllowenceForm.value).pipe(first()).subscribe((x:any)=>{
        if(x==1){
          this.toaster.success('Data updated successfully');
          this.ngOnInit();
        }else{
          this.toaster.error('Data did not updated Successfully.');
        }
      })
    }
    
  }
}
