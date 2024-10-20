import { createFeatureSelector, createSelector } from '@ngrx/store';
import {State} from "../reducers/user.reducer";

const getUserInfoFeatureState = createFeatureSelector<State>('user');

export const getCommonData = createSelector(
  getUserInfoFeatureState, state => state.commonData
)
export const getUserInfo = createSelector(
  getUserInfoFeatureState, state => state.userInfo
)
export const getMenuList = createSelector(
  getUserInfoFeatureState, state => state.MenuList
)
export const getUserInfoError = createSelector(
  getUserInfoFeatureState, state => state.error
)

export const getModuleNo = createSelector(
  getUserInfoFeatureState, state => state.moduleNo
)

