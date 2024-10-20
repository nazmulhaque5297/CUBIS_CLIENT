import { NgbDate } from "@ng-bootstrap/ng-bootstrap";

export interface ProfessionalCode {
  ProfessionCode: Number;
  ProfessionDescription: String;
}

export interface NationalityCode {
  NationalityCode: Number;
  NationalityDescription: String;
}

export interface AccountStatusCode {
  AccStatusCode: Number;
  AccStatusDescription: String;
}

export interface TransactionType {
  TrnTypeCode: Number;
  TrnTypeDescription: String;
}
export interface TransactionCode {
  TrnCode: Number;
  TrnDescription: String;
  AccType: Number;
  AccTypeMode: Number;
  PayType: Number;
}

export interface AccType {
  AccTypeCode: Number;
  AccTypeMode: Number;
}

export interface NatureCode {
  NatureCode: Number;
  NatureDescription: String;
}

export interface LoanSecurityCode {
  LSecurityCode: Number;
  LSecurityDescription: String;
}
export interface LoanPurposeCode {
  LPurposeCode: Number;
  LPurposeDescription: String;
}
export interface LoanRejectedCode {
  LRejectCode: Number;
  LRejectDescription: String;
}
export interface LoanApproveCode {
  LApproveCode: Number;
  LApproveDescription: String;
}

export interface LoanVerifyCode {
  LVerifyCode: Number;
  LVerifyDescription: String;
}

export interface MemberRejectedCode {
  MRejectCode: Number;
  MRejectDescription: String;
}

export interface MemberVerifyCode {
  MVerifyCode: Number;
  MVerifyDescription: String;
}

export interface MemberApprovedCode {
  MApproveCode: Number;
  MApproveDescription: String;
}

export interface SectionCode {
  SectionCode: Number;
  SectionName: String;
}

export interface DepartmentCode {
  DepartmentCode: Number;
  DepartmentName: String;
}

export interface ModuleListByUser {
  Id: Number;
  UserId: Number;
  ModuleNo: Number;
  ModuleName: String;
}

export interface Module {
  Id: Number;
  Description: String;
}

export interface UserTransactionLimit {
  IdsNo: Number;
}

export interface FieldsSetupCode {
  Flag: Number;
  Code: Number;
  Description: String;
}

export interface FieldsSetupCode2 {
  Id: Number;
  Description: String;
}

export interface FieldsSetupDetailsCode {
  Flag: Number;
  Code: Number;
  Description: String;
}

export interface AccountTypeClassModel{
  Id: Number;
  Description: String;
}

export interface TransactionPayTypeMaintenanceModel{
  AccTypeClass: Number;
  PayTypeCode: Number;
  PayTypeDescription: String;
  PayMode: Number;
}

export interface ParameterMaintenanceCustomerServiceDataTypeModel{
  AccTypeCode: number;
  AccTypeDescription: string;
}

