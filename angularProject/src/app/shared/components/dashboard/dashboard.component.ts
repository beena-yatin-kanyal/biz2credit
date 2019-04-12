import { Component, OnInit, NgZone, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { UserProfile, ImageUrl, Login,  Result} from '../../entities';
import { FileUploaderService,UserService } from '../../services';
import { environment } from '../../../../environments/environment';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'ngx-alerts';
import { Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  user:UserProfile;
  subs:Subscription;
  @ViewChild("profileForm")
  profileForm:FormGroup;

  @ViewChild('fileToUpload')
    fileInput: any;
  
  @ViewChild("search")
  public searchElementRef: ElementRef;

  isEditing:boolean =false;
  

  //variable to store the result of map autocomplete
  place: google.maps.places.PlaceResult;

  constructor(private userService: UserService,
    private fileUploader: FileUploaderService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private notifier:AlertService,
    private spinner:NgxSpinnerService) {
    this.user=userService.currentUser;
    
  }

  ngOnInit() {
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

private clearAddress()
  {
    this.user.city='';
    this.user.state='';
    this.user.country='';
    this.user.postalCode='';
  }
  
  
    private setDetails(place: google.maps.places.PlaceResult)
    {
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




  uploadFileChanged(files: FileList)
  {
   let file:File=this.fileInput.nativeElement.files[0];
   
            
    if(file !=null)  
    { 
        console.log("File size is "+file.size);
        let FileSize = file.size / 1024 / 1024; // in MB
        console.log("File size in MB is "+FileSize);
        if (FileSize > 1) 
        {
          this.notifier.danger("Image size must not be less than 1 MB.");
  
        }
        else
        {
          console.log("uploading file..."+file.name);
          this.subs = this.fileUploader.uploadFile(file,this.user.email)
          .subscribe(  (result:ImageUrl) => {
        
          this.user.profileImageUrl=environment.API_URL+result.url;
          console.log(this.user.profileImageUrl);
        });
    }
    }  
  }
  
  public enableEdit()
  {
    this.isEditing=true;
  }
  public updateProfile()
  {
    this.isEditing=false;
    if(this.profileForm.valid)
    {    
  
  this.spinner.show(); 
  console.log("Submitting registration form...");
    this.subs= this.userService.updateProfile(this.user).subscribe(
    (result:Result)=>{
      this.spinner.hide();
      if(result.code  == 100)
      {
      this.notifier.success("Your profile is successfully updated.");
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
      for(let i in this.profileForm.controls)
      this.profileForm.controls[i].markAsTouched();
      
    } 

  }
  
    
  ngOnDestroy()
  {
    if(this.subs !=null)
      this.subs.unsubscribe();
  }
}
