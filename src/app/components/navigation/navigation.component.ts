import { Component, OnInit } from '@angular/core';
import { UserInfo, MenuList, IApplicationCommonModel } from '../../Models/Common.model';

//ngrx
import { Store, select } from '@ngrx/store';
import * as UserActions from '../../actions/user.actions';
import * as UserSelectors from '../../selector/user.selectors';
import { Subject } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  UserData: UserInfo;
  menuList : MenuList[];
  commonData : IApplicationCommonModel;
  constructor(
    private store: Store,
    private authenticationService:AuthenticationService
    ) {}

  ngOnInit(): void {
    this.store.dispatch(new UserActions.LoadCommonData());
    this.store.dispatch(new UserActions.LoadUsers());
    this.store.pipe(select(UserSelectors.getUserInfo)).subscribe((userInfo: UserInfo)=>{
      this.UserData = userInfo
    })
    this.store.pipe(select(UserSelectors.getCommonData)).subscribe((cData: IApplicationCommonModel)=>{
      console.log("CoomonData->>",cData)
      this.commonData = cData;
    })
  }

  removeBackendToken():void{
    this.authenticationService.RemoveBackendToken().subscribe((x: any)=>{
      
    });
  }

}
