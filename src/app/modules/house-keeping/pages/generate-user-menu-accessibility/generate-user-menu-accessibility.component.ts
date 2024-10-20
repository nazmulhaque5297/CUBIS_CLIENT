import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { HouseKeepingService } from '../../house-keeping.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-generate-user-menu-accessibility',
  templateUrl: './generate-user-menu-accessibility.component.html',
  styleUrls: ['./generate-user-menu-accessibility.component.css'],
})
export class GenerateUserMenuAccessibilityComponent implements OnInit {
  allMenuList: any = [];
  allUserMenuList: any = [];
  userlist = [];
  modulelist = [];
  selectedMenuList = [];
  selectedCode: any = null;
  selectedModule: any = null;
  MenuAccessibilityControlForm: FormGroup;
  submitButtonText: string = 'Save';

  constructor(
    private houseKeepingService: HouseKeepingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.GetUserList();
    this.initializeForm();
  }
  private initializeForm() {
    this.MenuAccessibilityControlForm = new FormGroup({
      IdsNo: new FormControl('', [Validators.required]),
      selectedOptionCode: new FormControl('0'),
      selectedModule: new FormControl('0'),
    });
  }

  //Get user data
  GetUserList = () => {
    this.spinner.show();
    this.houseKeepingService
      .GetUserList('UserMaintenance')
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.userlist = x;
          console.log(this.userlist);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  GetSelectedMenuesByModuleId = (id) => {
    this.spinner.show();
    this.houseKeepingService
      .GetSelectedMenuesByModuleId(this.selectedCode, id)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          x.map((menu: any) => {
            if (menu?.IsAssigned) {
              menu['UserId'] = this.selectedCode;
            } else {
              menu['UserId'] = null;
            }
          });
          this.allMenuList = x;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  //getAllMenuList

  //module select handler
  selectModuleHandler = async (e) => {
    let target = e.target.value;
    this.selectedModule = target;
    await this.GetSelectedMenuesByModuleId(this.selectedModule);
  };

  changeSelectValue = (e) => {
    if (e.target.value) {
      let selectedCode = this.userlist.find(
        (x) => x.IdsNo == this.MenuAccessibilityControlForm.get('IdsNo').value
      );
      if (selectedCode) {
        this.MenuAccessibilityControlForm.patchValue({
          selectedOptionCode: selectedCode.IdsNo,
        });
        this.selectedCode = selectedCode.IdsNo;
        this.GetModulesByUserId(this.selectedCode);
      } else {
        this.MenuAccessibilityControlForm.patchValue({
          selectedOptionCode: 0,
          IdsNo: '',
        });
      }
    }
    document.getElementById(`selectedModule`).focus();
  };

  onEnterIDNoHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`selectedModule`).focus();
  }

  // Select Change Handler
  selectChangeHandler(event: any) {
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.userlist.find(
        (x) => x.IdsNo == ChangeSelectedOption
      );
      this.MenuAccessibilityControlForm.patchValue({
        selectedOptionCode: selectedCode.IdsNo,
        IdsNo: selectedCode.IdsNo == 0 ? '' : selectedCode.IdsNo,
      });
      this.selectedCode = selectedCode.IdsNo;
      this.GetModulesByUserId(this.selectedCode);
    }
    document.getElementById(`selectedModule`).focus();
  }

  // Get module list by Id
  GetModulesByUserId = (user) => {
    this.spinner.show();
    this.houseKeepingService
      .GetModulesByUserId(user)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();

          this.modulelist = x;
          console.log(this.modulelist);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  allMarkHandler = () => {
    if (!this.selectedCode) {
      this.toastr.warning('No User is selected !', 'Warning');
      return;
    }
    if (!this.selectedModule) {
      this.toastr.warning('No Module is selected !', 'Warning');
      return;
    }
    let data = [];
    this.allMenuList.map((module: any) => {
      module['IsAssigned'] = true;
      data.push(module);
    });
    this.allMenuList = data;
  };

  allUnMarkHandler = () => {
    if (!this.selectedCode) {
      this.toastr.warning('No User is selected !', 'Warning');
      return;
    }
    if (!this.selectedModule) {
      this.toastr.warning('No Module is selected !', 'Warning');
      return;
    }
    let data = [];
    this.allMenuList.map((module: any) => {
      module['IsAssigned'] = false;
      data.push(module);
    });
    this.allMenuList = data;
  };

  keyPress(event: any) {
    const pattern = /[0-9\+\-\, ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  checkHandler = (value) => {
    let list = this.allMenuList;
    let toBeUpdated = [];
    list.map((x) => {
      if (x.MenuNo == value.MenuNo) {
        x.IsAssigned = !x.IsAssigned;
      }
      toBeUpdated.push(x);
    });
    this.allMenuList = toBeUpdated;
  };

  updateHandler = () => {
    if (!this.selectedCode) {
      alert('No User is selected !');
      return;
    }
    if (!this.selectedModule) {
      alert('No Module is selected !');
      return;
    }
    if (confirm('Are you sure you want update data?')) {
      let formData = this.allMenuList.filter((x) => x.IsAssigned == true);
      this.spinner.show();
      this.houseKeepingService
        .AssignMenuToUser(
          formData,
          Number(this.selectedCode),
          Number(this.selectedModule)
        )
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
    }
  };
}
