import { Action } from '@ngrx/store';
import { UserActions, UserActionTypes } from '../actions/user.actions';
import { UserInfo, MenuList, IApplicationCommonModel } from '../Models/Common.model';

export const userFeatureKey = 'user';

export interface State {
  commonData: IApplicationCommonModel;
  userInfo: UserInfo;
  MenuList: MenuList[];
  error: string;
  moduleNo: number;
}

export const initialState: State = {
  commonData: null,
  userInfo: null,
  MenuList: [],
  error: '',
  moduleNo: null,
};

export function reducer(state = initialState, action: UserActions): State {
  switch (action.type) {
    case UserActionTypes.LoadUsers:
      return { ...state };
    case UserActionTypes.LoadUsersSuccess:
      return { ...state, userInfo: action.payload.data, error: '' };
    case UserActionTypes.LoadUsersFailure:
      return { ...state, userInfo: null, error: action.payload.error };
    case UserActionTypes.LoadMenuLists:
      return { ...state };
    case UserActionTypes.LoadMenuListsSuccess:
      return { ...state, MenuList: action.payload.data };
    case UserActionTypes.LoadUsersFailure:
      return { ...state, userInfo: null, error: action.payload.error };
    case UserActionTypes.LoadCommonData:
      return { ...state };
    case UserActionTypes.LoadCommonDataSuccess:
      return { ...state, commonData: action.payload.data, error: '' };
    case UserActionTypes.LoadCommonDataFailure:
      return { ...state, commonData: null, error: action.payload.error };
    case UserActionTypes.LoadModuleNo:
      return { ...state, moduleNo: action.payload.data  }
    default:
      return state;
  }
}
