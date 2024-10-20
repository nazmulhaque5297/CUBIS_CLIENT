import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IAutoVoucherModel } from '../../../models/system-setup-model';
import { SystemSetupService } from '../../../services/system-setup.service';


@Component({
  selector: 'app-auto-voucher-print',
  templateUrl: './auto-voucher-print.component.html',
  styleUrls: ['./auto-voucher-print.component.css']
})
export class AutoVoucherPrintComponent implements OnInit,OnDestroy {
  setupForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  public dataList: IAutoVoucherModel[]=[];
  selectedItems: FormArray

  constructor(private pService: SystemSetupService, 
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private toaster: ToastrService) {
     
     }

  ngOnInit(): void {
    this.getDataList();
    this.setupForm = this.fb.group({
      selectedItems: this.fb.array([])
    });
  }

  public addItem(x: IAutoVoucherModel): void {
    this.selectedItems = this.setupForm.get('selectedItems') as FormArray;
    this.selectedItems.push(this.AddToItems(x));
  }

  
  private AddToItems(x: IAutoVoucherModel): FormGroup {
    return this.fb.group({
      Id: [x.Id],
      FuncOpt: [x.FuncOpt],
      FuncOptDesc: [x.FuncOptDesc],
      IsChecked: [x.IsChecked]
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getDataList(): void {
    this.spinner.show();
    this.pService.GetFuncOptList().pipe(takeUntil(this.destroy$)).subscribe((data) => {
        this.dataList = data;
        data.forEach(x => {
          this.addItem(x);
        });
        this.spinner.hide();
      });
  }

  SetMark(sValue:boolean):void{
    this.selectedItems = this.setupForm.get('selectedItems') as FormArray;
    this.selectedItems.controls.map(value => value.get('IsChecked').setValue(sValue));
  }

  Update():void{
    this.spinner.show();
    var fValue=this.setupForm.value.selectedItems;
    this.pService.UpdateAutoVoucherPrint(fValue).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.spinner.hide();
      alert('Data updated successfully');
    });
  }

}
