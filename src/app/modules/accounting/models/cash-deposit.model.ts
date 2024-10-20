import { IdDescription } from 'src/app/interfaces/id-description';

export class CashDepositViewModel {
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
  AmountReceived?: number;
  RefundAmount?: number;

  FuncOpt: string;
  AccountTypeId?: number;
  VoucherNo: string;
  AccountGroupList: ICashDepositTransactionModel[];
  DepositTransactions: ICashDepositTransactionModel[];
  ModuleNo?: number;
  ReadTrnLogicData?: any;
  TrnMode: number = 0;
}

export class OldMemberViewModel {
  Success: false;
  Message: string;
  MemNo?: number;
  MemType?: number;
  OldMemNo?: number;
  AccType?: number;
}

export class CashDepositInputHelp {
  UserCashCode: string;
  AccountTypeList: IdDescription[];
  DepositTransactions: ICashDepositTransactionModel[];
  ShowOldAccNo: boolean;
  PrintFlag: number;
  PrintFOptFlag: number;
  ManualAccNo: number;
}
export interface CashDepositCommonoModel {
  Success: boolean;
  Message: string;
  ShowPensionAdvanceMessage: boolean;
  DepositTransactions: ICashDepositTransactionModel[];
  AccountDetails: ICashDepositAccountDetails;
  ReadTrnLogicData?: any;
}

export interface ICashDepositTransactionModel {
  Id: number;
  GLAccNo?: number;
  GLAccDesc?: string;
  TrnAmount?: number;
  AccType?: number;
  AccNo?: number;
  AccBalance?: number;
  MarkRecord?: number;
  PayTypeCode?: number;
  LoanPrincFlag?: number;
  AccOldNumber?: string;
  AccPrevNumber?: string;
  Selected?: boolean;
}

export interface IGLCodeChangeResponse {
  Success: boolean;
  Message: string;
  IsMultiple: boolean;
  AccType: number;
  Data: ICashDepositTransactionModel[];
  Response: ICashDepositAccountDetails;
  ShowPensionAdvanceMessage: boolean;
  ReadTrnLogicData: any;
}

export interface OldMemberViewResponse {
  Success: boolean;
  Message: string;
  MemNo?: number;
  MemType?: number;
  OldMemNo?: number;
  AccType?: number;
}

export interface ICashDepositAccountDetails {
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
  DuePrincAmt?: number;
  DueIntAmt?: number;
  CtrlDuePeriod?: number;
  UptoDepositDate?: string;
  UptoDepositPeriod?: number;
  DueDepositAmt?: string;
  DuePeriod?: string;
}
