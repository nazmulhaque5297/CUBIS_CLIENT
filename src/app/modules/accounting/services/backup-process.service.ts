import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from 'src/app/utility/common';

@Injectable({
  providedIn: 'root'
})
export class BackupProcessService {

  constructor(
    private httpClient: HttpClient
  ) { }
  public getBackupProcessPageLoad() {
    return this.httpClient.get(createUrl(`Accounting/BackupDatabase/LoadData`));
  }
  public setBackupProcess(data:any){
    return this.httpClient.get(createUrl(`Accounting/BackupDatabase/BackupDatabaseProcess?toAddress=`+data));
  }
}
