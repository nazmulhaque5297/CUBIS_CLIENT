import { IdDescription } from 'src/app/interfaces/id-description';

export class FixedDepositDataModel {
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
  CorrAccountNo?: string;
  DepositTransactions: IFixedDepositTransactionModel[];
  AccountDetails?: IFixedDepositAccountDetails;
  Transactions?: IFixedDepositTransactionModel[];
}

export interface FixedDepositCreateModel {
  AccountTypeCode?: string;
  AccountTypeId?: number;
  AccountNo?: string;
  MemberNo?: string;
  VoucherNo?: string;
  TotalAmount?: number;
  MemType?: number;
  AccProductGLCode?: number;
  AccTypeClass?: number;
  TransactionTypeCode?: number;
  BankChequeNo?: string;
  BankCode?: number;
  MemRegNo?: number;
  MemSubRegNo?: number;
  MemColCode?: number;
  DepositedAccountList: IFixedDepositTransactionModel[];
  DepositTransactions: IFixedDepositTransactionModel[];
  AccountDetails?: IFixedDepositAccountDetails;
}

export class FixedDepositInputHelp {
  AccountTypeList: IdDescription[];
  TransactionTypeList: IdDescription[];
  BankList: IdDescription[];
  DepositTransactions: IFixedDepositTransactionModel[];
  PrintFlag: number;
  PrintFOptFlag: number;
}

export interface IFixedDepositTransactionModel {
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

export interface FixedDepositTransTypeResponseModel {
  Success?: boolean;
  Message?: string;
  DepositTransactions?: IFixedDepositTransactionModel[];
  //Transactions?:IFixedDepositTransactionModel[]
}
export interface FixedDepositAccountViewModel {
  Success?: boolean;
  Message?: string;
  AccTypeCode?: number;
  AccProductGLCode?: number;
  AccTypeClass?: number;
  HasMultipleAccount?: boolean;
  AccountDetails?: IFixedDepositAccountDetails;
  GroupAccounts?: IFixedDepositTransactionModel[];
}

export interface FixedDepositAccountViewModel {
  Success?: boolean;
  Message?: string;
  AccTypeCode?: number;
  AccProductGLCode?: number;
  AccTypeClass?: number;
  AccountDetails?: IFixedDepositAccountDetails;
}

export interface IFixedDepositAccountDetails {
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
}
