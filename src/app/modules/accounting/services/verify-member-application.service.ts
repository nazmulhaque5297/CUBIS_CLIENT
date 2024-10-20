import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from 'src/app/utility/common';

@Injectable({
  providedIn: 'root'
})
export class VerifyMemberApplicationService {

  constructor(private httpClient: HttpClient) { }

  public getMemberApplicationInfo() {
    return this.httpClient.get(createUrl(`Accounting/MemberApplicationVerify/GetMemberApplicationDetails`));
  }

  public verifyMember(body) {
    return this.httpClient.post(createUrl(`Accounting/MemberApplicationVerify/MemberApplicationVerify`), body);
  }

  public rejectMember(body) {
    return this.httpClient.post(createUrl(`Accounting/MemberApplicationVerify/MemberApplicationReject`), body);
  }
}
