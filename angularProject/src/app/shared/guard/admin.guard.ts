import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { UserService } from '../services';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private router: Router,
        private userService:UserService) {}

    canActivate() {
        if (this.userService.currentUser !=null && this.userService.currentUser.admin) 
            return true;
           
        this.router.navigate(['/not-authorized']);
        return false;
    }
}
