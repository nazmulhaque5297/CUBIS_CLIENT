import { IdDescription } from 'src/app/interfaces/id-description';

export class InterestWithdrawInputHelp {
  AccountTypeList: IdDescription[];
  TransactionTypeList: IdDescription[];
  BankList: IdDescription[];
  Transactions: IInterestTransactionModel[];
  ShowOldAccNo: boolean;
  PrintFlag: number;
  PrintFOptFlag: number;
  ManualAccNo:number;
}

export class InterestWithdrawDataModel {
  Success: false;
  Message: string;
  MemberNo?: number;
  MemType?: number;
  MemRegNo?: number;
  MemSubRegNo?: number;
  MemColCode?: number;
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
  OldAccountNo?: number;
  CorrAccountNo?: string;
  Transactions?: IInterestTransactionModel[];
  HasMultipleAccount?: boolean;
  AccountDetails?: IInterestAccountDetails;
  GroupAccounts?: IInterestTransactionModel[];
}

export interface InterestWithdrawCreateModel {
  AutoVchflag?: Boolean;
  AccountTypeCode?: string;
  AccountTypeId?: number;
  AccountNo?: string;
  MemberNo?: string;
  VoucherNo?: string;
  MemRegNo?: number;
  MemSubRegNo?: number;
  MemColCode?: number;
  TotalAmount?: number;
  TrnAmount?: number;
  MemType?: number;
  AccProductGLCode?: number;
  AccTypeClass?: number;
  TransactionTypeCode?: number;
  BankChequeNo?: string;
  BankCode?: number;
  AccProvisionMode?: number;
  Transactions: IInterestTransactionModel[];
  AccountDetails?: IInterestAccountDetails;
  Module?: number;
}

export interface IInterestTransactionModel {
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

export interface TransTypeResponseModel {
  Success?: boolean;
  Message?: string;
  Transactions?: IInterestTransactionModel[];
}
export interface InterestAccountViewModel {
  Success?: boolean;
  Message?: string;
  AccTypeCode?: number;
  AccProductGLCode?: number;
  AccTypeClass?: number;
  AccProvisionMode?: number;
}

export interface IInterestAccountDetails {
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

  CorrAccountNo?: string;
  CorrAccountBalance?: string;
  CorrAccountHoldBalanceDr?: string;
  CorrAccountHoldBalanceCr?: string;
  CorrAccountLienAmount?: string;

  AccBenefitDate?: string;
  MonthlyBenefit?: string;
  FixedDepositAmount?: string;
  NoOfBenefit?: string;
  AvailableBenefit?: string;
  CalPeriod?:number;

  AccOrgAmt?: string;
  IntRate?: string;
  AccRenwlDate?: string;
  Module?: number;
}

export class OldMemberViewModel {
  Success: false;
  Message: string;
  MemNo?: number;
  MemType?: number;
  OldMemNo?: number;
  AccType?: number;
}
