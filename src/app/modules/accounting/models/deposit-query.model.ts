import { IdDescription } from 'src/app/interfaces/id-description';

export class DepositQueryInputHelp {
  UserCashCode?: string;
  AccountTypeList: IdDescription[];
  ShowOldAccNo: boolean;
  PrintFOptFlag: any;
  PrintFlag: any;
  ManualAccNo:number;
}

export class DepositQueryDataModel {
  Success: false;
  Message: string;
  MemberNo?: number;
  MemType?: number;
  BranchNo?: number;
  MemRegNo?: number;
  MemSubRegNo?: number;
  PreMobile?: string;
  MemberName?: string;
  MemColCode?: string;
  AccountTypeClassId?: number;
  FuncOpt?: string;
  AccBalance?: number;
  UserCashCode?: string;
  CtrlProcDate?: string;
  AccEffectDate?: string;
  CorrAccDetails?: IDepositQueryCorrAccModel;
  GroupAccounts: IDepositQueryTransactionModel[];
  Transactions?: IDepositQueryTransactionModel[];
}

export interface IDepositQueryCorrAccModel {
  CorrAccountNo?: string;
  CorrAccountBalance?: number;
  MemType?: number;
  MemberNo?: number;
  AccStatus?: number;
  AccBalance?: number;
  AccLienAmt?: number;
  RemainingBalance?: number;
  AccType?: number;
  AccProductGLCode?: number;
}

export interface DepositQueryCreateModel {
  UserCashCode?: string;
  MemColCode?: string;
  IsCashDeposit?: boolean;
  AutoVchflag?: Boolean;
  AccountTypeCode?: string;
  AccountTypeId?: number;
  AccountNo?: string;
  CorrAccountNo?: string;
  CorrAccountBalance?: number;
  OldAccountNo?: string;
  ManualAccountNo?: string;
  MemberNo?: string;
  VoucherNo?: string;
  MemType?: number;
  MemRegNo?: number;
  MemSubRegNo?: number;
  AccTypeClass?: number;
  AccProductGLCode?: number;
  TotalAmount?: number;
  CtrlProcDate?: string;
  DepositQueryModel?: DepositQueryDataModel;
  Transactions: IDepositQueryTransactionModel[];
}

export interface IDepositQueryTransactionModel {
  Id?: number;
  GLAccNo?: number;
  GLAccDesc?: string;
  TrnAmount?: number;
  AccType?: number;
  AccNo?: number;
  AccBalance?: number;
  MarkRecord?: number;
  PayTypeCode?: number;
  PayTypeDes?: string;
  LoanPrincFlag?: number;
  AccOldNumber?: string;
  AccPrevNumber?: string;
  Selected?: boolean;
}

export interface IAmountChangeResponse {
  Success?: boolean;
  Message?: string;
  Transactions?: IDepositQueryTransactionModel[];
}

export class OldMemberViewModel {
  Success: false;
  Message: string;
  MemNo?: number;
  MemType?: number;
  OldMemNo?: number;
  AccType?: number;
}
