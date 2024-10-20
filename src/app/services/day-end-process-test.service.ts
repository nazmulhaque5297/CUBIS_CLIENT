import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import { IDayEndProcessWrongAccount, WrongAccounts } from '../modules/accounting/models/day-end-process-test.model';

@Injectable({
  providedIn: 'root'
})
export class DayEndProcessTestService {
  
  readonly apiAction = environment.baseUrl + 'Accounting/DayEndProcess/';
  
  items: IDayEndProcessWrongAccount[] = [];

  constructor(private httpClient: HttpClient) { }

  public GetDayEndProcessWrongAccountData(){
    return this.httpClient.get<IDayEndProcessWrongAccount[]>(
      this.apiAction + 'GetWrongAccounts'
    );
  }

  // public addWrongAccount(data: IDayEndProcessWrongAccount): Observable<ApiResponse> {
  //   //return this.items.push(wrongAccount);
  //   return this.httpClient.post<ApiResponse>(
  //     this.apiAction + 'AddWrongAccount',
  //     data
  //   );
  // }

  public getWrongAccount() {
    //return this.items;
    return this.httpClient.get<IDayEndProcessWrongAccount[]>(
      this.apiAction + 'GetWrongAccounts'
    );
  }

  // public updateWrongAccount(data: IDayEndProcessWrongAccount): Observable<ApiResponse>{
  //   // console.log( "update" + wrongAccount.VoucherNo + " " + wrongAccount.UserId );
  //   // let i = this.items.findIndex( x => x.UserId == wrongAccount.UserId );
  //   // this.items.splice(i, i+1, wrongAccount);
  //   //return this.items;
  //   return this.httpClient.put<ApiResponse>(
  //     this.apiAction + 'UpdateWrongAccount',
  //     data
  //   );
  // }

  // public deleteWrongAccount(data: IDayEndProcessWrongAccount): Observable<ApiResponse>{
  //   // console.log( "delete: " + wrongAccount.UserId );
  //   // this.items = [
  //   //   ...this.items.filter( x => x.UserId != wrongAccount.UserId )
  //   // ]
  //   // let i = this.items.findIndex( x => x.UserId == wrongAccount.UsersId );
  //   // this.items.splice(i, i+1);
  //   // return this.items;
  //   return this.httpClient.delete<ApiResponse>(
  //     this.apiAction + 'DeleteWrongAccount/' + data.UserId
  //   );
  // }


}
