import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  ParameterMainGLInputHelp,
  ParameterMainGLViewModel,
} from 'src/app/interfaces/parameter-maintenance-gl';
import { ParameterMainGLService } from 'src/app/services/parameter-maintenance-gl.service';
import { HouseKeepingService } from '../../house-keeping.service';

@Component({
  selector: 'app-parameter-maintenance-gl',
  templateUrl: './parameter-maintenance-gl.component.html',
  styleUrls: ['./parameter-maintenance-gl.component.css'],
})
export class ParameterMaintenanceGLComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  public inputHelpData: ParameterMainGLInputHelp =
    new ParameterMainGLInputHelp();
  public detailsData: ParameterMainGLViewModel = new ParameterMainGLViewModel();
  

  parameterMaintenanceGLControlForm: FormGroup;

  constructor(
    private parameterMainGLService: ParameterMainGLService,
    private houseKeepingService: HouseKeepingService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.parameterMainGLService
      .getParameter()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        console.log('All Logg Data', data);
        this.inputHelpData = data;

        this.parameterMaintenanceGLControlForm.patchValue(
          this.inputHelpData.cculbcsparamdto
        );
      });
  }
  private initializeForm() {
    this.parameterMaintenanceGLControlForm = new FormGroup({
      MemCollectorFlag: new FormControl('0'),
      MemGroupFlag: new FormControl('0'),
      OldAccNoFlag: new FormControl('0'),
      ManualAccNo: new FormControl('0'),
      PrmMemApplication1: new FormControl('0'),
      PrmMemApplication2: new FormControl('0'),
      PrmLoanApplication1: new FormControl('0'),
      PrmLoanApplication2: new FormControl('0'),
      PrmCorrAccType: new FormControl('112'),
      PrmSMSFont: new FormControl('0'),
      PrmCSAutoVchCtrl: new FormControl('0'),
      PrmGLAutoVchCtrl: new FormControl('0'),
      PrmAutoVchInitializedCS: new FormControl('0'),
      PrmAutoVchInitializedGL: new FormControl('0'),
    });
  }

  public onUpdate() {
    console.log('YesValue==>', this.parameterMaintenanceGLControlForm.value);
    if (confirm('Are you sure you want to Update information?')) {
      this.spinner.show();
      var fValue = this.parameterMaintenanceGLControlForm.value;
      this.parameterMainGLService
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
  public onGetIndexChangeDetails() {
    this.spinner.show();
    var fValue = this.parameterMaintenanceGLControlForm.value;
    debugger;
    this.parameterMainGLService
      .GetIndexChangeDetails(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.detailsData = data;
        debugger;
        this.parameterMaintenanceGLControlForm.patchValue({
          PrmCSAutoVchCtrl: this.detailsData.PrmCSAutoVchCtrl,
        });
        this.spinner.hide();
      });
  }
}
