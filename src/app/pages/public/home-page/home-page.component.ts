import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { first, takeUntil } from 'rxjs/operators';
import { HomePageService } from 'src/app/services/home-page.service';
import { Router } from '@angular/router'
import {IProcessStartDateModel, UserModule} from "../../../Models/Common.model"
import { HouseKeepingService } from '../../../modules/house-keeping/house-keeping.service';
import { UserMenu, UserInfo } from '../../../modules/Models/commonModels';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

//ngrx
import { Store, select } from '@ngrx/store';
import * as UserActions from '../../../actions/user.actions';
import * as UserSelectors from '../../../selector/user.selectors';
import { Subject } from 'rxjs';
import { DayStartProcessComponent } from '../day-start-process/day-start-process.component';
import { DayStartProcessService } from 'src/app/services/day-start-process.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit,OnDestroy {
  dataList:UserModule[] = [];
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private router: Router,
    private homePageService: HomePageService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private houseKeepingService :HouseKeepingService,
    private dayStartService: DayStartProcessService,
    private modalService: NgbModal,
    private store: Store) {

     }
  ngOnInit(): void {
    this.getDataList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getDataList = () => {
    this.spinner.show();
    this.homePageService.getDataList().pipe(first()).subscribe((x: UserModule[]) => {
      this.spinner.hide();
      this.dataList = x;
    }, err => {
      this.spinner.hide();
    })

    this.homePageService.getUserStatus().pipe(first()).subscribe((x: UserInfo) => {
      if(x.ResetPassword){
        this.router.navigate(['change-password']);
      }
    })
  
  }

  checkProcessStartDate(module){
    this.spinner.show();
    this.dayStartService.CheckProcessStartDate(module.ModuleNo).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      if(data.Success){
        this.getMenuListModule(module);
      }
      else if(!data.Success && !data.OpenPopup){
        this.toaster.error(data.Message);
        this.spinner.hide();
      }
      else if(!data.Success && data.OpenPopup){
        //open process start popup
        this.spinner.hide();
        this.openProcessStartPopup(data,module);
      }
      else{
        this.getMenuListModule(module);
      }

     
    });
  }

openProcessStartPopup(data:IProcessStartDateModel,module:any){
  const modalRef = this.modalService.open(DayStartProcessComponent,
    { size: 'lg', backdrop: 'static', keyboard: false });
    (<DayStartProcessComponent>modalRef.componentInstance).itemOb = data;
    modalRef.result.then((result) =>{
      if(result){
        this.getMenuListModule(module);
      }
    }).catch((result) =>{
      console.log(result);
    });
}

  getMenuListModule=(module)=>{
    this.houseKeepingService.getMenuList(module.ModuleNo).pipe(first()).subscribe((menu: UserMenu[]) => {
      this.spinner.hide();
      if(module.ModuleNo==1){
        this.router.navigate(['/accounting']);
      }else if(module.ModuleNo==3){
        this.router.navigate(['/booth']);
      }else if(module.ModuleNo==2){
        this.router.navigate(['/housekeeping']);
      }
      this.store.dispatch(new UserActions.LoadMenuListsSuccess({data : menu}))
      this.store.dispatch(new UserActions.LoadModuleNo({data : module.ModuleNo}))
    }, err => {
      this.spinner.hide();
    })
  }

}
