import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { YearEndService } from '../../services/year-end.service';

@Component({
  selector: 'app-year-end-post-transcation',
  templateUrl: './year-end-post-transcation.component.html',
  styleUrls: ['./year-end-post-transcation.component.css'],
})
export class YearEndPostTranscationComponent implements OnInit {
  DataList: any[] = [];
  YEPostTrnForm: FormGroup;

  constructor(
    private yearEndService: YearEndService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.DataList = [];
  }

  initializeForm() {
    this.YEPostTrnForm = new FormGroup({
      CtrlTrnDate: new FormControl(''),
    });
    this.inputLoadData();
  }
  inputLoadData() {
    this.spinner.show();
    this.yearEndService
      .YEPostTrnLoad()
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.YEPostTrnForm.controls['CtrlTrnDate'].setValue(x.CtrlTrnDate);
          this.DataList = x.TransactionList;
          console.log(x);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }
  exitPage() {
    this.router.navigate(['accounting/']);
  }

  finalPostBtn() {
    this.spinner.show();
    this.yearEndService
      .YEPostData()
      .pipe(first())
      .subscribe((x: any) => {
        if (x.Success) {
          alert(x.Message);
          this.ngOnInit();
          this.spinner.hide();
        } else {
          this.toastr.error();
          this.spinner.hide();
        }
      });
  }
}
