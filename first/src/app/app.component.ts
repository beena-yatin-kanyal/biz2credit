import { Component, ViewChild } from '@angular/core';

import {User} from './models';
import { FormGroup } from '@angular/forms';
import { UserService } from './services';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  //model object to receive form data
  user:User;

  //variable to receive the reference of the input form
  @ViewChild("userForm")
  userFrm: FormGroup;

  constructor(private userService:UserService)
  {
    this.user=new User();
  }

  //method to submit the form
  saveForm()
  {
    //check whether the form is valid or not
    if(this.userFrm.invalid)
    {
      //Individual elements need to be marked as touched.
      for(let i in this.userFrm.controls)
      this.userFrm.controls[i].markAsTouched();
    }
    else
    {
    console.log("saving the user...");
    this.userService.saveUser(this.user)
    .subscribe((response)=>{
      console.log(response);
    });
    }
  }
}
