import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { NgFlashMessageService } from 'ng-flash-messages';
import { Router } from '@angular/router';
import { HttpHandlerService } from 'src/app/services/http-handler.service';
export interface Res {
  success: boolean;
  user: Object;
  token:  String;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  accountType:String="User";
  loginForm = this.fb.group({
    userName:['',Validators.required],
    password:['',Validators.minLength(8)],
  })
  constructor(
    private fb:FormBuilder,
    private httpHandler:HttpHandlerService,
    ) { }
  user:{
    userName:string;
    password:string;
    accountType:String;
  };
  async onLoginSubmit(){
    console.log(this.accountType)
    this.user = this.loginForm.value;
    this.user.accountType = this.accountType;
    await this.httpHandler.loginHttpHandler(this.user);
    // console.log(this.user)
  }
}
