import { Component, OnInit } from '@angular/core';
import { DayEndProcessTestService } from 'src/app/services/day-end-process-test.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IDayEndProcessWrongAccount } from '../../models/day-end-process-test.model';
import { FormControl, FormGroup } from '@angular/forms';
import { WrongAccounts } from '../../models/day-end-process-test.model';
import {
  ApiResponse,
} from 'src/app/interfaces/api-response';

@Component({
  selector: 'app-day-end-process-test',
  templateUrl: './day-end-process-test.component.html',
  styleUrls: ['./day-end-process-test.component.css']
})

export class DayEndProcessTestComponent implements OnInit {

  private destroy$: Subject<void> = new Subject<void>();
  
  public wrongAccountList : IDayEndProcessWrongAccount[] | undefined;

  //public wrongAccountList : IDayEndProcessWrongAccount[] = [];
  public wrongAccoutData : IDayEndProcessWrongAccount;
  public wrongAccountUpdateData : IDayEndProcessWrongAccount;

  public addAcountActive : boolean = false;
  public updateAccountActive: boolean = false;
  public deleteAccountActive: boolean = false;

  public updateAccountActiveSelected : boolean = false;
  public deleteAccountActiveSelected : boolean = false;

  public WrongAccountForm : FormGroup;

  constructor(
    private pService: DayEndProcessTestService
    ){ }

  ngOnInit(): void {
    this.initializeForm();
    this.initializeData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  // public getWrongAccountInput(): void {
  //   this.pService.
  //   GetDayEndProcessWrongAccountData()
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((data) => {
  //       this.wrongAccountList = data;
  //     });
  // }

  public initializeData(): void {
    this.pService
      .getWrongAccount()
      .pipe(takeUntil(this.destroy$))
      .subscribe( (data) => {
        this.wrongAccountList = data;
      });
  }

  // public clearAllFlags(): void{
  //   this.addAcountActive = false;
  //   this.updateAccountActive = false;
  //   this.updateAccountActiveSelected = false;
  //   this.deleteAccountActive = false;
  // }

  // public onAddButtonClicked() : void {
  //   //this.clearAllFlags();
  //   this.addAcountActive = true;
  //   this.updateAccountActive = false;
  //   this.updateAccountActiveSelected = false;
  //   this.deleteAccountActive = false;
  // }

  // public onUpdateButtonClicked(): void{
  //   //this.clearAllFlags();
  //   this.addAcountActive = false;
  //   this.updateAccountActive = true;
  //   this.updateAccountActiveSelected = false;
  //   this.deleteAccountActive = false;
  // }

  // public onDeleteButtonClicked(): void {
  //   this.addAcountActive = false;
  //   this.updateAccountActive = false;
  //   this.updateAccountActiveSelected = false;
  //   this.deleteAccountActive = true;
  // }

  // public onUpdateSelectedButtonClicked(wrongAccount:IDayEndProcessWrongAccount): void{
  //   //this.clearAllFlags();
  //   this.wrongAccountUpdateData = wrongAccount;
  //   this.addAcountActive = false;
  //   this.updateAccountActive = false;
  //   this.updateAccountActiveSelected = true;
  //   this.deleteAccountActive = false;
  //   this.WrongAccountForm.controls['UserId'].setValue( wrongAccount.UserId );
  //   this.WrongAccountForm.controls['VoucherNo'].setValue( wrongAccount.VoucherNo );
  // }

  // public onDeleteSelectedButtonClicked(wrongAccount:IDayEndProcessWrongAccount): void{
  //   this.pService
  //     .deleteWrongAccount(wrongAccount)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((data: ApiResponse) => {
  //       if (data.Success) {
  //         //alert(data.Message);
  //         this.initializeData();
  //       } else {
  //         alert(data.Message);
  //       }
  //     });
  //     this.addAcountActive = false;
  //     this.updateAccountActive = false;
  //     this.updateAccountActiveSelected = false;
  //     this.deleteAccountActive = false;
  // }

  private initializeForm() {
    this.WrongAccountForm = new FormGroup({
      UserId: new FormControl(''),
      VoucherNo: new FormControl(''),
    });
  }

  // onSubmit(): void {
  //   this.pService
  //     .addWrongAccount(
  //       {
  //         VoucherNo: this.WrongAccountForm.value.VoucherNo,
  //         UserId: this.WrongAccountForm.value.UserId
  //       }
  //     )
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((data: ApiResponse) => {
  //       if (data.Success) {
  //         //alert(data.Message);
  //         this.initializeData();
  //       } else {
  //         alert(data.Message);
  //       }
  //     });

  //   this.addAcountActive = false;
  //   this.WrongAccountForm.controls['UserId'].setValue('');
  //   this.WrongAccountForm.controls['VoucherNo'].setValue('');
  // }

  // onSubmitUpdate(): void {
    
  //   this.pService
  //     .updateWrongAccount(
  //       {
  //         VoucherNo: this.WrongAccountForm.value.VoucherNo,
  //         UserId: this.WrongAccountForm.value.UserId
  //       }
  //     )
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((data: ApiResponse) => {
  //       if (data.Success) {
  //         //alert(data.Message);
  //         this.initializeData();
  //       } else {
  //         alert(data.Message);
  //       }
  //     });
  //     //this.initializeData();

  //   this.updateAccountActive = false;
  //   this.updateAccountActiveSelected = false;
  //   this.WrongAccountForm.controls['UserId'].setValue('');
  //   this.WrongAccountForm.controls['VoucherNo'].setValue('');
  // }


}
