import { Component,ElementRef, NgZone, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Result, User, Login, UserService, GeoAddress } from '../../shared';
import { Router } from '@angular/router';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { FormControl, FormGroup } from '@angular/forms';

import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'ngx-alerts';
import { element } from 'protractor';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
 

  @ViewChild("signupForm")
  signupForm:FormGroup;


  @ViewChild("search")
  public searchElementRef: ElementRef;

  subs:Subscription;
  
  //object to store registration form details
  user:User;
   //object to store login form details
   login:Login;
   //variable to store the result of map autocomplete
   place: google.maps.places.PlaceResult

  constructor(
    private userService:UserService, 
    private router: Router,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private spinner:NgxSpinnerService,
    private notifier:AlertService)
     {
    this.user=new User();
    this.login=new Login();
    
   }

   


public ngOnInit()
{
 //load Places Autocomplete
 this.mapsAPILoader.load().then(() => {
  
  let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
    types: [],componentRestrictions: {country: ["in"]}
  });
  
  autocomplete.addListener("place_changed", () => {
    
    this.ngZone.run(() => {
      //get the place result
      let place: google.maps.places.PlaceResult = autocomplete.getPlace();
       this.place=place;
       this.setDetails(this.place);
    });
  });
});


}

public onChange(selectedPlace:string)
{
console.log("changed value is "+selectedPlace);  
if(this.place != null && this.place.formatted_address != selectedPlace)
{
console.log(JSON.stringify(this.place));
this.clearAddress();
}
}

private clearAddress()
{
  this.user.city='';
  this.user.state='';
  this.user.country='';
  this.user.postalCode='';
}


  private setDetails(place: google.maps.places.PlaceResult)
  {
    console.log("selected: "+JSON.stringify(this.place));
      
    //clear text fields
    this.clearAddress();
    this.user.location=place.formatted_address;
    if(place.address_components !=null)
    {
     //set current address 
     place.address_components.forEach((ac:google.maps.GeocoderAddressComponent)=>{
      if(ac.types[0]=="administrative_area_level_2")
        this.user.city = ac.long_name;
      else if(ac.types[0]=="administrative_area_level_1")
        this.user.state = ac.long_name;
      else if  (ac.types[0]=="country")
      this.user.country = ac.long_name;
      else if  (ac.types[0]=="postal_code")
      this.user.postalCode = ac.long_name;

    }); 
  }
  }
  
//method to submit contact us form to the server
public submitRegistrationForm()
{
  if(this.signupForm.valid)
  {    

this.spinner.show(); 
console.log("Submitting registration form...");
  this.subs= this.userService.registerUser(this.user).subscribe(
  (result:Result)=>{
    this.spinner.hide();
    if(result.code  == 100)
    {
    this.notifier.success("OTP is sent to your mobile for verfication.");
    this.resetForm();
    this.router.navigate(['/visitor/login-register/verifyOtp']);
    }
    else if(result.code  == 200)
    this.notifier.danger("Mobile no is invalid, OTP Couldn't be sent for verification.");
    else if(result.code  == 400)
    this.notifier.danger("MailId is already registered.");
    else if(result.code  == 500)
    this.notifier.danger("Mobile is already registered.");
    else
    this.notifier.danger("Sorry we are having some issue on the server, please try again later.");
  });  
  
   }
  else
  {
    console.log('marking the form touched.');
    for(let i in this.signupForm.controls)
    this.signupForm.controls[i].markAsTouched();
    
  } 
}

private resetForm()
{
  this.user=new User();
  for(let i in this.signupForm.controls)
  this.signupForm.controls[i].markAsUntouched();
}

ngOnDestroy()
  {
    if(this.subs !=null)
      this.subs.unsubscribe();
  }



}
