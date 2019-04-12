import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'ngx-alerts';
import { UserService, User, Result, BulkResult, UserProfile } from '../../shared';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {



//object to store form data
users:UserProfile[];




subs: Subscription;

  constructor(private spinner:NgxSpinnerService,
    private notifier:AlertService,
    private UserService:UserService) { 
      this.users=new Array();
    }

  ngOnInit() {
    this.spinner.show();  
    this.UserService.loadUsers().subscribe(
      (result:UserProfile[])=>{
           this.spinner.hide();
            this.users=result;
      });
  }
  ngOnDestroy()
  {
    if (this.subs !=null)
        this.subs.unsubscribe();
  
  }

  public toggleStatus(user : UserProfile)
  {

    this.spinner.show();  
    this.UserService.toggleStatus(user.id).subscribe(
      (result:Result)=>{
           this.spinner.hide();
            user.active = !user.active;
      });
  }
  

}
