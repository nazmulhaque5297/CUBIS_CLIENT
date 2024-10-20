import { Component, OnInit, Input } from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';

import { HouseKeepingService } from '../../house-keeping/house-keeping.service';
import { ApplicationCommonService } from '../../../services/application-common.service';
import { UserMenu, UserInfo } from '../../Models/commonModels';
import { Router, ActivatedRoute } from '@angular/router';
//ngrx
import { Store, select } from '@ngrx/store';
import * as UserActions from '../../../actions/user.actions';
import * as UserSelectors from '../../../selector/user.selectors';
import { IApplicationCommonModel } from 'src/app/Models/Common.model';
import { Subject } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  commonData: IApplicationCommonModel;
  dataList: UserInfo;
  today: any;
  @Input() module = '';
  moduleList: any = [
    {
      id: '1',
      name: 'accounting',
    },
    {
      id: '3',
      name: 'booth',
    },
    {
      id: '2',
      name: 'housekeeping',
    },
  ];
  menuList: UserMenu[] = [];

  constructor(
    private houseKeepingService: HouseKeepingService,
    private applicationCommonService: ApplicationCommonService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.store
      .pipe(select(UserSelectors.getCommonData))
      .subscribe((cData: IApplicationCommonModel) => {
        if (cData) {
          this.commonData = cData;
        } else {
          this.setCommonData();
        }
      });

    this.store
      .pipe(select(UserSelectors.getUserInfo))
      .subscribe((userInfo: UserInfo) => {
        if (userInfo) {
          this.dataList = userInfo;
        } else {
          this.getUserInfo();
        }
      });
    this.store
      .pipe(select(UserSelectors.getMenuList))
      .subscribe((menuList: UserMenu[]) => {
        if (menuList.length > 0) {
          console.log("MenueList===>",menuList);
          this.menuList = menuList;
        } else {
          this.setMenuList();
        }
      });
    this.store.dispatch(new UserActions.LoadMenuLists({ data: this.module }));
  }

  removeBackendToken(): void {
    this.authenticationService.RemoveBackendToken().subscribe((x: any) => {});
  }

  setMenuList = () => {
    this.houseKeepingService
      .getMenuList(+this.module)
      .pipe(first())
      .subscribe(
        (menu: UserMenu[]) => {
          new UserActions.LoadMenuListsSuccess({ data: menu });
          this.menuList = menu;
        },
        (err) => {
          console.log(err);
        }
      );
    this.menuList = [];
  };

  getMenuListParentById = (id) => {
    let list = this.menuList;
    return list.filter((x) => x.MenuParentNo == id);
  };
  getMenuListParentByIdGetLength = (id) => {
    let list = this.menuList;
    let returnData = list.filter((x) => x.MenuParentNo == id);
    return returnData.length;
  };
  createRouteName = (nameString) => {
    let moduleName = this.moduleList.find((x) => x.id == this.module);
    if (nameString) {
      let routeString = nameString.replace(/\s+/g, '-').toLowerCase();
      let newrouteString = routeString
        .toString()
        .replace("user's", 'user')
        .replaceAll('/', '-')
        .replaceAll('&', 'and')
        .replaceAll('[', '')
        .replaceAll(']', '');
      return `/${moduleName.name}/` + newrouteString;
    } else {
      return '';
    }
  };
  getUserInfo = () => {
    this.houseKeepingService
      .getUserInfo('GetUserDetails')
      .pipe(first())
      .subscribe(
        (x: UserInfo) => {
          this.dataList = x;
          this.store.dispatch(new UserActions.LoadUsers());
        },
        (err) => {
          console.log(err);
        }
      );
  };
  setCommonData = () => {
    this.applicationCommonService
      .getApplicationCommonData()
      .pipe(first())
      .subscribe(
        (x: IApplicationCommonModel) => {
          this.commonData = x;
          this.store.dispatch(new UserActions.LoadCommonData());
        },
        (err) => {
          console.log(err);
        }
      );
  };
}
