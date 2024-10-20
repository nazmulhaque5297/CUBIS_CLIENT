import { FormControl, FormGroup, Validators } from '@angular/forms';
import { select } from '@ngrx/store';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { AllMemInfoModel } from 'src/app/modules/accounting/models/member-application.model';
import { AllMemberInformationService } from 'src/app/services/all-member-information.service';
import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';

@Component({
  selector: 'app-all-member-information',
  templateUrl: './all-member-information.component.html',
  styleUrls: ['./all-member-information.component.css'],
})
export class AllMemberInformationComponent implements OnInit {
  dataList: AllMemInfoModel[] = [];
  showDataList: AllMemInfoModel[] = [];
  allmeminfoForm: FormGroup;

  constructor(
    private memInformationService: AllMemberInformationService,
    private spinner: NgxSpinnerService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.getDataList();
    this.initializeForm();
  }

  private initializeForm() {
    this.allmeminfoForm = new FormGroup({
      searchMember: new FormControl('', [Validators.required]),
    });
  }
  getDataList = () => {
    this.spinner.show();
    this.memInformationService
      .GetAllMemInfo()
      .pipe(first())
      .subscribe(
        (x: AllMemInfoModel[]) => {
          this.spinner.hide();
          this.dataList = x;
          // this.showDataList = x;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  async memberSearch() {
    this.spinner.show();
    this.showDataList = [];
    if (
      this.allmeminfoForm.value.searchMember == '' ||
      this.allmeminfoForm.value.searchMember == 0
    ) {
      this.spinner.hide();
      alert('Please Write Something For Search..');
      this.allmeminfoForm.controls['searchMember'].setValue('');
      return;
    }
    let value = this.allmeminfoForm.value.searchMember;

    await this.filteringData(value);
    if (this.showDataList.length == 0) {
      alert('No member found!');
    }
    // if (Number(value)) {
    //   this.showDataList = this.dataList.filter((x) =>
    //     x.MemNo.toString().includes(value) || x.MobileNo.toString().includes(value)
    //   );
    // } else {
    //   value = value.toString().toLowerCase();
    //   this.showDataList = this.dataList.filter((x) =>
    //     x.MemName.toLowerCase().includes(value.toLowerCase())
    //     ||x.MemFName.toLowerCase().includes(value.toLowerCase())
    //     ||x.MemMName.toLowerCase().includes(value.toLowerCase())
    //   );
    // }
  }

  async filteringData(value: any) {
    for (var i = 0; i < this.dataList.length; i++) {
      if (i == 0) this.spinner.show();
      if (i == this.dataList.length - 1) this.spinner.hide();
      if (
        typeof value == 'string' &&
        this.dataList[i].MemFName.toLowerCase().includes(value.toLowerCase()) ==
          true
      ) {
        this.showDataList.push(this.dataList[i]);
        continue;
      }
      if (
        typeof value == 'string' &&
        this.dataList[i].MemMName.toLowerCase().includes(value.toLowerCase()) ==
          true
      ) {
        this.showDataList.push(this.dataList[i]);
        continue;
      }
      if (
        typeof value == 'string' &&
        this.dataList[i].MemName.toLowerCase().includes(value.toLowerCase()) ==
          true
      ) {
        this.showDataList.push(this.dataList[i]);
        continue;
      }
      if (
        typeof value == 'string' &&
        this.dataList[i].MemSName.toLowerCase().includes(value.toLowerCase()) ==
          true
      ) {
        this.showDataList.push(this.dataList[i]);
        continue;
      }
      if (
        Number(value) > 0 &&
        this.dataList[i].MemNo.toString().includes(value) == true
      ) {
        this.showDataList.push(this.dataList[i]);
        continue;
      }
      if (
        Number(value) > 0 &&
        this.dataList[i].MobileNo.toString().includes(value) == true
      ) {
        this.showDataList.push(this.dataList[i]);
        continue;
      }
    }
  }
}
