import { IdDescription } from 'src/app/interfaces/id-description';

export class WithdrawalViewModel {
  ShowGLBankCode: boolean;
  ShowChqNo: boolean;
  ShowLoanDefaulter: boolean;
  ShowVoucherNo: boolean;
  ShowDivUpdateMSG: boolean;
  ShowDivChqBookMSG: boolean;
  IsLockAllButton: boolean;
  ShowOldAccount: boolean;
  PrmUnitFlag: string;
  PrmAutoVchFlag: string;
  CSVPrintflag: string;
  ProcessDate: string;
  FuncOpt: string;
  EndFlag: string;
  TrnMode: string;
  WriteFlag: string;
  AcceptFlag: string;
  VPrintFOptFlag: string;
  OldAccNo: string;
  PrmCSAutoVchCtrl: string;
  ProgFlag: string;
  Help1Flag: string;
  StepsFlag: string;
  AccountTypeId?: number;
  MemberNo?: number;
  TransactionTypeId?: number;
  TransactionType: number;
  AccountNo: string;
  MemType?: number;
  VoucherNo: string;
  Contracode: string;
  AccProductGLCode?: number;
  AccountDetails: IAccountDetails;
}
export class WithdrawalDataModel {
  Success: false;
  Message: string;
  MemberNo?: number;
  MemType?: number;
  MemRegNo?: number;
  MemSubRegNo?: number;
  PreMobile: string;
  MemberName: string;
  GLCashCode: string;
  TotalAmount?: number;
  FuncOpt: string;
  AccountTypeId?: number;
  VoucherNo?: number;
  AccProductGLCode?: number;
  AccTypeClass?: number;
  AccountNo?: string;
  CorrAccountNo?: string;
  OldAccountNo?: string;
  Transactions: IWithdrawTransactionModel[];
  AccountDetails?: IAccountDetails[];
  LoanDefaulterList?: LoanDetailsModel[];
}

export class LoanDetailsModel {
  AccType: number;
  AccTypeDescription: string;
  AccLastTrnDateU: string;
  CurrDuePrincAmt: number;
  CurrDueIntAmt: number;
  CurrPenalAmt: number;
  TotalDueAmt: number;
}
export class WithdrawalInputHelpViewModel extends WithdrawalViewModel {
  AccountTypeList: IdDescription[];
  TransactionTypeList: IdDescription[];
  BankList: IdDescription[];
  Transactions: IWithdrawTransactionModel[];
  PrintFlag:number;
  PrintFOptFlag:number;
  ManualAccNo:number;
}

export interface IAccountDetails {
  Success: boolean;
  Message?: string;
  MemberNo?: number;
  MemType?: number;
  BranchNo?: number;
  MemRegNo?: number;
  MemSubRegNo?: number;
  MemColCode?: number;
  PreMobile?: string;
  MemberName?: string;
  ShowDepositTransactionPanel?: boolean;
  ShowGroupAccInfo?: boolean;
  AccountNo?: string;
  HasMultipleAccount?: boolean;
  GroupAccountList?: WithdrawGroupAccountModel[];

  CtrlAccType?: number;
  AccStatus?: string;
  AccAtyClass?: string;
  OldAccountNo?: string;
  LadgerBalance?: string;
  HoldBalanceDr?: string;
  HoldBalanceCr?: string;
  Balance?: string;
  LienAmt?: string;
  SancAmount?: string;
  AvailLimit?: string;
  DisbAmt?: string;
  IntRate?: string;
  InstlAmt?: string;
  NoInstl?: string;
  CertNo?: string;
  DepositAmount?: string;
  TotalDeposit?: string;
  Period?: string;
  AccEffectDate?: string;
  OpenDate?: string;
  LastTrnDate?: string;
  MatruityDate?: string;
  AccDepRoundingBy?: string;
  OrgTrnCode?: string;
  RoundFlag?: number;
  MinBalanceAmt?: number;
  CorrAccType?: number;
  CorrAccNo?: number;
  SpInstruction?: string;
  CorrTrnCode?: string;
  TrfBalance?: string;
}

export interface WithdrawGroupAccountModel {
  AccType?: number;
  TrnCodeDesc: string;
  AccNo: string;
  AccOldNumber: string;
  AccPrevNumber: string;
  TrnCode: string;
}

export interface IWithdrawCreate {
  AccountTypeCode?: string;
  AccountType?: number;
  OldAccountNo?: number;
  ManualAccountNo?: number;
  AccountNo?: number;
  MemberNo?: number;
  MemType?: number;
  MemRegNo?: number;
  MemSubRegNo?: number;
  MemColCode?: number;
  TransactionTypeCode?: string;
  TransactionType?: number;
  VoucherOrChqNo?: string;
  BankChequeNo?: string;
  BankCode?: number;
  BankId?: number;
  SpInstruction?: string;
  TotalAmount?: number;
  AccountDetails?: IAccountDetails;
  AccProductGLCode?: number;
  TrnAmount?: number;
  Transactions: IWithdrawTransactionModel[];
  CheckTrnWithDrawalValidity?: boolean;
  AutoVchflag?: Boolean;
  ModuleNo?: number;
}

export interface IWithdrawTransactionModel {
  Id: number;
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

export class VoucherChangeViewModel {
  Success: boolean;
  Message: string;
  ChqPrefix: string;
  ChqNum: string;
  MemType?: number;
  MemNumber?: number;
  VoucherNo: string;
  ChqPageStat: string;
  DivChqBookMSG: boolean;
}

export class DepositTransformationModel {
  ID: number;
  GLAccNo: number;
  GLAccDesc: string;
  TrnDesc: string;
  TrnAmount: number;
  MarkRecord: number;
  PayTypeCode: number;
  ReadOnlyFlag: number;
  StepsFlag: number;
}

export interface WithdrawAccountViewModel {
  Success?: boolean;
  Message?: string;
  AccTypeCode?: number;
  AccProductGLCode?: number;
  AccTypeClass?: number;
}

export class MemberChangeMode {
  MemNo: number;
  AccType: number;
}

export class TransactionGridViewModel {
  VchNo: string;
  GLAccNo: string;
  GLAccDesc: string;
  TrnType: string;
  GLDebitAmt: number;
  Discription: string;
}

export class OldMemberViewModel {
  Success: false;
  Message: string;
  MemNo?: number;
  MemType?: number;
  OldMemNo?: number;
  AccType?: number;
}
