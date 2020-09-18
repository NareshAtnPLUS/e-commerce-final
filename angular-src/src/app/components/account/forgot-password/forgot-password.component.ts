import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { NgFlashMessageService } from 'ng-flash-messages';
import { Router } from '@angular/router';
import { HttpHandlerService } from 'src/app/services/http-handler.service';
export interface Res{
  success: boolean;
  user: string;
  token:  Object;
}
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  accountType:String="User";
  forgotForm = this.fb.group({
    userName:['',Validators.minLength(4)],
  })
  user:{
    userName:string;
  }
  constructor(
    private fb:FormBuilder,
    private httpHandler:HttpHandlerService,
    ) { }

  
  async onForgotSubmit(){
    await this.httpHandler.forgotPasswordHttpHandler(this.forgotForm.value);
  }

}
