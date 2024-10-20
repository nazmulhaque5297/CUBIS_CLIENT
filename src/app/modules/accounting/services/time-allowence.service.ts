import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from 'src/app/utility/common';

@Injectable({
  providedIn: 'root'
})
export class TimeAllowenceService {

  constructor(
    private httpClient: HttpClient
  ) { }

  public convertDateToString(value:any){
    if(value==null) return;
    let num = value;
    num = num.toString();
    num = num.split("-");
    let date = num[0];
    let month = num[1];
    let year = num[2]; 
    let result = date + "/" + month + "/" + year;
    return result;
  }

  public pageLoadData(){
    return this.httpClient.get(createUrl(`Accounting/TimeAllowence/LoadData`));
  }

  public memberNoChngData(data:any){
    return this.httpClient.get(createUrl(`Accounting/TimeAllowence/MemberNoData?memberNo=`+data));
  }

  public memberNoAllData(data:any){
    return this.httpClient.get(createUrl(`Accounting/TimeAllowence/MemberNoAllData?memberNo=`+data));
  }

  public accInfoGet(data:any){
    return this.httpClient.get(createUrl(`Accounting/TimeAllowence/AccInfoGet?accNo=`+data));
  }
  public timeAllowenceUpdateData(body) {
    return this.httpClient.post(createUrl(`Accounting/TimeAllowence/TimeAllowenceUpdateData`), body);
  }
}

