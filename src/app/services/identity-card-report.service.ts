import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from '../utility/common';

@Injectable({
  providedIn: 'root'
})
export class IdentityCardReportService
{
    constructor(private httpClient: HttpClient) { }

    public GetMemberData(data:any){
        return this.httpClient.get(createUrl(`Reports/IdentityCardListReport/GetMemberNoData?memNo=`+data));
      }
 
}