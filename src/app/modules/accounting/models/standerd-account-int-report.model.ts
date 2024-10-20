import { IdDescription } from 'src/app/interfaces/id-description';

export class StandardAccountIntReportPageLoadModel {
  AllBranchDropdown: IdDescription[] = [];
  AllAccountDropdown: IdDescription[] = [];
  AllCollectorDropdown: IdDescription[] = [];
  AllGroupDropdown: IdDescription[] = [];
  ProcessDate: string = '';
  AllMonthDropdown: IdDescription[] = [];
  AllYearDropdown: IdDescription[] = [];
}

export class periodStringDetails {
  periodString: string;
  PrmCalPeriod: string;

  AccType: string;
  PrmCalMethod: string;

  PrmCalStartDay: string;

  PrmCalEndDay: string;
  PrmGiveInt25Cons: string;

  PrmCheckNotice: string;

  PrmNoticeAmt: string;
  PrmSpeIntFlag: string;

  PrmSpeIntRate1: string;

  PrmSpeIntRate2: string;
  PrmGiveIntOver25: string;

  PrmMinBalForInt: string;

  PrmMaxBalForInt: string;
  PrmMinIntAmt: string;

  PrmMaxIntAmt: string;

  IntRateJul: string;
  IntRateAug: string;

  IntRateSep: string;

  IntRateOct: string;
  IntRateNov: string;

  IntRateDec: string;

  IntRateJan: string;

  IntRateFeb: string;
  IntRateMar: string;

  IntRateApr: string;

  IntRateMay: string;
  IntRateJun: string;

  IntPostFlag: string;

  IntPostDate: string;

  PrmRoundFlag: string;

  TargetAccType: string;

  PrmInterestType: string;

  PrmCalculateFY: string;
  PrmShareValueFlag: string;

  PrmShareValue: string;

  PrmLastOpenDate: string;

  PrmIntRate: string;
  PrmAccProcFees: string;

  PrmAccProcFeesFlag: string;

  ShareProtDeductAccType: string;

  ShareProtMinBalance: string;

  ShareProtMaxBalance: string;

  ShareProtIntRate: string;
  ShareProtFixedAmt: string;
}
