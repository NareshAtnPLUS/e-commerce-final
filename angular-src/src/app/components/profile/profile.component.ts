import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import {map} from 'rxjs/operators'
interface Profile {
  user: Object;
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileSearchForm = this.fb.group({
    userName:['',Validators.minLength(5)]
  })
  constructor(
    private fb:FormBuilder,
    private http:HttpClient,
    private authService:AuthService,
    ) {  
      this.user = JSON.parse(this.authService.getToken());
    }
  user:any;
  ngOnInit() {
    
  }
  onSubmit(){
    const { userName } = this.profileSearchForm.value
    
  }
  
}


