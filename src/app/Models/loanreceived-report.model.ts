import { IdDescription } from '../interfaces/id-description';

export class LoanReceivedReportInputHelp {
  AccountTypeList: IdDescription[];

  CollectorList: IdDescription[];
  GroupList: IdDescription[];
  ApplicationDate: string;

  emIntAccountTypeList: IdDescription[];

  pmSlabAccountTypeList: IdDescription[];

  cashDisbAccountTypeList: IdDescription[];

  cashDisbTellerList: IdDescription[];

  frmDateMemStat: string;

  installDate: string;

  grpSummaryAccountTypeList: IdDescription[];

  accTransferAccountTypeList: IdDescription[];

  loanExpAccountTypeList: IdDescription[];

  recAndPayRegTrnTypeList: IdDescription[];

  branchList: IdDescription[];

  loanDisbGenderList: IdDescription[];

  loanDisbAccountTypeList: IdDescription[];

  loanDisbDisburseTypeList: IdDescription[];

  LPurposeList: IdDescription[];

  BalanceTypeList: IdDescription[];

  MemberStatusList: IdDescription[];

  AccountStatusList: IdDescription[];
  BranchNo: number;
  BranchDdlList: IdDescription[];
  ctrlOldAccNo: string;
  AccTypeData: IdDescription[];
}

export class EstIntDetailsReportAccNoDetails {
  AccountNoList: IdDescription[];
}

export class AccClassDetails {
  AccTypeClass: number;
}

export class AccNoDetails {
  AccountNoList: IdDescription[];
}
