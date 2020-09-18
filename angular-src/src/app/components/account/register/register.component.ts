import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RegisterService } from 'src/app/services/register.service';
import { NgFlashMessageService } from 'ng-flash-messages';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { fromEvent } from 'rxjs';
import { map,debounceTime, distinctUntilChanged } from 'rxjs/operators'
import  axios  from 'axios';
import { HttpHandlerService } from 'src/app/services/http-handler.service';
let username;
export interface State{
  value:string;
  viewValue:string;
}
export interface Country{
  value:string;
  viewValue:string;
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements AfterViewInit {
  profileForm = this.fb.group({
    firstName:['',Validators.minLength(4)],
    lastName:['',Validators.minLength(5)],
    userName:['',Validators.minLength(8)],
    email:['',Validators.required],
    password:['',Validators.minLength(8)],
    confirmPassword:['',Validators.minLength(8)],
    address:this.fb.group({
      doorNo:['',Validators.required],
      street:['',Validators.required],
      district:['',Validators.required],
      state:['',Validators.required]
    })
  })
  accountType:String = "User";
  user:{
    firstName:string;
    lastName:string;
    email:string;
    userName:string;
    password:string;
    accountType:String;
  };
  state:State[]=[
    {value:'chennai',viewValue:'Chennai'},
    {value:'kanchipuram',viewValue:'Kanchipuram'},
    {value:'coimbatore',viewValue:'Coimbatore'},
    {value:'vijayawada',viewValue:'Vijayawada'},
    {value:'calicut',viewValue:'Calicut'},
    {value:'mysore',viewValue:'Mysore'},
    {value:'bangalore',viewValue:'Bangalore'},
  ];
  country:Country[]=[
    {value:'tamilnadu',viewValue:'TamilNadu'},
    {value:'kerala',viewValue:'Kerala'},
    {value:'karnataka',viewValue:'Karnataka'},
    {value:'andhrapradesh',viewValue:'AndhraPradesh'},
  ];
  textFeildObservable$:any;
  constructor(
    private fb:FormBuilder,
    private flashMessage:NgFlashMessageService,
    private httpHandler:HttpHandlerService
    ) { 
      this.observer = {
        next:async function(data:string){
          console.log(data)
          
          const res = await axios.post('http://localhost:3000/user/check_username',{username:data});
            
          console.log(res.data)
          if(res.data.success){
            username =  true;
          } else{
            username =  false;
          }
          
        },
        error:function(err){
          console.error(err);
        },
        complete:function(){
          console.log('Completed');
        }
      }
    }
    observer:any
    
   

    ngAfterViewInit() {
      const textFeild = document.getElementById('userName')
      this.textFeildObservable$ = fromEvent(textFeild, 'input');
      this.textFeildObservable$.pipe(map((event:any) => event.target.value+`-${this.accountType}`),debounceTime(1000),distinctUntilChanged())
      .subscribe(this.observer)
    }
  
  async onRegisterSubmit(){
    this.user = this.profileForm.value;
    this.user.accountType = this.accountType;
    if(!username){
      this.flashMessage.showFlashMessage({
        messages:['Username is already taken'],
        dismissible: true, timeout: 5000, type: 'danger'
      })
      return false;
    }
    await this.httpHandler.registerHttpHandler(this.user,this.accountType,this.profileForm);
    
  }

}