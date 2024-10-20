import { MemberBasicInfo } from 'src/app/Models/Common.model';

export class TransferBalanceViewModel {
  TransferFrom?: TransferFromModel;
  TransferTo?: TransferToModel;
}

export class TransferFromModel {
  ShowLimitBalance?: boolean;
  Member?: MemberBasicInfo;
  AccAtyClass?: number;
  TrnCode?: number;
  AccTypeId?: number;
  AccountNo?: number;
  Balance?: number;
  LienAmount?: number;
  LimitAmount?: number;
  LoanAmount?: number;
  AccHoldBalanceDr?: number;
  AccHoldBalanceCr?: number;
  AccList: string[];
}

export class TransferToModel {
  Member?: MemberBasicInfo;
  AccAtyClass?: number;
  AccTypeId?: number;
  AccountNo?: number;
  Balance?: number;
  LienAmount?: number;
  VoucherNo?: string;
  TransactionAmount?: number;
  FromDescription?: string;
  ToDescription?: string;
  InterestAmount?: number;
  PrincipleAmount?: number;
  ShowLoanPanel?: boolean;
  EffectDate?: string;
  AccList: string[];
}
