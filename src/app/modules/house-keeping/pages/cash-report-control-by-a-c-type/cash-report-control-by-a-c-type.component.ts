import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { HouseKeepingService } from '../../house-keeping.service';

@Component({
  selector: 'app-cash-report-control-by-a-c-type',
  templateUrl: './cash-report-control-by-a-c-type.component.html',
  styleUrls: ['./cash-report-control-by-a-c-type.component.css'],
})
export class CashReportControlByACTypeComponent implements OnInit {
  CashReportControlForm: FormGroup;
  dataList: any;
  indexing:any[] = [1,2,3,4,5,6,7,8,9];
  constructor(
    private houseKeepingService: HouseKeepingService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getDataList();
    this.initializeForm()
;  }
  private initializeForm() {
    this.CashReportControlForm = new FormGroup({
    });
  }

  getDataList = () => {
    this.spinner.show();
    this.houseKeepingService
      .GetCashReport()
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.spinner.hide();
          this.dataList = x;
          console.log(this.getDataList);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
}
