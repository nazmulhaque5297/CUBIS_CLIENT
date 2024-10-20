import { IdDescription } from './id-description';

// export class FieldsSetupMainInputHelp {
//   a2zaccfieldsdto: FieldsSetupMainViewModel[];
//   FieldsFlagList: IdDescription[];
// }

// export class FieldsSetupMainViewModel {
//   Flag: number;
//   Code: number;
//   Description: String;
// }

export class MemberDetailsCode {
  MemberNo: Number;
  MemberName: string;
  BranchNo: Number;
  MemType: Number;
}

export class MemberDetailsCodeByOldAcNo {
  MemType: string;
  MemNo: Number;
  AccNo: string;
  AccOldNumber: string;
  MemberName: string;
  AccBalance: string;
  IntDeposit: string;
  AccStatus: Number;
  AccStatusDescription: string;
  AccAtyClass: string;
}
