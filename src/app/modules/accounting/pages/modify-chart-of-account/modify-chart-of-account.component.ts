import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { AccountingService } from './../../services/accounting.service';
import { GLCodeDetailsModel } from '../../models/gl-code-maintenance.model';


@Component({
  selector: 'app-modify-chart-of-account',
  templateUrl: './modify-chart-of-account.component.html',
  styleUrls: ['./modify-chart-of-account.component.css']
})
export class ModifyChartOfAccountComponent implements OnInit {
  ModifyChartOfAccount: FormGroup;
  GlCodeList = [];
  GLMiscAcc: number;
  GLPrtPos: number;
  GLRecType: number;
  public GLCodeViewModel: GLCodeDetailsModel = new GLCodeDetailsModel();
  constructor(
    private AccountingService: AccountingService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService
  ) { }

  ngOnInit(): void {
    this.initializeForm()
    this.getGLCodeList()
  }
  private initializeForm() {
    this.ModifyChartOfAccount = new FormGroup({
      GLCodeId: new FormControl(''),
      GLCodeDescription: new FormControl('0'),
      GLAccDesc: new FormControl(''),
      GLAccDescB: new FormControl(''),
      GLAccMode: new FormControl(''),
      OverDraft: new FormControl(false),
      Msic: new FormControl(false),
      Status: new FormControl(''),
    });
  }

  getGLCodeList = () => {
    this.spinner.show();
    this.AccountingService.getGlCodeList().pipe(first()).subscribe((x: any) => {
      this.spinner.hide();
      this.GlCodeList = x;
    }, err => {
      this.spinner.hide();
    });
  }

  onGLCodeChange = (e) => {
    if(!e.target.value) return;
    this.spinner.show();
    this.AccountingService.getGlCodeDetails(+e.target.value).pipe(first()).subscribe((x: any) => {
      this.spinner.hide();
      console.log('get result===', x)
      this.GLCodeViewModel = x;
      this.GLMiscAcc = x.GLMiscAcc;
      this.GLPrtPos = x.GLPrtPos;
      this.GLRecType = x.GLRecType;
      this.ModifyChartOfAccount.controls['GLCodeId'].setValue(x.GLAccNo);
      this.ModifyChartOfAccount.controls['GLCodeDescription'].setValue(x.GLAccNo);
      this.ModifyChartOfAccount.controls['GLAccDesc'].setValue(x.GLAccDesc);
      this.ModifyChartOfAccount.controls['GLAccDescB'].setValue(x.GLAccDescB);
      this.ModifyChartOfAccount.controls['GLAccMode'].setValue(x.GLAccMode);
      this.ModifyChartOfAccount.controls['OverDraft'].setValue(x.GLBalanceType);
      this.ModifyChartOfAccount.controls['Msic'].setValue(x.MsicAcc);
      this.ModifyChartOfAccount.controls['Status'].setValue(x.Status);
      if (!x.Success) {
        alert(x.Message);
        this.initializeForm()
      }
    }, err => {
      this.spinner.hide();
    });
  }

  ModifyHandler = () => {
    this.spinner.show();
    let FormData = this.ModifyChartOfAccount.value;
    let GLFormData = {
      GLAccDesc: FormData.GLAccDesc,
      GLAccDescB: FormData.GLAccDescB,
      GLBalanceType: FormData.OverDraft ? 1 : 0,
      GLAccMode: FormData.GLAccMode,
      GLMiscAcc: FormData.Msic ? 1 : 0,
      Status: FormData.Status,
      GLAccNo: FormData.GLCodeId,
      GLPrtPos: this.GLPrtPos,
      MsicAcc: FormData.Msic,
      GLRecType: this.GLRecType,
    }
    console.log('update Info====', GLFormData);
    this.AccountingService.UpdateGLCode(GLFormData).pipe(first()).subscribe((x: any) => {
      this.spinner.hide();
      this.initializeForm();
      if (x.Success) {
        alert(x.Message);
      } else {
        alert(x.Message);
      }

      console.log('update res===', x);
    }, err => {
      this.spinner.hide();
    });
  }

}
