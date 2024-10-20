import { IdDescription } from '../interfaces/id-description';

export class ChequeBookReportInputHelp {
  AccountTypeList: IdDescription[];
  ApplicationDate: string;
}

export class ChequeBookReportAccTypeDetails {
  AccountTypeDetails: IdDescription[];
}

export class ChequeBookReportAccNoDetails {
  AccountNoList: IdDescription[];
}
