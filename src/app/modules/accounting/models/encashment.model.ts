import { IdDescription } from 'src/app/interfaces/id-description';

export class EncashmentInputHelp {
  AccountTypeList: IdDescription[];
  TransactionTypeList: IdDescription[];
  BankList: IdDescription[];
  Transactions: IEncashmentTransactionModel[];
  ShowOldAccNo: boolean;
  public PrintFlag: number;
  public PrintFOptFlag: number;
}

export class EncashmentDataModel {
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
  OldAccountNo?: string;
  CorrAccountNo?: string;
  Transactions?: IEncashmentTransactionModel[];
  HasMultipleAccount?: boolean;
  AccountDetails?: IEncashmentAccountDetails;
  GroupAccounts?: IEncashmentTransactionModel[];
}

export interface EncashmentCreateModel {
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
  MemType?: number;
  AccProductGLCode?: number;
  AccTypeClass?: number;
  TransactionTypeCode?: number;
  BankChequeNo?: string;
  BankCode?: number;
  AccProvisionMode?: number;
  AccExpenseMode?: number;
  Transactions: IEncashmentTransactionModel[];
  AccountDetails?: IEncashmentAccountDetails;
}

export interface IEncashmentTransactionModel {
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
export interface EncashmentAccountViewModel {
  Success?: boolean;
  Message?: string;
  AccTypeCode?: number;
  AccProductGLCode?: number;
  AccTypeClass?: number;
  AccProvisionMode?: number;
  AccExpenseMode?: number;
}

export interface IEncashmentAccountDetails {
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

  AccOrgAmt?: string;
  IntRate?: string;
  AccRenwlDate?: string;

  DueDepositAmt?: string;
  DuePeriod?: string;
}
export interface TransTypeResponseModel {
  Success?: boolean;
  Message?: string;
  Transactions?: IEncashmentTransactionModel[];
  AccountDetails?: IEncashmentAccountDetails;
}

export class OldMemberViewModel {
  Success: false;
  Message: string;
  MemNo?: number;
  MemType?: number;
  OldMemNo?: number;
  AccType?: number;
}
