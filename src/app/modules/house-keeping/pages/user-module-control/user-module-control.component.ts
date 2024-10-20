import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { HouseKeepingService } from '../../house-keeping.service';
import { ToastrService } from 'ngx-toastr';

import { ModuleListByUser, Module } from '../../../Models/HoseKeepingModel';

@Component({
  selector: 'app-user-module-control',
  templateUrl: './user-module-control.component.html',
  styleUrls: ['./user-module-control.component.css'],
})
export class UserModuleControlComponent implements OnInit {
  allModuleList: Module[] = [];
  userlist = [];
  selectedUser: any = null;
  selectedUserModule: ModuleListByUser[] = [];
  selectedUserModulePermissionList: any = [];

  ModuleControlForm: FormGroup;

  constructor(
    private houseKeepingService: HouseKeepingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // this.getModuleList();
    this.GetAllModule();
    this.GetUserList();
    this.initializeForm();
  }

  private initializeForm() {
    this.ModuleControlForm = new FormGroup({
      IDNumber: new FormControl(''),
      selectedOptionCode: new FormControl('0'),
    });
  }

  //Get the all Module Name
  GetAllModule = () => {
    this.spinner.show();
    this.houseKeepingService
      .GetAllModule()
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.allModuleList = x;
          console.log('GetAllModuleList:', this.allModuleList);
          let data = [];
          this.allModuleList.map((module: Module) => {
            let checkModule = this.selectedUserModule.find(
              (x) => x.ModuleNo == module.Id
            );
            if (checkModule) {
              module['permission'] = true;
            } else {
              module['permission'] = false;
            }
            data.push(module);
          });
          this.selectedUserModulePermissionList = data;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  // Get User Information List
  //SystemControl/Module/GetModulesByUserId?userId=2

  onOptionsSelectedId = (event) => {
    const value = event.target.value;
    this.ModuleControlForm.controls['selectedOptionCode'].setValue(
      this.ModuleControlForm.value.IDNumber
    );
    console.log('optionSelectedValue:', value);
    this.selectedUser = value;
    this.getModulesByUser(this.selectedUser);
  };

  onOptionsSelected = (event) => {
    const value = event.target.value;
    this.ModuleControlForm.controls['IDNumber'].setValue(
      this.ModuleControlForm.value.selectedOptionCode
    );
    console.log('optionSelectedValue:', value);
    this.selectedUser = value;
    this.getModulesByUser(this.selectedUser);
  };
  getModulesByUser = (user) => {
    this.spinner.show();
    this.houseKeepingService
      .GetModulesByUserId(user)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.selectedUserModule = x;
          console.log('GetModuleByUser:', this.selectedUserModule);
          let data = [];
          this.allModuleList.map((module: Module) => {
            let checkModule = this.selectedUserModule.find(
              (x) => x.ModuleNo == module.Id
            );
            if (checkModule) {
              module['permission'] = true;
            } else {
              module['permission'] = false;
            }
            data.push(module);
          });
          this.selectedUserModulePermissionList = data;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  permissionChange = (value) => {
    let list = this.selectedUserModulePermissionList;
    let toBeUpdated = [];
    list.map((x) => {
      if (x.Id == value.Id) {
        x.permission = !x.permission;
      }
      toBeUpdated.push(x);
    });
    this.selectedUserModulePermissionList = toBeUpdated;
  };
  GetUserList = () => {
    this.spinner.show();
    this.houseKeepingService
      .GetUserList('UserMaintenance')
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.userlist = x;
          console.log('UserList:', this.userlist);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  updatePermission = () => {
    if (!this.selectedUser) {
      alert('No User is selected !');
      return;
    }
    if (confirm('Are You Sure Want To Add Module?')) {
      let formData = this.selectedUserModulePermissionList.filter(
        (x) => x.permission == true
      );
      this.spinner.show();
      this.houseKeepingService
        .AssignModuleToUser(formData, Number(this.selectedUser))
        .pipe(first())
        .subscribe(
          (x: any) => {
            this.spinner.hide();
            alert('Permission Updated !');
          },
          (err) => {
            this.spinner.hide();
          }
        );
      console.log(formData);
    }
  };
}
