import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import { createUrl } from '../utility/common';

@Injectable({
  providedIn: 'root'
})
export class SmsMessageMaintenanceService
{
  readonly apiAction=environment.baseUrl+"HouseKeeping/SmsMessageMaintenance/";
    constructor(private httpClient: HttpClient) { }
    public SmsMessageMaintenancePageLoad(){
        return this.httpClient.get(createUrl(`HouseKeeping/SmsMessageMaintenance/GetSmsddlData`));
      }
      public SmsMessageMaintenanceTextData(data:any){
        return this.httpClient.get(createUrl(`HouseKeeping/SmsMessageMaintenance/GetSmstextData?funCode=`+data));
      }
      public UpdateAllInformation(data:any)
      {
        console.log("update data", data);
        return this.httpClient.post(createUrl(`HouseKeeping/SmsMessageMaintenance/UpDateInformation`),data);
      }

      
 }

      

