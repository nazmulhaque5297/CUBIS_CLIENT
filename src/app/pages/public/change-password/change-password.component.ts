import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { JsonResponseModel } from 'src/app/Models/user-manager.model';
import { AuthenticationService } from '../../../services/authentication.service'

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  returnUrl: string;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private authenticationService : AuthenticationService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) { }

    CurrentPassword:string = "";
    NewPassword:string = "";
    ConfirmPassword:string ="";

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit():void{
    let data = {
      CurrentPassword : this.CurrentPassword,
      NewPassword : this.NewPassword,
      ConfirmPassword: this.ConfirmPassword
    }
    this.spinner.show();
    this.authenticationService.ChangePassword(data.CurrentPassword,data.NewPassword,data.ConfirmPassword).subscribe((x: JsonResponseModel)=>{
      if(x.Success){
        this.toastr.success("Password changed successfully !", "Success");
        this.router.navigate([this.returnUrl]);
        // this.router.navigate(["sign-in"]);
      }
      else{
        this.toastr.error(x.Message, "Warning");
      }
     
      this.spinner.hide();
    }, err=>{
      console.log(err);
      this.toastr.error("Wrong username or password !", "Warning");
      this.spinner.hide();
    })
  }

}
