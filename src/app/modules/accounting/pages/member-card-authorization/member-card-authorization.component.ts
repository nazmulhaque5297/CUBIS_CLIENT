import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { AccountingService } from '../../services/accounting.service';

@Component({
  selector: 'app-member-card-authorization',
  templateUrl: './member-card-authorization.component.html',
  styleUrls: ['./member-card-authorization.component.css'],
})
export class MemberCardAuthorizationComponent implements OnInit {
  MemberCardForm: FormGroup;
  memInfo = [];
  url: any;
  msg = '';
  fileToUpload:any;
  showUpdate: boolean = false;
  fileHere: boolean = false;
  constructor(
    private accountingService: AccountingService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.url = '';
    this.memInfo = [];
    this.msg = '';
    this.showUpdate = false;
    this.fileHere = false;
  }
  private initializeForm() {

    this.MemberCardForm = new FormGroup({
      MemNo: new FormControl(''),
      FolderPath: new FormControl(''),
    });
    this.pageLoad();
  }

  pageLoad(){
    this.accountingService.PictureCardPageLoad().pipe(first()).subscribe((x:any)=>{
      console.log(x);
      this.MemberCardForm.controls['FolderPath'].setValue(x.data);
    })
  }

  // Get Member Info
  GetMemInformation = () => {
    this.spinner.show();
    this.accountingService
      .GetMemInformation(this.MemberCardForm.value.MemNo)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          console.log('This is response of x', x);
          this.memInfo = x;
          console.log('This is response of meminfo', this.memInfo);
          if (x[0].Message != null) {
            alert(x[0].Message);
            this.MemberCardForm.controls['MemNo'].setValue('');
          }
          else{
            this.accountingService.GetMemberImages(this.MemberCardForm.value.MemNo,this.memInfo[0].MemType).pipe(first()).subscribe((x:any)=>{
              console.log(x);
              if(x){
                if(x.ImageCard!=null){
                  console.log(x);
                  this.url = x.ImageCard;
                  this.showUpdate = true;
                }
                else{
                  this.url = '';
                }
              }
              else{
                this.url = '';
              }
            })
          }
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  selectFile(event: any) {
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      this.msg = 'You must select an image';
      alert(this.msg)
      return;
    }
    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.msg = 'Only images are supported';
      alert(this.msg)
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

  submitBtnClick(){
    let data = {
      File: this.fileToUpload,
      MemType: this.memInfo[0].MemType,
      MemberNo: this.MemberCardForm.value.MemNo
    }
    this.MemberCardForm.value.MemNo = Number(this.MemberCardForm.value.MemNo);
    const formData = new FormData();
    formData.append('File', this.fileToUpload);
    formData.append('MemType', this.memInfo[0].MemType);
    formData.append('MemberNo', this.MemberCardForm.value.MemNo);
    console.log(formData);
    console.log(this.fileToUpload);
    this.accountingService.PictureCardSubmitData(formData).pipe(first()).subscribe((x:any)=>{
      if(x==1){
        alert('Image uploaded successfully.');
        this.ngOnInit();
      }
      else{
        alert('Image didn\'t upload, something went wrong.');
      }
    })
  }

  updateBtnClick(){
    let data = {
      File: this.fileToUpload,
      MemType: this.memInfo[0].MemType,
      MemberNo: this.MemberCardForm.value.MemNo
    }
    this.MemberCardForm.value.MemNo = Number(this.MemberCardForm.value.MemNo);
    const formData = new FormData();
    formData.append('File', this.fileToUpload);
    formData.append('MemType', this.memInfo[0].MemType);
    formData.append('MemberNo', this.MemberCardForm.value.MemNo);
    console.log(formData);
    console.log(this.fileToUpload);
    this.accountingService.PictureCardUpdateData(formData).pipe(first()).subscribe((x:any)=>{
      if(x==1){
        alert('Image uploaded successfully.');
        this.ngOnInit();
        window.location.reload();
      }
      else{
        alert('Image didn\'t upload, something went wrong.');
      }
    })
  }
}
