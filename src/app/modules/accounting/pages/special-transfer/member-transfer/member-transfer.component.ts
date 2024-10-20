import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { MemberTransferService } from '../../../services/member-transfer.service';

@Component({
  selector: 'app-member-transfer',
  templateUrl: './member-transfer.component.html',
  styleUrls: ['./member-transfer.component.css']
})
export class MemberTransferComponent implements OnInit {

  memberTransferForm: FormGroup;
  toMemTitle: string;
  btnProcess: boolean = false;
  transferMode: string;
  memberNo: number;
  constructor(
    private memberTransferService: MemberTransferService,
    private toaster: ToastrService,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.btnProcess = false;
    this.transferMode = '';
  }

  initializeForm(){
    this.memberTransferForm = new FormGroup({
      MemberNo: new FormControl(""),
    });
  }

  btnSearchClick(){
    if(this.memberTransferForm.value.MemberNo==''){
      alert('Please Enter the Member No.'); return;
    }
    this.memberTransferService.MemberNoChange(this.memberTransferForm.value.MemberNo).pipe(first()).subscribe((x:any)=>{
      if(!x.Success){
        alert(x.Message);
        this.memberTransferForm.controls['MemberNo'].setValue('');
        return;
      }
      this.toMemTitle = x.ToMemTitle;
      this.btnProcess = true;
      this.transferMode = x.TransferModeText;
      this.memberNo = this.memberTransferForm.value.MemberNo;
      this.memberTransferForm.controls['MemberNo'].disable();
    })
  }

  btnTransferClick(){
    if(this.memberTransferForm.value.MemberNo=''){
      alert('Please Enter the Member No.'); return;
    }
    this.memberTransferService.MemberTransferProcess(this.memberNo, this.toMemTitle).pipe(first()).subscribe((x:any)=>{
      if(!x.Success){
        alert(x.Message);
        this.memberTransferForm.controls['MemberNo'].setValue('');
        return;
      }
      alert(x.Message);
    })
  }
}
