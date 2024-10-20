import { HttpClient, HttpErrorResponse  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ImageViewModel } from '../Models/image-processing.model';


@Injectable({
  providedIn: 'root'
})
export class ImageProcessingService {
  readonly apiAction=environment.baseUrl+"ImageProcessing/";
  
  constructor(private httpClient: HttpClient) { }

  
  public GetMemberImages(memNo: number,memType:number): Observable<ImageViewModel> {
    console.log("This is api memno", memNo);
    console.log("This is api memtypr", memType);
    return this.httpClient.get<ImageViewModel>(this.apiAction+`GetMemberImages?memNo=`+memNo+'&memType='+memType).pipe(
        catchError(this.handleError)
      );;
  }


  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
