import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { createUrl } from '../../../../utility/common';
import { UserMenu, UserInfo } from '../../../Models/commonModels';

@Injectable({
  providedIn: 'root'
})
export class BudgetParameterService {
  private headers: any = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  constructor(
    private httpClient: HttpClient
  ) { }
  public GetBudgetParameterLoadData(){
    return this.httpClient.get(createUrl(`Accounting/BudgetParameterMaintenance/LoadData`));
  }
  public GetBudgetParameterAccTypeChangeData(data:any){
    return this.httpClient.get(createUrl(`Accounting/BudgetParameterMaintenance/AccTypeChangeData?glCode=`+data));
  }
  public ChangeBgtAmtDr(data:any){
    return this.httpClient.get(createUrl(`Accounting/BudgetParameterMaintenance/BgtAmtDrChange?bgtAmtDr=`+data));
  }
  public ChangeBgtAmtCr(data:any){
    return this.httpClient.get(createUrl(`Accounting/BudgetParameterMaintenance/BgtAmtCrChange?bgtAmtCr=`+data));
  }
  public InsertBudgetParameterData(data:any){
    return this.httpClient.post(createUrl(`Accounting/BudgetParameterMaintenance/InsertData`),data);
  }
  public GetProfitLossLoadData(){
    return this.httpClient.get(createUrl(`Accounting/ProfitLossAppropriationTransaction/LoadData`));
  }
  public CheckProfitLossProcessData(data:any){
    return this.httpClient.post(createUrl(`Accounting/ProfitLossAppropriationTransaction/CheckData`),data);
  }
  public ProfitLossInsertData(data:any){
    return this.httpClient.post(createUrl(`Accounting/ProfitLossAppropriationTransaction/InsertData`),data);
  }
  public GetDailyReverseGlTrnLoadData(){
    return this.httpClient.get(createUrl(`Accounting/DailyReverseGLTransactions/LoadData`));
  }
  public FindDailyReverseGlTrnData(data:any){
    return this.httpClient.post(createUrl(`Accounting/DailyReverseGLTransactions/FindData`),data);
  }
  public DeleteDailyReverseGlTrnData(data:any, data2:any){
    return this.httpClient.get(createUrl(`Accounting/DailyReverseGLTransactions/DeleteData?vchNo=`+data+`&moduleNo=`+data2));
  }
  public GetVerifyGLDailyTrnVchData(){
    return this.httpClient.get(createUrl(`Accounting/GLVerifyDailyTransaction/LoadData`));
  }
  public GetVerifyGLDailySelectVchData(data:any){
    return this.httpClient.post(createUrl(`Accounting/GLVerifyDailyTransaction/SelectVch`),data);
  }
  public GetGLViewDailyTrnLoadData(data:any){
    return this.httpClient.get(createUrl(`Accounting/GLViewDailyTransaction/LoadData?vchNo=`+data));
  }
  public GLViewDailyTrnVerifyData(data:any){
    return this.httpClient.get(createUrl(`Accounting/GLViewDailyTransaction/VerifyData?vchNo=`+data));
  }
}
