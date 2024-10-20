import { IdDescription } from 'src/app/interfaces/id-description';

export class TransferDepositViewModel {
  Success: false;
  Message: string;
  MemberNo?: number;
  MemType?: number;
  MemColCode?: number;
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
  DepositTransactions: ITransferDepositTransactionModel[];
  AccountDetails?: ITransferDepositAccountDetails;
}

export interface TransferDepositCreateModel {
  MemColCode?: number;
  AutoVchflag?: Boolean;
  AccountTypeCode?: string;
  AccountTypeId?: number;
  AccountNo?: string;
  MemberNo?: string;
  VoucherNo?: string;
  TotalAmount?: number;
  MemType?: number;
  AccProductGLCode?: number;
  AccTypeClass?: number;
  DepositedAccountList: ITransferDepositTransactionModel[];
  AccountDetails?: ITransferDepositAccountDetails;
}

export class TransferDepositInputHelp {
  AccountTypeList: IdDescription[];
  DepositTransactions: ITransferDepositTransactionModel[];
  PrintFlag: number;
  PrintFOptFlag: number;
}

export interface ITransferDepositTransactionModel {
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

export interface TransferDepositAccountViewModel {
  Success?: boolean;
  Message?: string;
  AccTypeCode?: number;
  AccProductGLCode?: number;
  AccTypeClass?: number;
  AccountDetails?: ITransferDepositAccountDetails;
  HasMultipleAccount?: boolean;
  GroupAccounts?: ITransferDepositTransactionModel[];
}

export interface TransferDepositResponseModel {
  Success?: boolean;
  Message?: string;
  DepositTransactions: ITransferDepositTransactionModel[];
}

export interface TransferDepositAccountViewModel {
  Success?: boolean;
  Message?: string;
  AccTypeCode?: number;
  AccProductGLCode?: number;
  AccTypeClass?: number;
  AccountDetails?: ITransferDepositAccountDetails;
}

export interface ITransferDepositAccountDetails {
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
  AccAtyClass?: number;
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
  LastIntDate?: string;
  DuePrincAmt?: number;
  DueIntAmt?: number;
  CtrlDuePeriod?: number;
  MatruityDate?: string;
  AccLoanExpiryDate?: string;

  AccDepRoundingBy?: number;
  AccDepositMode?: number;
  AccDivident?: number;

  OrgTrnCode?: string;
  RoundFlag?: number;
  MinDepositAmt?: number;
  CalculationPeriod?: number;
  MandatoryDepFlag?: number;
  SpInstruction?: string;

  CorrAccountNo?: string;
  CorrAccountBalance?: string;
  CorrAccountHoldBalanceDr?: string;
  CorrAccountHoldBalanceCr?: string;
  CorrAccountLienAmount?: string;

  DueDepositAmt?: string;
  DuePeriod?: string;
}
