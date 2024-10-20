import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import { IAccountOpenCreate } from '../modules/accounting/models/account-open.model';
import { createUrl } from '../utility/common';

@Injectable({
  providedIn: 'root'
})
export class VoucherSignatureMaintenanceService
{
  readonly apiAction=environment.baseUrl+"HouseKeeping/VoucherSignatureMaintenance/";
    constructor(private httpClient: HttpClient) { }

    public VoucherSignatureMaintenancePageLoad(){
        return this.httpClient.get(createUrl(`HouseKeeping/VoucherSignatureMaintenance/GetVoucherSignatureddlData`));
      }
      public VoucherSignatureMaintenanceTextData(data:any){
        return this.httpClient.get(createUrl(`HouseKeeping/VoucherSignatureMaintenance/GetVoucherSignatureData?funCode=`+data));
      }
      public UpdateAllInformation(data:any)
      {
        console.log("update data", data);
        return this.httpClient.post(createUrl(`HouseKeeping/VoucherSignatureMaintenance/InsertInformation`),data);
      }

      

}