export class ParameterMaintenanceCustomerServiceEnumModel{
  CalculationMethodEnum:AccountTypeClassModel[] = [];
  LoanCalculationMethodEnum:AccountTypeClassModel[] = [];
  ProductConditionEnum:AccountTypeClassModel[] = [];
  ProductInterestType:AccountTypeClassModel[] = [];
  RoundFlagEnum:AccountTypeClassModel[] = [];
  YesNoEnum:AccountTypeClassModel[] = [];
  BenefitByEnum:AccountTypeClassModel[] = [];
  BenefitWithdrawalByEnum:AccountTypeClassModel[] = [];
  LoanPictureFromEnum:AccountTypeClassModel[] = [];
}
export class ParameterMaintenanceCustomerServiceGetDataTypeModel{
  AccClosingFees: number;
  AccClosingFeesVisible: boolean = false;
  AccProcFees: number;
  AccProcFeesVisible: boolean = false;
  AccProcFlag: number;
  AccProcFlagVisible: boolean = false;
  AccType: number;
  AccTypeClass: number;
  AccTypeClassVisible: boolean = false;
  AccTypeCode: number;
  AccTypeCodeVisible: boolean = false;
  AccTypeVisible: boolean = false;
  AnniversaryFlag: number;
  AnniversaryFlagVisible: boolean = false;
  AutoDepositFees: number;
  AutoDepositFeesVisible: boolean = false;
  AutoDepositFlag: number;
  AutoDepositFlagVisible: boolean = false;
  BenefitBy: number;
  BenefitByVisible: boolean = false;
  BenefitWBy: number;
  BenefitWByVisible: boolean = false;
  BtnSlabVisible: boolean = false;
  BtnSubmit: boolean = false;
  BtnUpdate: boolean = false;
  CalculationMethod: number;
  CalculationMethodVisible: boolean = false;
  CalculationPeriod: number;
  CalculationPeriodVisible: boolean = false;
  FundRate: number;
  FundRateVisible: boolean = false;
  GraceFlag: number;
  GraceFlagVisible: boolean = false;
  GraceMonth: number;
  GraceMonthVisible: boolean = false;
  IntWithdrDays: number;
  IntWithdrDaysVisible: boolean = false;
  InterestRate: number;
  InterestRateVisible: boolean = false;
  LoanCalculationMethod: number;
  LoanCalculationMethodVisible: boolean = false;
  LoanGuarantyAmtPerc: number;
  LoanGuarantyAmtPercVisible: boolean = false;
  LoanPenaltyAmtPerc: number;
  LoanPenaltyAmtPercVisible: boolean = false;
  MandatoryDepFlag: number;
  MandatoryDepFlagVisible: boolean = false;
  MaxAgeLoanGuarantee: number;
  MaxAgeLoanGuaranteeVisible: boolean = false;
  MaxAgeLoanOpen: number;
  MaxAgeLoanOpenVisible: boolean = false;
  MaxPenalAmount: number;
  MaxPenalAmountVisible: boolean = false;
  MinAgeLoanGuarantee: number;
  MinAgeLoanGuaranteeVisible: boolean = false;
  MinAgeLoanOpen: number;
  MinAgeLoanOpenVisible: boolean = false;
  MinBalanceAmt: number;
  MinBalanceAmtVisible: boolean = false;
  MinDepositAmt: number;
  MinDepositAmtVisible: boolean = false;
  NoDouble: number;
  NoDoubleVisible: boolean = false;
  PenalAmount: number;
  PenalAmountVisible: boolean = false;
  Period: number;
  PeriodSlab: number;
  PeriodSlabVisible: boolean = false;
  PeriodVisible: boolean = false;
  PrmLoanGuarantyAmtPerc: number;
  PrmLoanGuarantyAmtPercVisible: boolean = false;
  PrmLoanPenaltyAmtPerc: number;
  PrmLoanPenaltyAmtPercVisible: boolean = false;
  PrmMutualAidFixedAmt: number;
  PrmMutualAidFixedAmtVisible: boolean = false;
  PrmMutualAidMaxBalance: number;
  PrmMutualAidMaxBalanceVisible: boolean = false;
  PrmMutualAidMinBalance: number;
  PrmMutualAidMinBalanceVisible: boolean = false;
  ProductCondition: number;
  ProductConditionVisible: boolean = false;
  ProductInterestType: number;
  ProductInterestTypeVisible: boolean = false;
  ProvBegDate: string;
  ProvBegDateVisible: boolean = false;
  ProvBegNullDate: string;
  ProvBegNullDateVisible: boolean = false;
  ProvisionFlag: number;
  ProvisionFlagVisible: boolean = false;
  RecordFlag: number;
  RenewalFlag: number;
  RenewalFlagVisible: boolean = false;
  RoundFlag: number;
  RoundFlagVisible: boolean = false;
  ShareGuaranteeMonth: number;
  ShareGuaranteeMonthVisible: boolean = false;
  ShareGuaranteeNo: number;
  ShareGuaranteeNoVisible: boolean = false;
  SurityPictureFrom: number;
  SurityPictureFromVisible: boolean = false;
  Test: number;
  UserId: number;
  UserIdVisible: boolean = false;
}

export class SlabMaintainHelpModel{
  TypeClass: number;
  TypeCode: number;
  BenefitBy: number;
  AccountTitle: string;
}

export class SlabGvDetailsModel{
  Id:number;
  AtyDate: string;
  AtyAccType: number;
  AtyFlag: number;
  AtyRecords: number;
  AtyPeriod: number;
  AtyMatureAmt: number;
  AtyIntRate: number;
  AtyPenalAmt: number;
  AtyBonusAmt: number;
}

export class SlabGvDetails52Model{
  AtyAccType: number;
  AtyFlag: number;
  AtyPeriod: number;
  AtyIntRate: number;
}
export class SlabGvDetails7Model{
  AtyAccType: number;
  AtyFlag: number;
  AtyRecords: number;
  AtyPeriod: number;
}

export class SlabMaintainDepositAndSchemeLoadDataModel{
  BenefitAmount: string;
  BenefitAmountVisible: boolean = false;
  BonusAmount: number;
  BonusAmountVisible: boolean = false;
  BtnDelete: boolean = false;
  BtnPreDelete: boolean = false;
  BtnPreSubmit: boolean = false;
  BtnPreUpdate: boolean = false;
  BtnSubmit: boolean = false;
  BtnUpdate: boolean = false;
  GvDetails: SlabGvDetailsModel[]=[];
  GvDetails7: SlabGvDetails7Model[]=[];
  GvDetails52: SlabGvDetails52Model[]=[];
  InterestRateVisible: boolean = false;
  MonthBelow: number;
  MonthBelowVisible: boolean = false;
  PenalAmount: number;
  PenalAmountVisible: boolean = false;
  PensionInterestRate: number;
  PensionInterestRateVisible: boolean = false;
  PensionRecord: number;
  PensionRecordVisible: boolean = false;
  PeriodMonth: number;
  PeriodMonthVisible: boolean = false;
  PreInterestRate: number;
  PreInterestRateVisible: boolean = false;
  PrematureHeadVisible: boolean = false;
  PrematureVisible: boolean = false;
  Record: number;
  RecordVisible: boolean = false;
  SlabFlag: number;
  SlabFlagVisible: boolean = false;
}

