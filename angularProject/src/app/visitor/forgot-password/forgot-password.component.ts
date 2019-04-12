import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'ngx-alerts';
import { Router } from '@angular/router';
import { UserService,Result,Login } from '../../shared';

import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  subs:Subscription;

  @ViewChild("passwordForm")
  passwordForm:FormGroup;
  //object to store login form details
  login:Login;

  constructor(
    private spinner:NgxSpinnerService,
    private notifier:AlertService,
    private userService:UserService,
    private router: Router)
    {
      this.login=new Login();
    }

  ngOnInit() {
    this.login.email=this.userService.mobileOrEmail;
  }

  ngOnDestroy()
  {
    if(this.subs !=null)
    this.subs.unsubscribe();
  }

  public resetPassword()
  {
   if(this.passwordForm.invalid)
   {
    console.log('marking the form touched.');
    for(let i in this.passwordForm.controls)
    this.passwordForm.controls[i].markAsTouched();
   }
   else
   { 
    this.spinner.show();  
  console.log("Sending reset password request...");
    this.subs = this.userService.resetPassword(this.login.email).subscribe(
    (result:Result)=>{
      this.spinner.hide();
      
      if(result.code  == 100)
      {
      this.notifier.success("Your password is sent to your registered mailId.");
      this.router.navigate(['visitor/login']);
      }
      else if(result.code  == 200)
      {
        this.notifier.danger("Given Mailid or Mobile No. is invalid.");
        
      }   
      else
      this.notifier.danger("Sorry we are having some issue on the server, please try again later.");
    }); 
  }
  }



}
