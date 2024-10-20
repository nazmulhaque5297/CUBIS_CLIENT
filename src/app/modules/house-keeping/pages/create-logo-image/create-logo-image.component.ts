import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { HouseKeepingService } from '../../house-keeping.service';

@Component({
  selector: 'app-create-logo-image',
  templateUrl: './create-logo-image.component.html',
  styleUrls: ['./create-logo-image.component.css']
})
export class CreateLogoImageComponent implements OnInit {

  memInfo = [];
  url: any;
  msg = '';
  fileToUpload:any;
  showUpdate: boolean = false;
  fileHere: boolean = false;

  constructor(
    private housekeepingService: HouseKeepingService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.url = '';
    this.msg = '';
    this.showUpdate = false;
    this.fileHere = false;
  }

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
    const formData = new FormData();
    formData.append('File', this.fileToUpload);
    this.housekeepingService.CreateLogoSubmitData(formData).pipe(first()).subscribe((x:any)=>{
      if(x==1){
        alert('Image uploaded successfully.');
        this.ngOnInit();
      }
      else{
        this.toaster.error('Image didn\'t upload, something went wrong.');
      }
    })
  }

  exitPage(){
    this.router.navigate(['housekeeping/']);
  }

}
