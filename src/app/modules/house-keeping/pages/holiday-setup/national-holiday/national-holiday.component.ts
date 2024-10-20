import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SelectListFilter } from 'src/app/filters/select-list-filter';
import { IdDescription } from 'src/app/interfaces/id-description';
import { MemberApplicationInputHelp } from 'src/app/modules/accounting/models/member-application.model';
import { MemberApplicationService } from 'src/app/services/member-application.service';
import { INationalHolidayViewModel } from '../../../models/holiday-setup-model';
import { HolidaySetupService } from '../../../services/holiday-setup.service';

@Component({
  selector: 'app-national-holiday',
  templateUrl: './national-holiday.component.html',
  styleUrls: ['./national-holiday.component.css']
})
export class NationalHolidayComponent implements OnInit,OnDestroy {
  bsValue = new Date();
  public typeList: IdDescription[]=[];
  public holidayList: INationalHolidayViewModel[]=[];
  setupForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  ShowList: boolean = false;
  submitButtonText:string="Submit";
  public inputHelpData: MemberApplicationInputHelp =
  new MemberApplicationInputHelp();
  
  constructor(private pService: HolidaySetupService, 
    private spinner: NgxSpinnerService,
    private applicationService: MemberApplicationService,
    private fb: FormBuilder,
    private toaster: ToastrService) {
     }

  ngOnInit(): void {
    this.initializeForm();
    this.getTypeList();
    this.applicationService
    .getInputHelp()
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      this.inputHelpData = data;
      console.log('This is application date');
      console.log('This is InputData', this.inputHelpData);
      this.setupForm.controls['HolidayDate'].setValue(
        data.ApplicationDate
      );
      this.spinner.hide();
    });
  }

  private initializeForm() {
    this.setupForm = this.fb.group({
      HolType: new FormControl(''),
      HolNote: new FormControl(''),
      HolidayDate: new FormControl('')
    });
  }

  private getTypeList(): void {
    this.spinner.show();
    this.pService.GetNationalHolidayTypes().pipe(takeUntil(this.destroy$)).subscribe((data) => {
        this.typeList = data;
        this.spinner.hide();
      });
  }

  private getHolidayList(): void {
    this.spinner.show();
    this.pService.GetNationalHolidayList().pipe(takeUntil(this.destroy$)).subscribe((data) => {
        this.holidayList = data;
        this.spinner.hide();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  dateChecker(){
    var opDate = this.inputHelpData.ApplicationDate;
    var arrOpDate = opDate.split('/');
    var fOpDate = arrOpDate[2]+'-'+arrOpDate[1]+'-'+arrOpDate[0];
    var arrPros = new Date(fOpDate);
    var value = new Date(this.setupForm.value.HolidayDate);
    console.log("opdate", opDate);
    console.log("value", value)
    if(value<arrPros){
      alert("Previous Date Not Accepted");
      this.ngOnInit();
      return;
    }
  }

  ViewList():void{
    this.ShowList=true;
    this.getHolidayList();
  }

  SaveOrUpdate():void{
    if (this.setupForm.value.HolType == 0) {
      alert('Please Select Holiday Type!');
      return;
    }
    else if(this.setupForm.value.HolNote == '' || this.setupForm.value.HolType == 0){
      alert('Please Enter Holiday Note!');
      return;
    }
    this.spinner.show();
    var fValue = this.setupForm.value;
    this.pService.SubmitNationalHoliday(fValue).pipe(takeUntil(this.destroy$)).subscribe((data) => {
        this.spinner.hide();
        alert('Data updated successfully');
        this.ngOnInit();
        this.ViewList();
      });
  }

}
