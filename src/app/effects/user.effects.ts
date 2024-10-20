import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import * as UserActions from '../actions/user.actions';
import { HomePageService } from '../services/home-page.service';
import { HouseKeepingService } from '../modules/house-keeping/house-keeping.service'
import { UserInfo } from '../modules/Models/commonModels';
import {ApplicationCommonService} from 'src/app/services/application-common.service'

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions, 
    private service: HomePageService, 
    private houseKeepingService : HouseKeepingService,
    private applicationCommonService : ApplicationCommonService
    ){}

  @Effect()
  loadUser$: Observable<Action> = this.actions$.pipe(
    ofType(UserActions.UserActionTypes.LoadUsers),
    mergeMap((action) =>
      this.service.getUserInformation().pipe(
        map((user) => new UserActions.LoadUsersSuccess({ data: user })),
        catchError((err) =>
          of(new UserActions.LoadUsersFailure({ error: err }))
        )
      )
    )
  );

  loadMenuList$:Observable<Action> = this.actions$.pipe(
    ofType(UserActions.UserActionTypes.LoadMenuLists),
    mergeMap((action) =>
      this.houseKeepingService.getMenuList(action, "state").pipe(
        map((menuList) => new UserActions.LoadMenuListsSuccess({ data: menuList })),
        catchError((err) =>
          of(new UserActions.LoadUsersFailure({ error: err }))
        )
      )
    )
  );
  @Effect()   
  loadCommonData$: Observable<Action> = this.actions$.pipe(
    ofType(UserActions.UserActionTypes.LoadCommonData),
    mergeMap((action) =>
      this.applicationCommonService.getApplicationCommonData().pipe(
        map((cData) => new UserActions.LoadCommonDataSuccess({ data: cData })),
        catchError((err) =>
          of(new UserActions.LoadCommonDataFailure({ error: err }))
        )
      )
    )
  );
}
