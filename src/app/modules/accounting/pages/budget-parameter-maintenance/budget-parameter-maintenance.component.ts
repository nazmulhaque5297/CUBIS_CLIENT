import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { BudgetInputLoadModel } from '../../models/accounting-input-budget.model';
import { BudgetParameterService } from '../../services/accounting module/budget-parameter.service';

@Component({
  selector: 'app-budget-parameter-maintenance',
  templateUrl: './budget-parameter-maintenance.component.html',
  styleUrls: ['./budget-parameter-maintenance.component.css'],
})
export class BudgetParameterMaintenanceComponent implements OnInit {
  loadData: BudgetInputLoadModel = new BudgetInputLoadModel();
  BudgetParameterForm: FormGroup;
  submitBtn: boolean = false;
  updateBtn: boolean = false;
  constructor(
    private budgetParameterService: BudgetParameterService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }
  initializeForm() {
    this.BudgetParameterForm = new FormGroup({
      GlCode: new FormControl(''),
      GlCodeDesc: new FormControl('0'),
      JulyCr: new FormControl(''),
      AugustCr: new FormControl(''),
      SeptemberCr: new FormControl(''),
      OctoberCr: new FormControl(''),
      NovemberCr: new FormControl(''),
      DecemberCr: new FormControl(''),
      JanuaryCr: new FormControl(''),
      FebruaryCr: new FormControl(''),
      MarchCr: new FormControl(''),
      AprilCr: new FormControl(''),
      MayCr: new FormControl(''),
      JuneCr: new FormControl(''),
      JulyDr: new FormControl(''),
      AugustDr: new FormControl(''),
      SeptemberDr: new FormControl(''),
      OctoberDr: new FormControl(''),
      NovemberDr: new FormControl(''),
      DecemberDr: new FormControl(''),
      JanuaryDr: new FormControl(''),
      FebruaryDr: new FormControl(''),
      MarchDr: new FormControl(''),
      AprilDr: new FormControl(''),
      MayDr: new FormControl(''),
      JuneDr: new FormControl(''),
      BgtAmtCr: new FormControl(''),
      BgtAmtDr: new FormControl(''),
    });
    this.inputLoadData();
  }
  inputLoadData() {
    this.spinner.show();
    this.budgetParameterService
      .GetBudgetParameterLoadData()
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.loadData = x;
          console.log(this.loadData);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }
  submitData() {
    if (
      this.BudgetParameterForm.value.GlCode == 0 ||
      this.BudgetParameterForm.value.GlCode == null
    ) {
      alert('Please Select Account Type!');
    } else {
      if (confirm('Are you you want to submit information?')) {
        this.budgetParameterService
          .InsertBudgetParameterData(this.BudgetParameterForm.value)
          .pipe(first())
          .subscribe((x: any) => {
            if (x == 1) {
              alert('Data Submitted Successfully.!');
              this.ngOnInit();
            } else {
              alert("Error Data didn't submitted!");
            }
          });
      }
    }
  }
  exitPage() {
    this.router.navigate(['accounting/']);
  }

