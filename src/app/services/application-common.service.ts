import { HttpClient, HttpErrorResponse  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IApplicationCommonModel, MemberBasicInfo } from '../Models/Common.model';


@Injectable({
    providedIn: 'root'
  })
  export class ApplicationCommonService {
    readonly apiAction=environment.baseUrl+"ApplicationCommon/";
    
    constructor(private httpClient: HttpClient) { }
  
    public getAccListDetails(): Observable<MemberBasicInfo> {
      return this.httpClient.get<MemberBasicInfo>(this.apiAction+"GetAccountTypeList");
    }
   

    public getMemberDetails(memNo:number): Observable<MemberBasicInfo> {
      return this.httpClient.get<MemberBasicInfo>(this.apiAction+"GetMemberDetails?memNo="+memNo);
    }
   
    public getApplicationCommonData(): Observable<IApplicationCommonModel> {
      return this.httpClient.get<IApplicationCommonModel>(this.apiAction+"GetApplicationCommonData");
    }
  }
  