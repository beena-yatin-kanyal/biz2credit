import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'ngx-alerts';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Result,UserService,Verification } from '../../shared';


@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.css']
})
export class OtpVerificationComponent implements OnInit,OnDestroy {

  @ViewChild("verifyOtpForm")
  verifyOtpForm:FormGroup;
  //object to store otp 
  verification:Verification;
  //object to store the reference of subscription
  subscription:Subscription;
  


  constructor(private spinner:NgxSpinnerService,
    private notifier:AlertService,
    private userService:UserService,
    private router: Router) 
    {
      this.verification=new Verification();
    }

  ngOnInit() {
  }

  ngOnDestroy()
  {
    if(this.subscription !=null)
      this.subscription.unsubscribe();
  }
  //method to reset timer
  otpElapsed(){
    console.log("otp elapsed.");
}



  public verifyOTP()
  {
   if(this.verifyOtpForm.invalid)
   {
    console.log('marking the form touched.');
    for(let i in this.verifyOtpForm.controls)
    this.verifyOtpForm.controls[i].markAsTouched();
   }
   else
   { 
    this.spinner.show();  
  console.log("Sending verify otp request...");
  this.subscription=this.userService.verifyOtp(this.verification.otp).subscribe(
    (result:Result)=>{
      this.spinner.hide();
      
      if(result.code  == 100)
      { 
      this.notifier.success("You are successfully registered.");
      this.router.navigate(['visitor/login']);
       }
      else if(result.code  == 200)
      {
        this.notifier.danger("Invalid OTP, try again.");
        
      }   
      else
      this.notifier.danger("Sorry we are having some issue on the server, please try again later.");
    });  
  }
  }


}
