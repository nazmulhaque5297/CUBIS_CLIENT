import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from '../utility/common';

@Injectable({
  providedIn: 'root'
})
export class GLAccountStatementService
{
    constructor(private httpClient: HttpClient) { }

    public GetInputHelpData(){
        return this.httpClient.get(createUrl(`Reports/GLAccountStatementReport/GetInputHelpData`));
      }
      public MainHeadCode(data:any){
        return this.httpClient.get(createUrl(`Reports/GLAccountStatementReport/GetMainHeadCodeData?headerCode=`+data));
      }

      public SubHeadCode(data:any){
        return this.httpClient.get(createUrl(`Reports/GLAccountStatementReport/GetSubHeadCodeData?headCode=`+data));
      }
      public SelectDetailsCode(data:any){
        return this.httpClient.get(createUrl(`Reports/GLAccountStatementReport/GetSelectedDetailsCodeData?headCode=`+data));
      }
     
}