export class SlabMaintainInsertDataModel{
  Id:number;
  TypeClass:number;
  TypeCode:number;
  SlabFlag:number;
  PensionRecord:number;
  PeriodMonth:number;
  BenefitAmount:number;
  PensionInterestRate:number;
  PenalAmount:number;
  BonusAmount:number;
}

export class SlabMaintainPrematureInsertDataModel{
  TypeCode: number;
  SlabFlag: number;
  MonthBelow: number;
  InterestRate: number;
}

export class SMSControlGridModel{
  CheckBox: boolean;
  FuncOpt: number;
  Flag: number;
  FuncOptDesc: string;
  AccType: number;
  AccTypeDesc: string;
  RowFlag: number;
}

export class EmailControlDataListModel{
  Id: number;
  Email: string;
  Name: string;
}

export class InterestCalculationLoadDataModel{
  AccType:number;
  PrmCalPeriod: number;
  PrmCalMethod: number;
  PrmCalStartDay: number;
  PrmCalEndDay: number;
  PrmGiveInt25Cons: number;
  PrmCheckNotice: number;
  PrmNoticeAmt: number;
  PrmSpeIntFlag: number;
  PrmSpeIntRate1: number;
  PrmSpeIntRate2: number;
  PrmGiveIntOver25: number;
  PrmMinBalForInt: number;
  PrmMaxBalForInt: number;
  PrmMinIntAmt: number;
  PrmMaxIntAmt: number;
  IntRateJul: number;
  IntRateAug: number;
  IntRateSep: number;
  IntRateOct: number;
  IntRateNov: number;
  IntRateDec: number;
  IntRateJan: number;
  IntRateFeb: number;
  IntRateMar: number;
  IntRateApr: number;
  IntRateMay: number;
  IntRateJun: number;
  IntPostFlag: number;
  IntPostDate: string;
  PrmRoundFlag: number;
  TargetAccType: number;
  PrmInterestType: number;
  PrmCalculateFY: number;
  PrmShareValueFlag: number;
  PrmShareValue: number;
  PrmLastOpenDate: string;
  PrmIntRate: number;
  TotalNoOfBranch: number;
  GlDebitCode: number;
  GlCreditCode: number;
  GlDebitCodeDesc:string;
  GlCreditCodeDesc: string;
  PrmAccProcFees: number;
  PrmAccProcFeesFlag: number;
  SCGlDebitCode: number;
  SCGlCreditCode: number;
  SCGlDebitCodeDesc: string;
  SCGlCreditCodeDesc: string;
  TargetAccTypeDesc: string;
  ShareProtDeductAccType: number;
  ShareProtMinBalance: number;
  ShareProtMaxBalance: number;
  ShareProtIntRate: number;
  ShareProtFixedAmt: number;
  SPGlDebitCode: number;
  SPGlCreditCode: string;
  SPGlDebitCodeDesc: string;
  SPGlCreditCodeDesc: string;
  ShareProtDeductAccTypeDesc: string;
  ShareProtGLCode: number;
  ShareProtGLDesc: string;
}

export class InterestCalculationInputDataModel{
  AccType: number;
  PrmCalPeriod: number;
  PrmCalMethod: number;
  PrmCalStartDay: number;
  PrmCalEndDay: number;
  PrmGiveInt25Cons: number;
  PrmCheckNotice: number;
  PrmSpeIntFlag: number;
  PrmNoticeAmt: number;
  PrmSpeIntRate1: number;
  PrmSpeIntRate2: number;
  PrmGiveIntOver25: number;
  PrmMinBalForInt: number;
  PrmMaxBalForInt: number;
  PrmMinIntAmt: number;
  PrmMaxIntAmt: number;
  IntRateJul: number;
  IntRateAug: number;
  IntRateSep: number;
  IntRateOct: number;
  IntRateNov: number;
  IntRateDec: number;
  IntRateJan: number;
  IntRateFeb: number;
  IntRateMar: number;
  IntRateApr: number;
  IntRateMay: number;
  IntRateJun: number;
  TargetAccType: number;
  PrmInterestType: number;
  PrmCalculateFY: number;
  PrmShareValueFlag: number;
  PrmShareValue: number;
  PrmLastOpenDate: string;
  PrmIntRate: number;
  ShareProtDeductAccType: number;
  ShareProtMinBalance: number;
  ShareProtMaxBalance: number;
  ShareProtIntRate: number;
  ShareProtFixedAmt: number;
  ShareProtGLCode: number;
}

export interface DesignationCode {
  DesignationCode: Number;
  DesignationDescription: String;
}

export interface BankCodeModel {
  BankCode: Number;
  BankName: String;
}