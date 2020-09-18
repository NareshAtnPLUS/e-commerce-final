import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { NgFlashMessageService } from 'ng-flash-messages';
import { Router } from '@angular/router';
import { HttpHandlerService } from 'src/app/services/http-handler.service';
export interface Res{
  success:boolean,
  user:string,
  msg:string
}

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit {
  otpForm = this.fb.group({
    otp:['',Validators.minLength(6)],
  })
  otp:{
    otp:String,
    userName:string
  }
  constructor(
    private fb:FormBuilder,
    private httpHandler:HttpHandlerService,
    ) { }

  ngOnInit() {
  }
  async onOtpSubmit(){
    // console.log(this.otp)
    await this.httpHandler.otpHttpHandler(this.otpForm.value);
  }

}
