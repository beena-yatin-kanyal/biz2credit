import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services';
import { Router } from '@angular/router';
import { AlertService } from 'ngx-alerts';
import { not } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(
    private notifier:AlertService,
    private userService:UserService,
    private router:Router) { }

  ngOnInit() {
  }
  public logout()
  {
    this.notifier.success("You are successfully logged out.");
    this.userService.logout();
    this.router.navigate(['/visitor/login-register']);
  }
}
