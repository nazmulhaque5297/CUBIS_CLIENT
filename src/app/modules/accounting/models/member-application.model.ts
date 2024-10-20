import { AccType } from './../../Models/HoseKeepingModel';
import { AbstractClassPart } from '@angular/compiler/src/output/output_ast';
import { NgbPaginationNumber } from '@ng-bootstrap/ng-bootstrap';
import { IdDescription } from '../../../interfaces/id-description';

export class MemberApplicationInputHelp {
  LastApplicationNo: number = 0;
  ApplicationDate: string;
  MemberType: IdDescription[];
  Gender: IdDescription[];
  Religion: IdDescription[];
  MaritalStatus: IdDescription[];
  BirthPlace: IdDescription[];
  BloodGroup: IdDescription[];
  Nature: IdDescription[];
  Occupation: IdDescription[];
  Nationality: IdDescription[];
  Relation: IdDescription[];
  Regions: IdDescription[];
  VillageList: IdDescription[];
  Collector:any[];
  ManualMemNo:any;
}

export class OldMemberInfo {
  MemberNo: number;
  MemberName: string;
}

export class MemberApplicationModel {
  ID: number = 0;
  MemApplicationNo?: number;
  MemApplicationDate: string;
  MemType?: number;
  MemberName: string;
  MemberNameBang: string;
  FatherName: string;
  MotherName: string;
  SpouseName: string;
  DateOfBirth?: string;
  Age?: number;
  MemRegNo?: number;
  MemColCode?: number;
  Gender?: number;
  Religion?: number;
  MaritalStatus?: number;
  PlaceofBirth?: number;
  MemIntroMemNo?: number;
  MemIntroMemNo2?: number;

  PreAddressLine1: string;
  PreVillage?: number;
  PreVillageCode?: number;
  PreTelephone: string;
  PreMobile: string;
  PreEmail: string;

  PerAddressLine1: string;
  PerVillage?: number;

  NationalIdNo: string;
  PassportNo: string;
  PassportIssuePlace: string;
  TIN: string;
  MemBloodGroup?: number;
  IDIssueDt?: string;
  PassportIssueDate?: string;
  PassportExpiryDate?: string;
  LastTaxPayDate?: string;
  MemAnniversaryDate?: string;
  EmployerName: string;
  EmployerAddress: string;
  Occupation?: number;
  Nationality?: number;

  MemEduQualification: string;
  MemFNameBang: string;
  MemMNameBang: string;
  MemSpouseNameBang: string;
  Msg:string;
}

export interface IVillageDetails {
  VillageCode: number;
  VillageName?: string;
  PostOfficeCode?: number;
  DivisionCode?: number;
  DistrictCode?: number;
  UpzilaCode?: number;
  ThanaCode?: number;
  PostOfficeName?: string;
  DivisionName?: string;
  DistrictName?: string;
  UpzilaName?: string;
  ThanaName?: string;
  VillageNameBang?: string;
  DiviDescriptionBang?: string;
  DistDescriptionBang?: string;
  UpzilaDescriptionBang?: string;
  ThanaDescriptionBang?: string;
  PostOfficeNameBang?: string;
}

export interface MemberAutoAccountOpeningModel {
  AccType: number;
  Description: string;
}

export class AccountOpeningModel{
  AccType: number;
  AccTitle: string;
  InterestCalculation: number;
  SMSService: number;
  OldAccNo: number;
}

export class MemberInfoForAccountOpeningModel {
  MemType: number;
  MemNo: number;
  AccType: number;
  MemApplicationDate: string;
  OldAccNo: string;
  IntFlag: number;
  SmsFlag: boolean;
}

export class GenerateNewAccountModel {
  AccType: number;
  Description: string;
  NewAccNo: number;
}

export class NomineeDataModel {
  NomineeName: string;
  PreAddressLine1: string;
  PreVillage: string;
  PreVillageCode: number;
  PreTelephone: string;
  PreMobile: string;
  PreEmail: string;
  SharePer: number;
  Relation: string;
  AccNo: string;
  AccType: number;
  MemNo: number;
  MemType: number;
  Id?: number;
}

