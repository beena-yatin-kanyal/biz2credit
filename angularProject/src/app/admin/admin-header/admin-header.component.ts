import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
  
})
export class AdminHeaderComponent implements OnInit {

  constructor(private userService:UserService,
  private router:Router) { }

  ngOnInit() {
  }
  public logout()
  {
    console.log("logging out the user...");
    this.userService.currentUser=null;
    this.router.navigate(['loggedOut']);
  }
}
