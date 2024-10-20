import { IdDescription } from '../interfaces/id-description';

export interface UserModule {
  Id: Number;
  UserId: Number;
  ModuleNo: Number;
  ModuleName: String;
}

export interface UserInfo {
  IdsNo: Number;
  IdsPass: String;
  IdsLevel: Number;
  IdsLogInFlag: Number;
  IdsLockFlag: Number;
  IdsName: String;
  IdsFlag: Number;
  IdsType: Number;
  IdsStatus: Number;
  EmpCode: Number;
  UserId: any;
  GLCashCode: Number;
  GLCashCodeDescription: any;
  UserBranchNo: Number;
  CreateDate: any;
  module: any;
  SODflag: Boolean;
  CSVPrintflag: Boolean;
  GLVPrintflag: Boolean;
  AutoVchflag: Boolean;
  IdsLogInTable: Number;
  SMSflag: Boolean;
  CompanyId: Number;
  LIdsCashCredit: any;
  LIdsCashDebit: any;
  LIdsTrfCredit: any;
  LIdsTrfDebit: any;
  ResetPassword?: boolean;
}

export interface MenuList {
  ModuleNo: Number;
  MenuNo: Number;
  MenuName: String;
  MenuParentNo: Number;
}

export interface IProcessStartDateModel {
  Success?: boolean;
  OpenPopup?: boolean;
  Message?: string;
  LastTransactionDate?: string;
  NewProcessDate?: string;
  LastYear?: number;
  NewYear?: number;
  PrevProcessDate?: string;
  ChangeProcessDate?: string;
  StartOfDay?: string;
  ChangeNotes?: string;
  HolidayType?: number;
  HolidayTypeDescription?: string;
  NewProcessDateShort?: string;
}

export class MemberBasicInfo {
  Success?: boolean;
  Message?: string;
  MemberNo?: number;
  MemType?: number;
  BranchNo?: number;
  MemRegNo?: number;
  MemSubRegNo?: number;
  MemberName: string;
  VPrintFlag: string;
  VPrintFOptFlag: string;
  MemColCode?: number;
  AccountTyeList?: IdDescription[];
}

export interface IApplicationCommonModel {
  ProcessDate?: string;
  FormatProcessDate?: string;
  FormatCurrentDate?: string;
  CurrentDate?: string;
  UserCashCode?: number;
  UserCashCodeDescription?: string;
  PrmCSAutoVchCtrl?: number;
  PrmGLAutoVchCtr?: number;
  FinancialMonth?: number;
  FinancialBegYear?: number;
  FinancialEndYear?: number;
  CurrentMonth?: number;
  CurrentYear?: number;
  MemCollectorFlag?: boolean;
  MemGroupFlag?: boolean;
  BranchName?: string;
}