export class VillageCodeModel {
  DistrictCode: number;
  DivisionCode: number;
  PostOfficeCode: number;
  ThanaCode: number;
  UpzilaCode: number;
  VillageCode: number;
  VillageName: string;
  VillageNameBang: string;
}

export class UpizilaDataRecModel {
  Divicode: number;
  Distcode: number;
}
export class ThanaDataRecModel {
  DivisionCode: number;
  DistrictCode: number;
  UpzilaCode: number;
  ThanaCode: number;
  ThanaDescription: number;
}

export class EditMemberInformationModel {
  MemberNo: number;
  MemberName: string;
  MemberNameBang: string;
  FatherName: string;
  FatherNameBang: string;
  MotherName: string;
  MotherNameBang: string;
  SpouseName: string;
  SpouseNameBang: string;
  OpenDate: string;
  DateOfBirth: string;
  MemType: number;
  Gender: number;
  Religion: number;
  MaritalStatus: number;
  PlaceofBirth: string;
  PreAddressLine1: string;
  PreVillage: number;
  PrePostOffice: number;
  PreDivision:number;
  PreDistrict:number;
  preThana:number;
  preUpzila:number;
  PreTelephone: string;
  PreMobile: string;
  PreEmail: string;
  PerAddressLine1: string;
  PerVillage: number;
  PerPostOffice:number;
  PerDivision:number;
  PerDistrict:number;
  PerUpzila:number;
  PerThana:number;
  PerTelephone:string;
  PerMobile:string;
  PerEmail:string;
  NationalIdNo: string;
  PassportNo: string;
  PassportIssuePlace: string;
  TIN: string;
  MemBloodGroup: number;
  Nature: number;
  IDIssueDt: string;
  PassportIssueDate: string;
  PassportExpiryDate: string;
  LastTaxPayDate: string;
  MemAnniversaryDate: string;
  EmployerName: string;
  EmployerAddress: string;
  Occupation: number;
  Nationality: number;
  MemColCode:number;
  MemSubRegNo:number;
  MemRegNo: number;
  MemIntroMemType:number;
  MemIntroMemNo: number;
  MemIntroMemType2:number
  MemIntroMemNo2: number;
  MemEduQualification: string;
  RelaMemNo:number;
  RelaMemType: number;
  MemRelationType:number;
  MemRelDesc:string;
}

export class RelationshipModel {
  MemType: number;
  MemNo: number;
}

export class GroupModel {
  AddressL1: string;
  AddressL2: string;
  AddressL3: string;
  CollNo: number;
  RegName: string;
  RegNo: number;
  Division: number;
  District: number;
  UpZila: number;
  Thana: number;
}

export class CollectorsModel {
  CollectorNo: number;
  Collectordesc: number;
  CollectorName: string;
  NationalIdNo: string;
  AddressL1: string;
  AddressL2: string;
  AddressL3: string;
  Division: number;
  District: number;
  UpZila: number;
  Thana: number;
  TelephoneNo: string;
  MobileNo: string;
  Fax: string;
  email: string;
}

export class CheckBookIssueModel {
  AccTypeCode: number;
  selectedOptionCode: string;
  OldAccNO: number
  MemNo: number;
  AccNo: number;
  ChkPre: string;
  NoOfPages: number
  BeginNo: number
  EndNo:number
  IssuDt: string;
  MemType: number;
  ChkButtonState: number;
  ModuleNo: number;
}

export class CheckBookModel {
  AccNo: number;
  AccTypeCode: number;
  MemNo: number;
  MemNum: number;
  MemType: number;
  Message: string;
}

export class MemberStatusModel{
  Id:number;
  Description: string;
}

export class AccTypeModel{
  Code:number;
  Name: string;
}

export class AllMemInfoModel{
  MemNo:number;
  MemName:string;
  MemFName:string;
  MemMName:string;
  MemSName:string;
  MobileNo:string;
}