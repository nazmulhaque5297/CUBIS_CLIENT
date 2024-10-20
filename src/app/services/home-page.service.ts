import { HttpClient, HttpErrorResponse  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from '../utility/common';


import {UserModule, UserInfo}  from "../Models/Common.model"
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map, retry } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class HomePageService {

  constructor(private httpClient: HttpClient) { }


  // Get data from API
  public getDataList() {
    return this.httpClient.get<UserModule[]>(createUrl(`SystemControl/Module/GetUserModules`));
  }

  public getUserStatus() {
    return this.httpClient.get<any>(createUrl(`Account/GetUserDetails`));
  }

  public getUserInformation(): Observable<UserInfo> {
    return this.httpClient.get<UserInfo>(createUrl(`Account/GetUserDetails`)).pipe(
        catchError(this.handleError)
      );;
  }

 

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
