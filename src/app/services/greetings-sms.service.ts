import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from '../utility/common';

@Injectable({
  providedIn: 'root',
})
export class GreetingSMSInfoService {
  constructor(private httpClient: HttpClient) {}

  public GetInputHelpData() {
    return this.httpClient.get(
      createUrl(`Accounting/MemberGreetingsSMS/PageLoadData`)
    );
  }
  public GenerateSMSData(data1: any) {
    return this.httpClient.post(
      createUrl(`Accounting/MemberGreetingsSMS/SmsGenerate`),
      data1
    );
  }


  public SaveGreetingSMS(data1: any) {
    return this.httpClient.post(
      createUrl(`Accounting/MemberGreetingsSMS/SaveSMSData`),
      data1
    );
  }


  public SendGreetingSMS(data: any,) {
    return this.httpClient.post(
      createUrl(`Accounting/MemberGreetingsSMS/SendSMS`),
      data
    );
  }


  


  
}
