import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { RestoreProcessService } from '../../services/restore-process.service';


@Component({
  selector: 'app-restore-database',
  templateUrl: './restore-database.component.html',
  styleUrls: ['./restore-database.component.css']
})

export class RestoreDatabaseComponent implements OnInit {
  RestoreProcessForm: FormGroup;
  frmAddress: string;
  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private restoreProcess:RestoreProcessService,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(){
    this.RestoreProcessForm = new FormGroup({
      radioButton: new FormControl("0"),
      FromAddress: new FormControl(""),
      ToAddress: new FormControl(""),
    });
    this.inputLoadData();
  }
  inputLoadData(){
    this.spinner.show();
    this.restoreProcess.getBackupProcessPageLoad().pipe(first()).subscribe((x: any) => {
      this.spinner.hide();
      this.frmAddress = x.FromText;
      this.RestoreProcessForm.controls['FromAddress'].setValue(x.FromText);
      this.RestoreProcessForm.controls['radioButton'].setValue(x.RadioButtonValue);
    }, err => {
      this.spinner.hide();
    })
  }

  radioBtnChange(){
    console.log(this.RestoreProcessForm.value.radioButton);
    if(this.RestoreProcessForm.value.radioButton==1){
      var address = this.frmAddress.toString().trim() + "Sun\\";
      this.RestoreProcessForm.controls['FromAddress'].setValue(address);
    }
    else if(this.RestoreProcessForm.value.radioButton==2){
      var address = this.frmAddress.toString().trim() + "Mon\\";
      this.RestoreProcessForm.controls['FromAddress'].setValue(address);
    }
    else if(this.RestoreProcessForm.value.radioButton==3){
      var address = this.frmAddress.toString().trim() + "Tue\\";
      this.RestoreProcessForm.controls['FromAddress'].setValue(address);
    }
    else if(this.RestoreProcessForm.value.radioButton==4){
      var address = this.frmAddress.toString().trim() + "Wed\\";
      this.RestoreProcessForm.controls['FromAddress'].setValue(address);
    }
    else if(this.RestoreProcessForm.value.radioButton==5){
      var address = this.frmAddress.toString().trim() + "Thu\\";
      this.RestoreProcessForm.controls['FromAddress'].setValue(address);
    }
    else if(this.RestoreProcessForm.value.radioButton==6){
      var address = this.frmAddress.toString().trim() + "Fri\\";
      this.RestoreProcessForm.controls['FromAddress'].setValue(address);
    }
    else{
      var address = this.frmAddress.toString().trim() + "Sat\\";
      this.RestoreProcessForm.controls['FromAddress'].setValue(address);
    }
  }

  restoreBtnClick(){
    if(this.RestoreProcessForm.value.radioButton=='0'){
      this.toastr.warning("Please select the day.!"); return;
    }
    this.spinner.show();
    this.restoreProcess.setBackupProcess(this.RestoreProcessForm.value.FromAddress).pipe(first()).subscribe((x:any)=>{
      this.spinner.hide();
      if(x.Success){
        this.toastr.success("Database Restore Successfully Done");
      }
      else{
        this.toastr.warning(x.Message);
      }

    })
  }

  exitPage(){
    this.router.navigate(['housekeeping/']);
  }

}

