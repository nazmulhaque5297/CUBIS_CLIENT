import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { AccountingService } from '../../services/accounting.service';

@Component({
  selector: 'app-member-referance-picture-authorization',
  templateUrl: './member-referance-picture-authorization.component.html',
  styleUrls: ['./member-referance-picture-authorization.component.css'],
})
export class MemberReferancePictureAuthorizationComponent implements OnInit {
  MemberReferancePictureAuthorizationForm: FormGroup;
  memInfo = [];
  refMemInfo = [];
  refMemName: string;
  refMemType: number;
  url: any;
  msg = '';
  fileToUpload: any;
  showUpdate: boolean = false;
  fileHere: boolean = false;

  constructor(
    private accountingService: AccountingService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.url = '';
    this.memInfo = [];
    this.refMemInfo = [];
    this.msg = '';
    this.refMemName = '';
    this.refMemType = 0;
    this.showUpdate = false;
    this.fileHere = false;
  }
  private initializeForm() {
    this.MemberReferancePictureAuthorizationForm = new FormGroup({
      MemNo: new FormControl(''),
      RefMemNo: new FormControl(''),
      Relation: new FormControl(''),
      FolderPath: new FormControl(''),
    });
    this.pageLoad();
  }

  pageLoad() {
    this.accountingService
      .MemberPictureLoadData()
      .pipe(first())
      .subscribe((x: any) => {
        console.log(x);
        this.MemberReferancePictureAuthorizationForm.controls[
          'FolderPath'
        ].setValue(x.data);
      });
  }

  // enter key events

  onEnterMemNoHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`RefMemNo`).focus();
  }

  onEnterRefMemNoHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`RelWithMem`).focus();
  }

  selectFile(event: any) {
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      this.msg = 'You must select an image';
      alert(this.msg);
      return;
    }
    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.msg = 'Only images are supported';
      alert(this.msg);
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.msg = '';
      this.url = reader.result;
    };
    this.fileToUpload = event.target.files[0];
    this.fileHere = true;
  }

  // Get Member Info
  GetMemInformation = () => {
    this.spinner.show();
    this.accountingService
      .GetMemInformation(
        this.MemberReferancePictureAuthorizationForm.value.MemNo
      )
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          console.log('This is response of x', x);
          this.memInfo = x;
          console.log('This is response of meminfo', this.memInfo);
          if (x[0].Message != null) {
            alert(x[0].Message);
            this.MemberReferancePictureAuthorizationForm.controls[
              'MemNo'
            ].setValue('');
          } else {
            this.accountingService
              .GetMemberImages(
                this.MemberReferancePictureAuthorizationForm.value.MemNo,
                this.memInfo[0].MemType
              )
              .pipe(first())
              .subscribe((x: any) => {
                console.log(x);
                if (x) {
                  if (x.RefMemNo != 0) {
                    console.log(x);
                    this.url = x.ImagePictureRef;
                    this.showUpdate = true;
                    this.MemberReferancePictureAuthorizationForm.controls[
                      'RefMemNo'
                    ].setValue(x.RefMemNo);
                    this.MemberReferancePictureAuthorizationForm.controls[
                      'Relation'
                    ].setValue(x.RefRelation);
                    this.refMemType = x.refMemType;
                    this.refMemInfoGet();
                  } else {
                    this.url = '';
                  }
                } else {
                  this.url = '';
                }
              });
          }
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  refMemInfoGet() {
    this.spinner.show();
    this.accountingService
      .GetMemInformation(
        this.MemberReferancePictureAuthorizationForm.value.RefMemNo
      )
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          console.log('This is response of x', x);
          this.refMemInfo = x;
          console.log('This is response of ref meminfo', this.refMemInfo);
          if (x[0].Message != null) {
            alert(x[0].Message);
            this.MemberReferancePictureAuthorizationForm.controls[
              'RefMemNo'
            ].setValue('');
          } else {
            this.accountingService
              .GetMemberImages(
                this.MemberReferancePictureAuthorizationForm.value.RefMemNo,
                this.refMemInfo[0].MemType
              )
              .pipe(first())
              .subscribe((x: any) => {
                console.log(x);
                if (x && this.url == '') {
                  if (x.ImagePicture != null) {
                    console.log(x);
                    this.url = x.ImagePicture;
                    this.showUpdate = true;
                  } else {
                    this.url = '';
                  }
                }
              });
          }
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }

  submitBtnClick() {
    var fv = this.MemberReferancePictureAuthorizationForm.value;
    if (this.fileToUpload == null) {
      alert('Please select a file first.');
      return;
    } else if (fv.MemNo == '' || fv.RefMemNo == '' || fv.Relation == '') {
      alert('Please input all the required data.');
      return;
    }
    this.MemberReferancePictureAuthorizationForm.value.MemNo = Number(
      this.MemberReferancePictureAuthorizationForm.value.MemNo
    );
    const formData = new FormData();
    formData.append('File', this.fileToUpload);
    formData.append('MemType', this.memInfo[0].MemType);
    formData.append(
      'MemberNo',
      this.MemberReferancePictureAuthorizationForm.value.MemNo
    );
    formData.append(
      'RefMemNo',
      this.MemberReferancePictureAuthorizationForm.value.RefMemNo
    );
    formData.append('RefMemType', this.refMemInfo[0].MemType);
    formData.append(
      'Relation',
      this.MemberReferancePictureAuthorizationForm.value.Relation
    );
    console.log(formData);
    console.log(this.fileToUpload);
    this.accountingService
      .MemberRefPictureSubmitData(formData)
      .pipe(first())
      .subscribe((x: any) => {
        if (x == 1) {
          alert('Image uploaded successfully.');
          this.ngOnInit();
        } else {
          alert("Image didn't upload, something went wrong.");
        }
      });
  }

  updateBtnClick() {
    var fv = this.MemberReferancePictureAuthorizationForm.value;
    if (this.fileToUpload == null) {
      alert('Please select a file first.');
      return;
    } else if (fv.MemNo == '' || fv.RefMemNo == '' || fv.Relation == '') {
      alert('Please input all the required data.');
      return;
    }
    this.MemberReferancePictureAuthorizationForm.value.MemNo = Number(
      this.MemberReferancePictureAuthorizationForm.value.MemNo
    );
    const formData = new FormData();
    formData.append('File', this.fileToUpload);
    formData.append('MemType', this.memInfo[0].MemType);
    formData.append(
      'MemberNo',
      this.MemberReferancePictureAuthorizationForm.value.MemNo
    );
    formData.append(
      'RefMemNo',
      this.MemberReferancePictureAuthorizationForm.value.RefMemNo
    );
    formData.append('RefMemType', this.refMemInfo[0].MemType);
    formData.append(
      'Relation',
      this.MemberReferancePictureAuthorizationForm.value.Relation
    );
    console.log(formData);
    console.log(this.fileToUpload);
    this.accountingService
      .MemberRefPictureUpdateData(formData)
      .pipe(first())
      .subscribe((x: any) => {
        if (x == 1) {
          alert('Image uploaded successfully.');
          this.ngOnInit();
          window.location.reload();
        } else {
          alert("Image didn't upload, something went wrong.");
        }
      });
  }
}
