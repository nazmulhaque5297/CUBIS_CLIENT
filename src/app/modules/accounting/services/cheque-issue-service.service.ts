import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChequeIssueServiceService {
  MemNo:any;
  MemType:any;
  AccTypeCode:any;
  AccNo:any;
  OldAccNO:any;
  constructor(private httpClient: HttpClient) { }
}
