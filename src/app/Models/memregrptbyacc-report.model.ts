import { IdDescription } from '../interfaces/id-description';

export class MemRegRptByAccReportInputHelp {
  AccountTypeList: IdDescription[];
  ApplicationDate: string;
  ReligionList: IdDescription[];
  CollectorList: IdDescription[];
  GroupList: IdDescription[];
  BloodGroupList: IdDescription[];
  GenderList: IdDescription[];
}

export class MemRegRptByAccReportAccTypeDetails {
  AccountTypeDetails: IdDescription[];
}
