import { IdDescription } from 'src/app/interfaces/id-description';

export class AdjustmentInputHelp {
  UserCashCode?: string;
  AccountTypeList: IdDescription[];
  TransactionTypeList: IdDescription[];
  BankList: IdDescription[];
  AccountHeadList: IdDescription[];
  Transactions: IAdjustmentTransactionModel[];
  ShowOldAccNo: boolean;
  PrintFOptFlag: number;
  PrintFlag: any;
  ManualAccNo:number;
}

export interface AdjustmentAccountViewModel {
  Success?: boolean;
  HasMultipleAccount?: boolean;
  Message?: string;
  AccTypeCode?: number;
  AccProductGLCode?: number;
  AccTypeClass?: number;
}

export class AdjustmentDataModel {
  Success: false;
  Message: string;
  MemberNo?: number;
  MemType?: number;
  MemRegNo?: number;
  MemSubRegNo?: number;
  PreMobile: string;
  MemberName: string;
  GLCashCode: string;
  TotalDrAmount?: number;
  TotalCrAmount?: number;
  FuncOpt: string;
  AccountTypeId?: number;
  VoucherNo?: number;
  AccProductGLCode?: number;
  AccTypeClass?: number;
  AccountNo?: string;
  CorrAccountNo?: string;
  AccountDetails?: IAdjustmentAccountDetails;
  Transactions?: IAdjustmentTransactionModel[];
  HasMultipleAccount?: boolean;
  GroupAccounts?: IAdjustmentTransactionModel[];
}

export interface AdjustmentCreateModel {
  AutoVchflag?: Boolean;
  UserCashCode?: string;
  AccountTypeCode?: string;
  AccountTypeId?: number;
  AccountNo?: string;
  OldAccountNo?: string;
  ManualAccountNo?: string;
  MemberNo?: string;
  VoucherNo?: string;
  BankChequeNo?: string;
  BankCode?: number;
  TransactionTypeCode?: number;
  TotalAmount?: number;
  MemType?: number;
  AccTypeClass?: number;
  AccProductGLCode?: number;
  TrnAmount?: number;
  Transactions: IAdjustmentTransactionModel[];
  AccountDetails?: IAdjustmentAccountDetails;
}

export interface IAdjustmentTransactionModel {
  Id?: number;
  GLAccNo?: number;
  GLAccDesc?: string;
  DebitAmount?: number;
  CreditAmount?: number;
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

export interface TransResponseModel {
  Success?: boolean;
  Message?: string;
  Transactions?: IAdjustmentTransactionModel[];
  GlContraList?: IdDescription[];
}

export interface IAdjustmentAccountDetails {
  Success?: boolean;
  Message?: string;

  MemberNo?: number;
  MemType?: number;
  BranchNo?: number;
  MemRegNo?: number;
  MemSubRegNo?: number;
  PreMobile?: string;
  MemberName?: string;
  AccountNo?: string;

  CtrlAccType?: number;
  AccStatus?: string;
  AccAtyClass?: string;
  OldAccountNo?: string;
  LadgerBalance?: string;
  OpenDate?: string;
  Period?: string;
  MatruityDate?: string;
  CertNo?: string;

  LienAmt?: string;
  LastTrnDate?: string;

  BalanceAmount?: number;
  LienAmount?: number;
}

export class OldMemberViewModel {
  Success: false;
  Message: string;
  MemNo?: number;
  MemType?: number;
  OldMemNo?: number;
  AccType?: number;
}
