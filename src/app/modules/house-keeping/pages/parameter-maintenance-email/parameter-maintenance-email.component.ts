import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { HouseKeepingService } from '../../house-keeping.service';
import { ToastrService } from 'ngx-toastr';
import { ParameterMainGLedgerInputHelp } from 'src/app/interfaces/parameter-maintenance-gledger';
import { ParameterMainGLedgerService } from 'src/app/services/parameter-maintenance-gledger.service';
import { EmailControlDataListModel } from '../../../Models/HoseKeepingModel';
@Component({
  selector: 'app-parameter-maintenance-email',
  templateUrl: './parameter-maintenance-email.component.html',
  styleUrls: ['./parameter-maintenance-email.component.css'],
})
export class ParameterMaintenanceEmailComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  public inputHelpData: ParameterMainGLedgerInputHelp =
    new ParameterMainGLedgerInputHelp();
  parameterMaintenanceEmailControlForm1: FormGroup;
  parameterMaintenanceEmailControlForm2: FormGroup;
  dataList: EmailControlDataListModel[] = [];
  emailMessage1: string = '';
  emailMessage2: string = '';
  nameMessage1: string = '';
  nameMessage2: string = '';
  constructor(
    private parameterMainGLedgerService: ParameterMainGLedgerService,
    private houseKeepingService: HouseKeepingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadHelpData();
    this.initializeForm();
  }
  loadHelpData() {
    this.spinner.show();
    this.houseKeepingService
      .EmailControlHelpData()
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.dataList = x.MailLoadData;
          console.log(x);
          //this.parameterMaintenanceEmailControlForm1.controls['Email'].setValue(x.FromEmail);
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }
  initializeForm() {
    this.parameterMaintenanceEmailControlForm1 = new FormGroup({
      Email: new FormControl('', Validators.email),
      Password: new FormControl(''),
    });
    this.parameterMaintenanceEmailControlForm2 = new FormGroup({
      Name: new FormControl(''),
      Email: new FormControl('', Validators.email),
    });
  }
  insertData() {
    if (confirm('Are you sure you want to Submit information?')) {
      if (
        this.parameterMaintenanceEmailControlForm2.value.Name == '' ||
        this.parameterMaintenanceEmailControlForm2.value.Email == ''
      ) {
        alert('Pleaser Provide all data in Email to Address');
      } else {
        let selectedCode = this.dataList.find(
          (x) =>
            x.Email == this.parameterMaintenanceEmailControlForm2.value.Email
        );
        if (selectedCode) {
          this.spinner.hide();
          alert('This Email is already exist');
          this.initializeForm();
        } else {
          if (this.parameterMaintenanceEmailControlForm2.invalid) {
            alert('Please input the valid format of email');
            this.parameterMaintenanceEmailControlForm2.controls[
              'Name'
            ].setValue('');
            this.parameterMaintenanceEmailControlForm2.controls[
              'Email'
            ].setValue('');
            return;
          } else {
            this.houseKeepingService
              .SubmitEmailToAddressData(
                this.parameterMaintenanceEmailControlForm2.value
              )
              .pipe(first())
              .subscribe(
                (x: any) => {
                  if (x == 1) {
                    this.ngOnInit();
                    alert('Data Submitted Successfully.!');
                  } else {
                    this.toastr.error("Error Data didn't submitted!", 'Error');
                  }
                  this.spinner.hide();
                },
                (err) => {
                  this.spinner.hide();
                }
              );
          }
        }
      }
    }
  }
  updateData() {
    if (confirm('Are you sure you want to Update information?')) {
      if (this.parameterMaintenanceEmailControlForm1.invalid) {
        alert('Please input the valid format of email');
        this.parameterMaintenanceEmailControlForm1.controls['Email'].setValue(
          ''
        );
        this.parameterMaintenanceEmailControlForm1.controls[
          'Password'
        ].setValue('');
        return;
      } else {
        this.spinner.show();
        if (
          (this.parameterMaintenanceEmailControlForm1.value.Name =
            '' ||
            this.parameterMaintenanceEmailControlForm1.value.Password == '')
        ) {
          alert('Pleaser Provide all data in Email to Address');
        } else {
          this.houseKeepingService
            .UpdateEmailFromAddressData(
              this.parameterMaintenanceEmailControlForm1.value
            )
            .pipe(first())
            .subscribe(
              (x: any) => {
                if (x == 1) {
                  this.ngOnInit();
                  alert('Data Submitted Successfully.!');
                } else {
                  this.toastr.error("Error Data didn't submitted!", 'Error');
                }
                this.spinner.hide();
              },
              (err) => {
                this.spinner.hide();
              }
            );
        }
      }
    }
  }
  deleteData(item: any) {
    if (confirm('Are you you want to delete information?')) {
      this.houseKeepingService
        .DeleteEmailData(item.Id)
        .pipe(first())
        .subscribe(
          (x: any) => {
            if (x == 1) {
              this.ngOnInit();
              alert('Data Deleted Successfully.!');
            } else {
              this.toastr.error("Error Data didn't Deleted!", 'Error');
            }
            this.spinner.hide();
          },
          (err) => {
            this.spinner.hide();
          }
        );
    }
  }

  validateEmail1() {
    console.log('come');
    var validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let data = this.parameterMaintenanceEmailControlForm2.value.Email;
    if (data.match(validRegex)) {
      this.emailMessage1 = '';
    } else {
      if (this.parameterMaintenanceEmailControlForm2.value.Email == '') {
        this.emailMessage1 = '*Email Required';
      } else {
        this.emailMessage1 = '*Email Invalid';
      }
    }
  }

  validateEmail2() {
    var validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let data = this.parameterMaintenanceEmailControlForm1.value.Email;
    console.log(data);
    if (data.match(validRegex)) {
      this.emailMessage2 = '';
    } else {
      if (this.parameterMaintenanceEmailControlForm2.value.Email == '') {
        this.emailMessage2 = '*Email Invalid';
      } else {
        this.emailMessage2 = '*Email Invalid';
      }
    }
  }

  validateName1() {
    if (this.parameterMaintenanceEmailControlForm2.value.Name == '') {
      this.nameMessage1 = '*Name Required';
    } else {
      this.nameMessage1 = '';
    }
  }

  validateName2() {
    if (this.parameterMaintenanceEmailControlForm1.value.Password == '') {
      this.nameMessage2 = '*Password Required';
    } else {
      this.nameMessage2 = '';
    }
  }
}
