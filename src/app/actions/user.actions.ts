import { Action } from '@ngrx/store';
import { UserInfo, MenuList,IApplicationCommonModel } from '../Models/Common.model';

export enum UserActionTypes {
  LoadUsers = '[User] Load Users',
  LoadUsersSuccess = '[User] Load Users Success',
  LoadUsersFailure = '[User] Load Users Failure',
  LoadMenuLists= "LOAD_USER_MENU_LIST",
  LoadMenuListsSuccess = 'LOAD_USER_MENU_LIST_SUCCESS',
  LoadMenuListFailure = 'LOAD_USER_MENU_LIST_FAILURE',
  LoadCommonData= "LOAD_COMMON_DATA",
  LoadCommonDataSuccess = 'LOAD_COMMON_DATA_SUCCESS',
  LoadCommonDataFailure = 'LOAD_COMMON_DATA_FAILURE',
  LoadModuleNo = 'LOAD_MODULE_NO',
}

export class LoadUsers implements Action {
  readonly type = UserActionTypes.LoadUsers;
}

export class LoadUsersSuccess implements Action {
  readonly type = UserActionTypes.LoadUsersSuccess;
  constructor(public payload: { data: UserInfo }) {}
}

export class LoadUsersFailure implements Action {
  readonly type = UserActionTypes.LoadUsersFailure;
  constructor(public payload: { error: any }) {}
}


export class LoadMenuLists implements Action {
  readonly type = UserActionTypes.LoadMenuLists;
  constructor(public payload: { data: string }) {}
}

export class LoadModuleNo implements Action {
  readonly type = UserActionTypes.LoadModuleNo;
  constructor(public payload: { data: number }) {}
}

export class LoadMenuListsSuccess implements Action {
  readonly type = UserActionTypes.LoadMenuListsSuccess;
  constructor(public payload: { data: MenuList[] }) {}
}

export class LoadMenuListFailure implements Action {
  readonly type = UserActionTypes.LoadMenuListFailure;
  constructor(public payload: { error: any }) {}
}

export class LoadCommonData implements Action {
  readonly type = UserActionTypes.LoadCommonData;
}

export class LoadCommonDataSuccess implements Action {
  readonly type = UserActionTypes.LoadCommonDataSuccess;
  constructor(public payload: { data: IApplicationCommonModel }) {}
}

export class LoadCommonDataFailure implements Action {
  readonly type = UserActionTypes.LoadCommonDataFailure;
  constructor(public payload: { error: any }) {}
}

export type UserActions = LoadUsers | LoadUsersSuccess | LoadUsersFailure | LoadMenuLists | LoadMenuListsSuccess | LoadMenuListFailure | LoadCommonData | LoadCommonDataSuccess| LoadCommonDataFailure | LoadModuleNo;
