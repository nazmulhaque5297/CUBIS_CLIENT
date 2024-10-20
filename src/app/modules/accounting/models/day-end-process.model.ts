export interface IDayEndProcessUser {
  IdsNo?: string;
  IdsName?: string;
  IdsLogInFlag?: string;
  IdsLogInTable?: string;
}

export class IDayEndProcessInputHelp {
  ProcessDate?: string;
  HasLoggedinUsers?: boolean;
  isYearClose?: boolean;
  EndOfDay?: number;
  BegYear?: number;
  EndYear?: number;
  UserList?: IDayEndProcessUser[];
}
