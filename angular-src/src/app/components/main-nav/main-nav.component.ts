import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NgFlashMessageService } from 'ng-flash-messages';

import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { HttpHandlerService } from 'src/app/services/http-handler.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private flashMessage: NgFlashMessageService,
    private http: HttpClient,
    private httpHandler:HttpHandlerService,
    private authService: AuthService
    ) {
      const observer = {
        next:function(data:{items:[]}){
          this.cartLength = data.items.length
        },
        error:function(err){
          this.cartLength =0;
        }
      }
      const user = JSON.parse(this.authService.getToken())
      if(!user){ 
        this.cartLength = 0
      } else {
        this.httpHandler.cartItemsHandler().subscribe(observer)
        console.log('Cart Length',this.cartLength)
      }
    }
  cartLength:any;
  cart:any;
    onLogoutClick() {
      this.authService.logout();
      this.flashMessage.showFlashMessage({
        messages: ['You Are Now Logged Out'],
        dismissible: true, timeout: 3000, type: 'danger'
        });
        this.router.navigate(['/account/login']);
        return false;
  }
}
