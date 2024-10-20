import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { HouseKeepingService } from '../../house-keeping.service';
import { ToastrService } from 'ngx-toastr';
import { ParameterMainGLedgerInputHelp } from 'src/app/interfaces/parameter-maintenance-gledger';
import { ParameterMainGLedgerService } from 'src/app/services/parameter-maintenance-gledger.service';

@Component({
  selector: 'app-parameter-maintenance-gledger',
  templateUrl: './parameter-maintenance-gledger.component.html',
  styleUrls: ['./parameter-maintenance-gledger.component.css'],
})
export class ParameterMaintenanceGledgerComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  public inputHelpData: ParameterMainGLedgerInputHelp = new ParameterMainGLedgerInputHelp();
  parameterMaintenanceGLedgerControlForm: FormGroup;

  constructor(
    private parameterMainGLedgerService: ParameterMainGLedgerService,
    private houseKeepingService: HouseKeepingService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.parameterMainGLedgerService
      .getParameter()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        this.parameterMaintenanceGLedgerControlForm.patchValue(
          this.inputHelpData
        );
      });
  }
  private initializeForm() {
    this.parameterMaintenanceGLedgerControlForm = new FormGroup({
      FinancialMonth: new FormControl('0'),
      PLCode: new FormControl('0'),
      UDPLCode: new FormControl('0'),
    });
  }

  //enter key events
  onEnterFinancialMonthHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`PLCode`).focus();
  }
  onEnterPLCodeHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`UDPLCode`).focus();
  }

  public onUpdate() {
    if (confirm('Are you sure you want to Update information?')) {
      this.spinner.show();
      var fValue = this.parameterMaintenanceGLedgerControlForm.value;
      this.parameterMainGLedgerService
        .update(fValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res) => {
            if (res.Success) {
              this.spinner.hide();
              alert('Information Updated !');
            }
          },
          (err) => {
            this.spinner.hide();
            this.toaster.error('Something Went Wrong !', 'Error');
          }
        );
    }
  }
}
