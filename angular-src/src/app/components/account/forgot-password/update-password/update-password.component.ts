import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { RegisterService } from 'src/app/services/register.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { NgFlashMessageService } from 'ng-flash-messages';
import { Router } from '@angular/router';
import { HttpHandlerService } from 'src/app/services/http-handler.service';
export interface Res{
  success:boolean,
  msg:string,
}
@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {
  updatePasswordForm = this.fb.group({
    password:['',Validators.minLength(8)],
    confirmPassword:['',Validators.minLength(8)],
  })
  constructor(
    private fb:FormBuilder,
    private httpHandler:HttpHandlerService,
  ) { }

  ngOnInit() {
  }
  user:{
    userName:String;
    password:Object;
  }
  async onUpdateSubmit(){
    await this.httpHandler.updatePasswordHandler(this.updatePasswordForm);
  }

}
