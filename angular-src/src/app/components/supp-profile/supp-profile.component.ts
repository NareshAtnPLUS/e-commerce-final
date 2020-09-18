import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-supp-profile',
  templateUrl: './supp-profile.component.html',
  styleUrls: ['./supp-profile.component.scss']
})
export class SuppProfileComponent implements OnInit {

  constructor(
    private authService:AuthService
  ) {
    this.user = JSON.parse(this.authService.getToken());
  }
  user:any;
  ngOnInit(): void {
    console.log(this.user)
  }

}
