import { IdDescription } from 'src/app/interfaces/id-description';

export class AutoManualInputHelp {
  BranchNo?: number;
  ProcessDate?: string;
  BranchList: IdDescription[];
  AccountTypeList: IdDescription[];
  AmountTypeList: IdDescription[];
  DebitCreditList: IdDescription[];
  ManualYesNoList: IdDescription[];
}

export class ManualInsertModel {
  BranchNo?: number;
  AccType?: number;
  AccNo?: number;
  TransactionId?: number;
  Deduct?: number;
  TrnAmount?: number;
  UserId?: number;
  OpenDate?: string;
  AmountTypeId?: number;
  MemberList: ManualMemberDataModel[];
  Success?: boolean;
  Message?: string;
}

export class ManualMemberDataModel {
  MemNo?: number;
  MemName?: string;
  OldAccNo?: number;
  AccNo?: number;
  TrnAmount?: number;
}

export class MemberDetailsDataModel {
  BranchNo?: number;
  AccType?: number;
  AccList: IdDescription[];
  Success?: boolean;
  Message?: string;
  MemNo?: number;
  MemName?: string;
}

export class ManualPostTranModel {
  Success?: boolean;
  Message?: string;
  TransactionId?: number;
  Deduct?: number;
  VoucherNo?: string;
  GLCode?: number;
  ContraGLCode?: number;
  BranchNo?: number;
  UserId?: string;
  AccType?: number;
  TrnDescription?: string;
}
