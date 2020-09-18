import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  colorToggle={
    value:'accent'
  }
  backgroundColorToggle ={
    value:'accent'
  }
  navLinks: any[];
  activeLinkIndex = -1; 
  
  constructor(private router:Router) {

  this.navLinks = [
    {
        label: 'Register',
        link: './register',
        index: 0,
        title:"Register to API"
    }, {
        label: 'Login',
        link: './login',
        index: 1,
        title:"Login."
    }, {
        label: 'Forgot Password?',
        link: './forgot-password',
        index: 2,
        title:"Forgot Password?,",
        subtitle:"No worries we'll reset passowrd for you!"
      },
    ];
  }
  ngOnInit():void{
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
    });
  }
  

}
