import { IdDescription } from 'src/app/interfaces/id-description';

export class DailyCsTransactionVchPageLoadModel {
  AllFunctionTypeDropDown: IdDescription[] = [];
  FromDate: string = '';
  ProcDate: string = '';
  GLCashCode: string = '';
}
export class VoucherInfoModel {
  BranchNo: string = '';
  MemType: string = '';
  MemNo: string = '';
  FuncOpt: string = '';
  TrnType: string = '';
  ValueDate: string = '';
  UserID: string = '';
  FromCashCode: string = '';
  VchNo: string = '';

  UserIDName: string = '';
  BoothNo: string = '';

  BoothName: string = '';
  MemName: string = '';
  TrnTypeTitle: string = '';
  FuncTitle: string = '';
  lblVchYear: string = '';
  CtrlFuncOpt: string = '';
  Success:boolean;
  Message:String='';
}
