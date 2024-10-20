import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { createUrl } from '../utility/common';
import { JsonResponseModel } from '../Models/user-manager.model';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private headers: any = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  constructor(private httpClient: HttpClient) {}

  //authentications
  LoginService(data): Observable<any> {
    return this.httpClient.post<any>(createUrl('Account/login'), data);
  }

  public SetTokenToStorage(token: string) {
    localStorage.setItem('token', token);
  }

  public Logout() {
    localStorage.removeItem('token');
  }

  public RemoveBackendToken() {
    return this.httpClient.get<any>(createUrl('Account/LogOff'));
  }

  public ChangePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Observable<JsonResponseModel> {
    var data = {
      currentPassword: currentPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    };
    return this.httpClient.post<any>(createUrl('Account/ChangePassword'), data);
  }

  public IsAuthenticated() {
    const token = localStorage.getItem('token');
    if (token) {
      return true;
    }
    return false;
  }
}
