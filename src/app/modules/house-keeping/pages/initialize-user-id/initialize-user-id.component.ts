import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SelectListFilter } from 'src/app/filters/select-list-filter';
import { IdDescription } from 'src/app/interfaces/id-description';
import { ILockedUser } from 'src/app/Models/locked-user.model';
import { HouseKeepingService } from '../../house-keeping.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-initialize-user-id',
  templateUrl: './initialize-user-id.component.html',
  styleUrls: ['./initialize-user-id.component.css']
})
export class InitializeUserIdComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  UserInitializeControlForm: FormGroup;
  public lockedUserList:ILockedUser[]=[];
  public userNameIdList:IdDescription[]=[];

  constructor(private houseKeepingService: HouseKeepingService, 
    private toaster: ToastrService,
    private spinner: NgxSpinnerService) { }


  ngOnInit(): void {
    this.initializeForm();
    this.getLockedUserList();
  }

  private initializeForm(){
    this.UserInitializeControlForm = new FormGroup({
      IDNumber: new FormControl("", [Validators.required]),
      selectedOptionCode: new FormControl("0"),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getLockedUserList(): void {
    this.userNameIdList=[];
    this.houseKeepingService.GetLockedUsers().pipe(takeUntil(this.destroy$)).subscribe((data) => {
        this.lockedUserList = data;
        this.lockedUserList.forEach(x=>{
          var v:IdDescription={Id:Number(x.IdsNo),Description:x.IdsName};
          this.userNameIdList.push(v);
        });
      });
  }

  onUserNameChange(id:number):void{
    var item= new SelectListFilter().getItem(this.userNameIdList,id);
    const ddlValue=item!=null?item.Id:0;
    const inputFieldValue=item!=null?item.Id.toString():'';
    this.UserInitializeControlForm.controls['IDNumber'].setValue(inputFieldValue);
    this.UserInitializeControlForm.controls['selectedOptionCode'].setValue(ddlValue);
  }

  onUnlockUser(id:number):void{
    if (this.UserInitializeControlForm.invalid) {
      this.toaster.warning('Please fill all the required field!');
      return;
    }
    this.spinner.show();
    this.houseKeepingService.UnlockUser(id).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.spinner.hide();
      this.toaster.success("Removed from locked");
      this.getLockedUserList();
      this.onUserNameChange(0);
    });
  }

}
