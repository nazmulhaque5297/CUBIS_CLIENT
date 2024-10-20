import { IdDescription } from 'src/app/interfaces/id-description';

export class DepositDefaulterReportPageLoadModel {
  AllAccountDropdown: IdDescription[] = [];
  AllCollectorDropdown: IdDescription[] = [];
  AllGroupDropdown: IdDescription[] = [];
  ProcessDate: string = '';
  AllMonthDropdown: IdDescription[] = [];
  AllYearDropdown: IdDescription[] = [];
}
