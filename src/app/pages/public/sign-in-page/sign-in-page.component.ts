import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-sign-in-page',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.css'],
})
export class SignInPageComponent implements OnInit {
  returnUrl: string;
  greetings: string;
  currentYear: any;

  SignInForm : FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}
  LoginID: string;
  Password: string;
  ngOnInit(): void {
    this.initializeForm();
    this.authenticationService.Logout();
    localStorage.clear();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    var day = new Date();
    var hr = day.getHours();
    if (hr >= 0 && hr < 12) {
      this.greetings = 'Good Morning!';
    } else if (hr == 12) {
      this.greetings = 'Good Noon!';
    } else if (hr >= 12 && hr <= 17) {
      this.greetings = 'Good Afternoon!';
    } else {
      this.greetings = 'Good Evening!';
    }
    const value = new Date().getFullYear();
    this.currentYear = value;
  }

  initializeForm(){
    this.SignInForm = new FormGroup({
      LoginID: new FormControl('', [Validators.required]),
      Password: new FormControl('')
    });
  }


  onEnterUsernameHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`password`).focus();
    //e.preventDefault();
  }

  onEnterPasswordHandler(e: KeyboardEvent){
    if( e.keyCode != 13 ) return;
    document.getElementById(`submit`).focus();
  }
  

  onKeyDownUsername(e: KeyboardEvent){
    return ( 
      (e.keyCode >= 48 && e.keyCode <= 57) 
      || (e.keyCode == 8)
      || (e.keyCode >= 96 && e.keyCode <= 105)
      || (e.keyCode == 9)
      );
  }

  // testButton = (e) => {
  //   console.log("test ran!")
  // }

  submitSignIn = () => {
    this.LoginID = this.SignInForm.value.LoginID;
    this.Password = this.SignInForm.value.Password;

    if (!this.LoginID) {
      this.toastr.info('Username is required field !', 'Warning');
      return;
    }
    if (!this.Password ) {
      //console.log("password is required! " + this.LoginID);
      this.toastr.info('Password is required field !', 'Warning');
      return;
    }
    let data = {
      LoginID: this.LoginID,
      Password: this.Password,
    };
    this.spinner.show();
    this.authenticationService.LoginService(data).subscribe(
      (x: any) => {
        this.spinner.hide();
        if (!x.Success) {
          this.toastr.error(x.Message, 'Warning');
          return;
        }
        this.authenticationService.SetTokenToStorage(x.token);
        this.toastr.success('Authentication Successful !', 'Success');
        this.router.navigate([this.returnUrl]);
      },
      (err) => {
        this.toastr.error('Wrong username or password !', 'Warning');
        this.spinner.hide();
      }
    );
    // this.SignInForm.controls['LoginID'].setValue('');
    // this.SignInForm.controls['Password'].setValue('');
    // this.LoginID = '';
    // this.Password = '';
  };
}
