import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'ngx-alerts';
import { Router } from '@angular/router';
import { UserService,Result,Login } from '../../shared';

import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  //object to store login form details
  login:Login;

  @ViewChild("loginForm")
  loginForm:FormGroup;
  
  subs: Subscription;

  constructor(
    private spinner:NgxSpinnerService,
    private notifier:AlertService,
    private userService:UserService,
    private router: Router)
    {
      this.login=new Login();
      
    }
ngOnDestroy()
{
  if (this.subs !=null)
      this.subs.unsubscribe();

}
  
 public forgotLinkClicked()
 {
  this.userService.mobileOrEmail=this.login.email;
 }


public submitLoginForm()
{
if(this.loginForm.invalid)
{

  console.log('marking the form touched.');
    for(let i in this.loginForm.controls)
    this.loginForm.controls[i].markAsTouched();
}
else
{ 
this.spinner.show();  

console.log("Submitting login form...");
this.subs=this.userService.loginUser(this.login).subscribe(
  (result:Result)=>{
    this.spinner.hide();
    
    if(result.code  == 100)
    {
      if(!this.userService.currentUser.active)
      {
        this.userService.logout();
        this.notifier.danger("Your account is inactive, contact site admin to get it activated.");
  
      }
      else if(this.userService.currentUser.admin)
          this.router.navigate(['/admin']);
      else
          this.router.navigate(['/user']);
    }
        
    else if(result.code == 200)
        this.notifier.danger("Either Email or Password is incorrect.");
    else
    this.notifier.danger("Sorry we are having some issue on the server, please try again later.");
  }); 
}
}


  ngOnInit() {
    this.login.email=this.userService.mobileOrEmail;
  }

}
