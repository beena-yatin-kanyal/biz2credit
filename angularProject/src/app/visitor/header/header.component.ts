import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'visitor-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  currentUrl:string;
  constructor(private router:Router) {
    this.currentUrl="";
   }

  ngOnInit() {

    this.router.events.subscribe(event => {

      if (event instanceof NavigationEnd ) {
        console.log("current url",event.url); // event.url has current url
          this.currentUrl=event.url;
      }
    });
  }

  
}
