import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {Contact,Result, ContactService} from '../../shared';
import { CaptchaComponent } from 'angular-captcha';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup } from '@angular/forms';
import { AlertService } from 'ngx-alerts';
import { Subscription } from 'rxjs';

@Component({
  selector: 'contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit, OnDestroy {

  
  
  @ViewChild("contactForm")
  contactForm:FormGroup;

  subs:Subscription;
 
  //object to store contactUs form details
  contact:Contact;
 
/**
   * BotDetect CAPTCHA component.
   */
  @ViewChild(CaptchaComponent) captchaComponent: CaptchaComponent;

  constructor(
    private contactService:ContactService,
    private spinner:NgxSpinnerService,
    private notifier:AlertService)
   {
    this.contact=new Contact();
    this.contactService=contactService;
   }

  ngOnInit() {
  }

  //method to submit contact us form to the server
  public submitForm()
  {
    if(this.contactForm.invalid)
    {
      console.log('marking the form touched.');
    for(let i in this.contactForm.controls)
    this.contactForm.controls[i].markAsTouched();
      
    }
    else
    {      
  this.spinner.show();  
  //fetching captchaId from the child captcha component  
  this.contact.captchaId=this.captchaComponent.captchaId;  
  
  console.log("Submitting contact us form...");
  this.subs=this.contactService.saveContactUs(this.contact).subscribe(
    (result:Result)=>{
      this.spinner.hide();  
      if(result.code  == 100)
      this.notifier.success("Your query is successfully submitted.");
      else if(result.code  == 200) 
      { 
      this.captchaComponent.reloadImage();  
      this.notifier.danger("Invalid Captcha.");
      }
      else
      this.notifier.danger("Sorry, we are having some issue on the server, try again later."); }); 
  }
  }

ngOnDestroy()
{
  if(this.subs !=null)
     this.subs.unsubscribe();
}
}
