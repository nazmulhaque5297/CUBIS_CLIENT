import { IdDescription } from 'src/app/interfaces/id-description';
import * as internal from 'stream';

export class AccountOpenInputHelp {
  OpenDate: string;
  AccountTypeList: IdDescription[];
  WithdrawalAccountTypeList: IdDescription[];
  InterestCalculationTypeList: IdDescription[];
  SmsServiceList: IdDescription[];
  ShareStatusList: IdDescription[];
  PrintFlag: number;
}

export interface IAccountOpenCreate {
  AccountTypeCode?: string;
  AccountTypeId?: number;
  MemberNo?: number;
  MemberName?: string;
  OpenDate?: string;
  DepositAmount?: number;
  WithdrawalAccountTypeId?: number;
  InterestCalculationId?: number;
  SpecialInstruction?: string;
  CorrAccountNo?: number;
  IsAutoTransCorrAccount?: boolean;
  OldAccountNo?: string;
  SmsService?: number;
  ShareStatusId?: number;
  FixedDeposit?: number;
  Period?: number;
  MaturityDate?: string;
  InterestBenefits?: number;
  AccTypeClass?: number;
  AccCorrType?: number;
  BenefitDates:string;
  SlabDetails: IAccountOpenPeriodSlab;
}

export interface IAccountOpenMemberDetails {
  Success?: boolean;
  Message?: string;
  MemberName?: string;
  MemberNo?: number;
  MemType?: number;
  MemRegNo?: number;
  MemSubRegNo?: number;
  MemColCode?: number;
  CorrAccountNo?: string;
  CorrAccountDescriptipn?: string;
}

export class IAccountOpenViewModel {
  AccountNoList?: IdDescription[];
  ShowAccountList?: boolean = false;
  Success?: boolean;
  Message?: string;
  AccountTypeId?: number;
  ShowUpdateButton?: boolean;
  ShowNomineeButton?: boolean;
  AccTypeMode?: boolean;
  AccountClassId?: number;
  AccDepRoundingBy?: number;
  AccCorrType?: number;
  BenefitBy?: number;
  BenefitWBy?: number;
  MinDepositAmt?: number;
  DepositAmount?: number;
  AccFlag?: number;
  AccessT1?: number;
  AccessT2?: number;
  AccessT3?: number;
  MemberNo?: number;
  OpenDate?: string;
  AccountNo?: string;
  Status?: string;
  CorrAccountNo?: string;
  CorrAccountTitle?: string;
  OldAccountNo?: string;
  SpecialInstruction?: string;
  InterestCalculation?: string;
  WithdrawalAccountTypeId?: string;
  ShareStatusId?: string;
  IsAutoTransCorrAccount?: number;
  Period?: number;
  InterestRate?: number;
  MaturityDate?: number;
  FixedDeposit?: number;
  InterestBenefits?: number;

  ShowMemberNo?: boolean = false;
  ShowOpenDate?: boolean = false;
  ShowShareStatus?: boolean = false;
  ShowDepositAmount?: boolean = false;

  ShowFixedDepositAmount?: boolean = false;
  ShowPeriod?: boolean = false;
  ShowInterestRate?: boolean = false;
  ShowWithdrawalAC?: boolean = false;
  ShowInterestCalculation?: boolean = false;
  ShowMatrutiyDate?: boolean = false;
  ShowMatrutiyAmount?: boolean = false;
  ShowInterestWithdraw?: boolean;
  ShowFixedMthInt?: boolean;
  ShowAutoRenewal?: boolean;
  ShowLoanAmount?: boolean;
  ShowNoOfInstallment?: boolean;
  ShowMonthlyInstallment?: boolean;
  ShowLastInstallment?: boolean;

  ShowContraInt?: boolean = false;
  ShowGracePeriod?: boolean;
  ShowLoaneeACType?: boolean;
  ShowLoaneeMemberNo?: boolean;
  ShowSpInstruction?: boolean = false;
  ShowCorrAccount?: boolean = false;
  ShowAutoTrfCorrAcc?: boolean = false;
  ShowOldAccNo?: boolean = false;
  ShowSMSService?: boolean = false;
  ShowOriginalAmount?: boolean = false;
  ShowPrincipalAmount?: boolean = false;
  ShowAnniversaryDate?: boolean = false;
  ShowRenewalAmount?: boolean = false;
  ShowLastRenewalDate?: boolean = false;

  DisableDepositAmount?: boolean;
  DisableFixedDepositAmount?: boolean;
  DisablePeriod?: boolean;
  DisableWithdrawalAC?: boolean;
  DisableInterestCalculation?: boolean;
  DisableMatrutiyDate?: boolean;
  DisableMatrutiyAmount?: boolean;
  DisableInterestWithdraw?: boolean;
  DisableFixedMthInt?: boolean;
  DisableLoanAmount?: boolean;
  DisableMonthlyInstallment?: boolean;
  DisableLastInstallment?: boolean;
  DisableContraInt?: boolean;
  DisableGracePeriod?: boolean;
  DisableLoaneeMemberNo?: boolean;
  DisableSpInstruction?: boolean;
  DisableAutoTrfCorrAcc?: boolean;
  DisableOldAccNo?: boolean;
  DisableSMSService?: boolean;

  ShowBenefitDate?: boolean = false;
  BenefitDate?: string;
  NoOfBenefit?: number;

}

export interface IAccountOpenPeriodSlab {
  Success?: boolean;
  Message?: string;
  AccountTypeId?: number;
  AccTypeClass?: number;
  CtrlBenefitDate?: string;
  Period?: number;
  MaturityDate?: string;
  InterestRate?: number;
  MaturedAmount?: number;
  InterestBenefits?: number;
  MinDepositAmt?: number;
  DepositAmount?: number;
  FixedDeposit?: number;
}
