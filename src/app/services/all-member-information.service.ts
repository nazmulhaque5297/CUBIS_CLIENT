import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AllMemInfoModel } from '../modules/accounting/models/member-application.model';

@Injectable({
  providedIn: 'root'
})
export class AllMemberInformationService {
  MemNo: Number;
  readonly apiAction = environment.baseUrl + 'Member/';

  constructor(private httpClient: HttpClient) { }


  public GetAllMemInfo() {
    return this.httpClient.get(this.apiAction+"AllInfomation");
  }
}
