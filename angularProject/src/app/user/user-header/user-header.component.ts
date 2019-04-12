import { Component, OnInit } from '@angular/core';
import { UserService, UserProfile} from '../../shared';
import { Router } from '@angular/router';

@Component({
  selector: 'user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent implements OnInit {

    user:UserProfile;

    constructor(private userService:UserService) 
    {
       this.user=this.userService.currentUser;
    }
  
    ngOnInit() {
    }
    
  
}