  // enter key events
  onEnterGlCodeHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`BgtAmtDr`).focus();
  }
  onEnterBgtAmtDrHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`BgtAmtCr`).focus();
  }

  selectChangeHandler(data: any) {
    let selectedCode;
    if (data.target.value.length == 6) {
      selectedCode = this.loadData.AccTypeList.find(
        (x) => x.AccTypeCode.toString().slice(2, 8) == data.target.value
      );
    } else if (data.target.value.length == 8) {
      selectedCode = this.loadData.AccTypeList.find(
        (x) => x.AccTypeCode == data.target.value
      );
    }

    if (selectedCode) {
      this.BudgetParameterForm.controls['GlCode'].setValue(
        selectedCode.AccTypeCode
      );
      this.BudgetParameterForm.controls['GlCodeDesc'].setValue(
        selectedCode.AccTypeCode
      );
      this.budgetParameterService
        .GetBudgetParameterAccTypeChangeData(selectedCode.AccTypeCode)
        .pipe(first())
        .subscribe((x: any) => {
          console.log(x);
          this.BudgetParameterForm.controls['GlCode'].setValue(x.GlCode);
          this.BudgetParameterForm.controls['JulyCr'].setValue(x.JulyCr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['AugustCr'].setValue(x.AugustCr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['SeptemberCr'].setValue(
            x.SeptemberCr.toLocaleString('en-US', { minimumFractionDigits: 2 }).toLocaleString('en-US', { minimumFractionDigits: 2 })
          );
          this.BudgetParameterForm.controls['OctoberCr'].setValue(x.OctoberCr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['NovemberCr'].setValue(
            x.NovemberCr.toLocaleString('en-US', { minimumFractionDigits: 2 })
          );
          this.BudgetParameterForm.controls['DecemberCr'].setValue(
            x.DecemberCr.toLocaleString('en-US', { minimumFractionDigits: 2 })
          );
          this.BudgetParameterForm.controls['JanuaryCr'].setValue(x.JanuaryCr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['FebruaryCr'].setValue(
            x.FebruaryCr.toLocaleString('en-US', { minimumFractionDigits: 2 })
          );
          this.BudgetParameterForm.controls['MarchCr'].setValue(x.MarchCr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['AprilCr'].setValue(x.AprilCr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['MayCr'].setValue(x.MayCr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['JuneCr'].setValue(x.JuneCr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['JulyDr'].setValue(x.JulyDr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['AugustDr'].setValue(x.AugustDr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['SeptemberDr'].setValue(
            x.SeptemberDr.toLocaleString('en-US', { minimumFractionDigits: 2 })
          );
          this.BudgetParameterForm.controls['OctoberDr'].setValue(x.OctoberDr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['NovemberDr'].setValue(
            x.NovemberDr.toLocaleString('en-US', { minimumFractionDigits: 2 })
          );
          this.BudgetParameterForm.controls['DecemberDr'].setValue(
            x.DecemberDr.toLocaleString('en-US', { minimumFractionDigits: 2 })
          );
          this.BudgetParameterForm.controls['JanuaryDr'].setValue(x.JanuaryDr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['FebruaryDr'].setValue(
            x.FebruaryDr.toLocaleString('en-US', { minimumFractionDigits: 2 })
          );
          this.BudgetParameterForm.controls['MarchDr'].setValue(x.MarchDr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['AprilDr'].setValue(x.AprilDr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['MayDr'].setValue(x.MayDr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['JuneDr'].setValue(x.JuneDr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['BgtAmtCr'].setValue(x.BgtAmtCr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['BgtAmtDr'].setValue(x.BgtAmtDr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.submitBtn = x.Insert;
          this.updateBtn = x.Update;
          var s = x.GlCode.toString();
          if (s[0] == '4') {
            this.BudgetParameterForm.controls['BgtAmtDr'].disable();
            this.BudgetParameterForm.controls['BgtAmtCr'].enable();
          } else if (s[0] == '5') {
            this.BudgetParameterForm.controls['BgtAmtCr'].disable();
            this.BudgetParameterForm.controls['BgtAmtDr'].enable();
          } else {
            this.BudgetParameterForm.controls['BgtAmtDr'].enable();
            this.BudgetParameterForm.controls['BgtAmtCr'].enable();
          }
        });
    } else {
      if (data.target.value != '') alert('GL Code is not valid!');
      this.initializeForm();
    }
    document.getElementById(`BgtAmtDr`).focus();
  }

  changeBgtAmtCr() {
    if (
      this.BudgetParameterForm.value.GlCode == 0 ||
      this.BudgetParameterForm.value.GlCode == null
    ) {
      alert('Please Select Account Type!');
    } else {
      this.budgetParameterService
        .ChangeBgtAmtCr(this.BudgetParameterForm.value.BgtAmtCr)
        .pipe(first())
        .subscribe((x: any) => {
          this.BudgetParameterForm.controls['JulyCr'].setValue(x.JulyCr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['AugustCr'].setValue(x.AugustCr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['SeptemberCr'].setValue(
            x.SeptemberCr.toLocaleString('en-US', { minimumFractionDigits: 2 })
          );
          this.BudgetParameterForm.controls['OctoberCr'].setValue(x.OctoberCr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['NovemberCr'].setValue(
            x.NovemberCr.toLocaleString('en-US', { minimumFractionDigits: 2 })
          );
          this.BudgetParameterForm.controls['DecemberCr'].setValue(
            x.DecemberCr.toLocaleString('en-US', { minimumFractionDigits: 2 })
          );
          this.BudgetParameterForm.controls['JanuaryCr'].setValue(x.JanuaryCr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['FebruaryCr'].setValue(
            x.FebruaryCr.toLocaleString('en-US', { minimumFractionDigits: 2 })
          );
          this.BudgetParameterForm.controls['MarchCr'].setValue(x.MarchCr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['AprilCr'].setValue(x.AprilCr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['MayCr'].setValue(x.MayCr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['JuneCr'].setValue(x.JuneCr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['BgtAmtCr'].setValue(x.BgtAmtCr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        });
    }
  }
  changeBgtAmtDr() {
    if (
      this.BudgetParameterForm.value.GlCode == 0 ||
      this.BudgetParameterForm.value.GlCode == null
    ) {
      alert('Please Select Account Type!');
    } else {
      this.budgetParameterService
        .ChangeBgtAmtDr(this.BudgetParameterForm.value.BgtAmtDr)
        .pipe(first())
        .subscribe((x: any) => {
          this.BudgetParameterForm.controls['JulyDr'].setValue(x.JulyDr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['AugustDr'].setValue(x.AugustDr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['SeptemberDr'].setValue(
            x.SeptemberDr.toLocaleString('en-US', { minimumFractionDigits: 2 })
          );
          this.BudgetParameterForm.controls['OctoberDr'].setValue(x.OctoberDr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['NovemberDr'].setValue(
            x.NovemberDr.toLocaleString('en-US', { minimumFractionDigits: 2 })
          );
          this.BudgetParameterForm.controls['DecemberDr'].setValue(
            x.DecemberDr.toLocaleString('en-US', { minimumFractionDigits: 2 })
          );
          this.BudgetParameterForm.controls['JanuaryDr'].setValue(x.JanuaryDr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['FebruaryDr'].setValue(
            x.FebruaryDr.toLocaleString('en-US', { minimumFractionDigits: 2 })
          );
          this.BudgetParameterForm.controls['MarchDr'].setValue(x.MarchDr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['AprilDr'].setValue(x.AprilDr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['MayDr'].setValue(x.MayDr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['JuneDr'].setValue(x.JuneDr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          this.BudgetParameterForm.controls['BgtAmtDr'].setValue(x.BgtAmtDr.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        });
    }
  }
}
