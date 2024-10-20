import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from 'src/app/utility/common';
import { MemberAutoAccountOpeningModel } from '../models/member-application.model';

@Injectable({
  providedIn: 'root'
})
export class ApproveMemberApplicationService {
  memberInformation = [];
  nomineeAccNo:string;
  NewMemNo:number;
  MemType:number;
  AccType: number;

  constructor(private httpClient: HttpClient) { }

  public setMemberInformation(data: any) {
    this.memberInformation = data;
  }
  public getInformation() {
    return this.memberInformation;
  }

  public getMemberApproveApplicationInfo() {
    return this.httpClient.get(createUrl(`Accounting/MemberApplicationApprove/GetMemberApproveApplicationDetails`));
  }

  public approveMember(body) {
    return this.httpClient.post(createUrl(`Accounting/MemberApplicationApprove/MemberApplicationApprove`), body);
  }

  public rejectMember(body) {
    return this.httpClient.post(createUrl(`Accounting/MemberApplicationApprove/MemberApplicationReject`), body);
  }

  public getApprovedMemberApplication() {
    return this.httpClient.get(createUrl(`Accounting/MemberApplicationApprove/ApprovedMemberApplication`));
  }

  public getAccTypeMemApplication() {
    return this.httpClient.get(createUrl(`Accounting/MemberApplicationApprove/AcctypeMemApplication`));
  }

  public getAccTypeNonMemApplication() {
    return this.httpClient.get(createUrl(`Accounting/MemberApplicationApprove/AcctypeNonMemApplication`));
  }

  public getIntCalculationDes() {
    return this.httpClient.get(createUrl(`Accounting/MemberApplicationApprove/IntCalculationDes`));
  }

  public getSmsServiceDes() {
    return this.httpClient.get(createUrl(`Accounting/MemberApplicationApprove/SmsService`));
  }
  public postMemInfo(body) {
    return this.httpClient.post(createUrl(`Accounting/MemberApplicationApprove/MemberAccType`), body);
  }

  public saveAccData (body:any){
    return this.httpClient.post(createUrl(`Accounting/MemberApplicationApprove/SaveAccInfoData`), body);
  }

  public nomineeAdd (body){
    return this.httpClient.post(createUrl(`Accounting/MemberApplicationApprove/NomineeAdd`), body);
  }

  public nomineeAddTemp (body){
    return this.httpClient.post(createUrl(`Accounting/MemberApplicationApprove/TempNomineeAdd`), body);
  }

  public getNomineeInfo(body) {
    return this.httpClient.post(createUrl(`Accounting/MemberApplicationApprove/GetNomineeList`),body);
  }

  public getNomineeInfoTemp(body) {
    return this.httpClient.post(createUrl(`Accounting/MemberApplicationApprove/GetNomineeListTemp`),body);
  }

  public getNomineePageLoadInfoTemp(body) {
    return this.httpClient.post(createUrl(`Accounting/MemberApplicationApprove/GetNomineeList`),body);
  }


  
  public updateNomineeInfo(body){
    return this.httpClient.post(createUrl(`Accounting/MemberApplicationApprove/NomineeUpdate`), body);
  }

  public updateNomineeInfoTemp(body){
    return this.httpClient.post(createUrl(`Accounting/MemberApplicationApprove/NomineeUpdateTemp`), body);
  }

  public deleteNomineeInfo(data:any) {
    return this.httpClient.get(createUrl(`Accounting/MemberApplicationApprove/NomineeDelete?Id=`+data));
  }
  public deleteNomineeInfoTemp(data:any) {
    return this.httpClient.get(createUrl(`Accounting/MemberApplicationApprove/NomineeDeleteTemp?Id=`+data));
  }

  public SameAdd(data:any) {
    return this.httpClient.get(createUrl(`Accounting/MemberApplicationApprove/SameAdd?MemNo=`+data));
  }
}
