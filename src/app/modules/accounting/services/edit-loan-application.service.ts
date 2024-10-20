import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from 'src/app/utility/common';

@Injectable({
  providedIn: 'root'
})
export class EditLoanApplicationService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  public applicationNoChange(data) {
    return this.httpClient.get(createUrl(`Accounting/EditLoanApplication/ApplicationNoChange?applicationNo=`+data));
  }

  public applicationNoChangeReport(data) {
    return this.httpClient.get(createUrl(`Accounting/EditLoanApplication/ApplicationNoChangeReport?applicationNo=`+data));
  }

  public editLoanAppUpdate(body:any) {
    return this.httpClient.post(createUrl(`Accounting/EditLoanApplication/EditLoanAppUpdateData`), body);
  }

  //Get data from API
  public getAccTypes() {
    return this.httpClient.get(
      createUrl(`InputHelp/GetAccountTypes`),
    );
  }
}
