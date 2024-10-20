export interface ApiResponse {
  Success: boolean;
  Message: string;
  VoucherNo: string;
  Validation: boolean;
  WrongAccount?: WrongAccountModel[];
}

export interface MemberCreateResponse {
  Success: boolean;
  Message: string;
  LastApplicationNo: number;
  NewAccNo: string;
}

export class WrongAccountModel {
  UserId: number;
  VoucherNo: string;
}
