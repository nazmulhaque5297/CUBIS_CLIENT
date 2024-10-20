import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { HouseKeepingService } from '../../house-keeping.service';
import { ToastrService } from 'ngx-toastr';
import { ParameterMainSysInputHelp } from 'src/app/interfaces/parameter-maintenance-sys';
import { ParameterMainSysService } from 'src/app/services/parameter-maintenance-sys.service';

@Component({
  selector: 'app-parameter-maintenance-sys',
  templateUrl: './parameter-maintenance-sys.component.html',
  styleUrls: ['./parameter-maintenance-sys.component.css'],
})
export class ParameterMaintenanceSysComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  public inputHelpData: ParameterMainSysInputHelp = new ParameterMainSysInputHelp();
  parameterMaintenanceSysControlForm: FormGroup;
  constructor(
    private parameterMainSysService: ParameterMainSysService,
    private houseKeepingService: HouseKeepingService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.parameterMainSysService
      .getParameter()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        this.parameterMaintenanceSysControlForm.patchValue(this.inputHelpData);
      });
  }

  private initializeForm() {
    this.parameterMaintenanceSysControlForm = new FormGroup({
      PrmUnitName: new FormControl(''),
      PrmUnitShortName: new FormControl(''),
      PrmUnitAdd1: new FormControl(''),
      PrmUnitAdd2: new FormControl(''),
      PrmUnitAdd3: new FormControl(''),
      PrmUnitPhone: new FormControl(''),
      PrmSystemPath: new FormControl(''),
      PrmBackUpPath: new FormControl(''),
      PrmDataPath: new FormControl(''),
      PrmEmailDataPath: new FormControl(''),
      PrmOutDataPath: new FormControl(''),
      PrmInDataPath: new FormControl(''),
      PrmPicturePath: new FormControl(''),
      PrmTimeOut: new FormControl(''),
    });
  }
  public onUpdate() {
    if (confirm('Are you sure you want to Update information?')) {
      this.spinner.show();
      var fValue = this.parameterMaintenanceSysControlForm.value;
      this.parameterMainSysService
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
  // enter key events
  onEnterPrmUnitNameHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`PrmUnitShortName`).focus();
  }
  onEnterPrmUnitShortNameHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`PrmUnitAdd1`).focus();
  }
  onEnterPrmUnitAdd1Handler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`PrmUnitAdd2`).focus();
  }
  onEnterPrmUnitAdd2Handler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`PrmUnitAdd3`).focus();
  }
  onEnterPrmUnitAdd3Handler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`PrmUnitPhone`).focus();
  }
  onEnterPrmUnitPhoneHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`PrmSystemPath`).focus();
  }
  onEnterPrmSystemPathHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`PrmBackUpPath`).focus();
  }
  onEnterPrmBackUpPathHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`PrmDataPath`).focus();
  }
  onEnterPrmDataPathHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`PrmEmailDataPath`).focus();
  }
  onEnterPrmEmailDataPathHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`PrmOutDataPath`).focus();
  }
  onEnterPrmOutDataPathHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`PrmInDataPath`).focus();
  }
  onEnterPrmInDataPathHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`PrmPicturePath`).focus();
  }
  onEnterPrmPicturePathHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`PrmTimeOut`).focus();
  }
}
