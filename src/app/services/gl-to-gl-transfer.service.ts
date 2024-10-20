import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MemberBasicInfo } from '../Models/Common.model';
import { GlToGlFromModel, GlToGlToTransModel, GlTranferDataModel } from '../modules/accounting/models/Gl-To-Gl-From.model';
import { TransferFromModel, TransferToModel } from '../modules/accounting/models/special-account-balance-transfer.model';
import { createUrl } from '../utility/common';

@Injectable({
  providedIn: 'root'
})
export class GlToGlTransferService
{
    constructor(private httpClient: HttpClient) { }

    public getFromGlValue(data:any):Observable<TransferFromModel>{
        return this.httpClient.get<TransferFromModel>(createUrl(`Accounting/SpecialFunction/GlToGlAmountTransfer/GetFromGlDetails?GlAccNo=`+data));
      }

      public getToGlTrnasValue(data:any):Observable<TransferToModel>{
        return this.httpClient.get<TransferToModel>(createUrl(`Accounting/SpecialFunction/GlToGlAmountTransfer/GetToGlDetails?GlAccNo=`+data));
      }



      public amtTransfer(data: GlTranferDataModel): Observable<GlTranferDataModel> {
        return this.httpClient.post<GlTranferDataModel>(createUrl(
          `Accounting/SpecialFunction/GlToGlAmountTransfer/Transfer`),
          data
        );
      }



      public GetFromMemberDetails({
        data,
      }: {
        data: TransferFromModel;
      }): Observable<TransferFromModel> {
        return this.httpClient.post<TransferFromModel>(createUrl(
          `Accounting/AccountBalanceTransfer/GetFromMemberDetails`),
          data
        );
      }


      public getMemberDetails(memNo:number): Observable<MemberBasicInfo> {
        return this.httpClient.get<MemberBasicInfo>(createUrl(`ApplicationCommon/GetMemberDetails?memNo=`+memNo));
      }

      public getAccListDetails(): Observable<MemberBasicInfo> {
        return this.httpClient.get<MemberBasicInfo>(createUrl(`ApplicationCommon/GetAccountTypeList`));
      }

      public GetToMemberDetails(
        data: TransferToModel): Observable<TransferToModel> {
          return this.httpClient.post<TransferToModel>(createUrl(
            `Accounting/AccountBalanceTransfer/GetToMemberDetails`),
          data
        );
      }


}