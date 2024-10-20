import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from 'src/app/utility/common';

@Injectable({
  providedIn: 'root'
})
export class RestoreProcessService {

  constructor(
    private httpClient: HttpClient
  ) { }
  public getBackupProcessPageLoad() {
    return this.httpClient.get(createUrl(`HouseKeeping/RestoreDatabase/LoadData`));
  }
  public setBackupProcess(data:any){
    return this.httpClient.get(createUrl(`HouseKeeping/RestoreDatabase/RestoreDatabaseProcess?fromAddress=`+data));
  }
}
