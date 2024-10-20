import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { DayEndProcessService } from 'src/app/services/day-end-process.service';
import { IDayEndProcessInputHelp } from '../../models/day-end-process.model';
import { Router } from '@angular/router';
import {
  ApiResponse,
  WrongAccountModel,
} from 'src/app/interfaces/api-response';

@Component({
  selector: 'app-day-end-process',
  templateUrl: './day-end-process.component.html',
  styleUrls: ['./day-end-process.component.css'],
})
export class DayEndProcessComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  dayEndProcessForm: FormGroup;
  showdiv: boolean = false;
  public dayEndProcessInputHelp = new IDayEndProcessInputHelp();
  public showModal: boolean = false;
  public wrongAccountNo: WrongAccountModel[];

  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private pService: DayEndProcessService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.showModal = false;
    this.wrongAccountNo = [];
    this.initializeForm();
    this.getInputHelp();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm() {
    this.dayEndProcessForm = new FormGroup({
      ProcessDate: new FormControl('', [Validators.required]),
      EndOfDay: new FormControl('', [Validators.required]),
      BegYear: new FormControl(''),
      EndYear: new FormControl(''),
    });
  }

  private getInputHelp(): void {
    this.pService
      .GetInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.dayEndProcessInputHelp = data;
        this.dayEndProcessForm.controls['ProcessDate'].setValue(
          data.ProcessDate
        );
        this.dayEndProcessForm.controls['BegYear'].setValue(data.BegYear);
        this.dayEndProcessForm.controls['EndYear'].setValue(data.EndYear);
      });
  }

  onSubmit(): void {
    if (this.dayEndProcessForm.invalid) {
      alert('Please fill all the required field!');
      return;
    }
    this.spinner.show();

    var fValue = this.dayEndProcessForm.value;
    this.pService
      .Submit(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: ApiResponse) => {
        this.spinner.hide();
        if (data.Success) {
          alert(data.Message);
          this.router.navigate(['/sign-in']);
        } else if (data.WrongAccount != null && data.WrongAccount.length > 0) {
          this.showModal = true;
          this.wrongAccountNo = data.WrongAccount;
        } else {
          alert(data.Message);
        }
      });
  }

  clickOk() {
    this.showModal = false;
    this.wrongAccountNo = [];
  }
}
