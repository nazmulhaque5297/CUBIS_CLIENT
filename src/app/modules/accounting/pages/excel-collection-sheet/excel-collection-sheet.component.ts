import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ExcelCollectionSheetModel, ExcelSheetCollectionDataModel, ExcelSheetCollectionVerifyParam } from 'src/app/Models/excel-collection-sheet.model';
import { ExcelCollectionSheetService } from 'src/app/services/excel-collection-sheet.service';
import { takeUntil } from 'rxjs/operators';
import { SelectListFilter } from 'src/app/filters/select-list-filter';

@Component({
  selector: 'app-excel-collection-sheet',
  templateUrl: './excel-collection-sheet.component.html',
  styleUrls: ['./excel-collection-sheet.component.css']
})
export class ExcelCollectionSheetComponent implements OnInit,OnDestroy {

  dataList: ExcelSheetCollectionDataModel[] = [];
  excelCollectionForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  public excelCollectionSheetModel : ExcelCollectionSheetModel=new ExcelCollectionSheetModel();

  constructor( private fb: FormBuilder,
    private toaster: ToastrService,
    private pService: ExcelCollectionSheetService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getInputHelp();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm() {
    this.excelCollectionForm = this.fb.group({
      OptionId: new FormControl(1),
      UserId:new FormControl(''),
      UserCode:new FormControl(''),
      FromDate:new FormControl(),
      ToDate:new FormControl(),
      ChkOldMemNo:new FormControl(false)
    });
  }

  private getInputHelp(): void {
    this.spinner.show();
    this.pService.GetDefaultData().pipe(takeUntil(this.destroy$)).subscribe((data) => {
       this.excelCollectionSheetModel=data;
       this.excelCollectionForm.controls['FromDate'].setValue(data.ProcessDate);
       this.excelCollectionForm.controls['ToDate'].setValue(data.ProcessDate);
       this.spinner.hide();
      });
  }

  onUserChange(value:number):void{
    var item = new SelectListFilter().getItem(this.excelCollectionSheetModel.UserList,value);
    this.excelCollectionForm.controls['UserId'].setValue(
      item != null ? item.Id : ''
    );
    this.excelCollectionForm.controls['UserCode'].setValue(
      item != null ? item.Id.toString() : ''
    );
  }

  onLoadGlList():void{
    var fValue=this.excelCollectionForm.value as ExcelSheetCollectionVerifyParam;
    this.spinner.show();
    this.pService.GetGlList(fValue.OptionId).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.spinner.hide();
      this.dataList=data;
    });
  }

  onSave():void{
    var fValue=this.excelCollectionForm.value as ExcelSheetCollectionVerifyParam;
    fValue.Data=this.dataList;
    this.spinner.show();
    this.pService.SaveSerial(fValue).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.spinner.hide();
      if(!data.Success){
        alert(data.Message);
        return;
      }
      alert("Column No. updated successfully.");
    });
  }

  onVerifyColumn():void{
    var fValue=this.excelCollectionForm.value as ExcelSheetCollectionVerifyParam;
    this.spinner.show();
    this.pService.Verify(fValue).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.spinner.hide();
      this.dataList=data.Data;
      if(!data.Success){
        alert(data.Message);
        return;
      }
      alert(data.Message);
     });
  }

  onExportToExcel():void{
    this.spinner.show();
    var fValue=this.excelCollectionForm.value as ExcelSheetCollectionVerifyParam;
    this.pService.ExportToExcel(false,fValue.OptionId).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      let link = document.createElement("a");

      if (link.download !== undefined) {
        let url = URL.createObjectURL(data);
        link.setAttribute("href", url);
        link.setAttribute("download", fValue.OptionId==1?'depositCollection':'disbursementCollection');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      this.spinner.hide();
     
     });
  }

}
