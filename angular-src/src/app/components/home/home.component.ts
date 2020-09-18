import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpHandlerService } from 'src/app/services/http-handler.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products:any = [];
  constructor(
    private httpHandler:HttpHandlerService,
    private authService:AuthService,
    private router:Router
  ) { 
    this.httpHandler.mobilesHandler().subscribe((data:{}) => {
      this.products = data
      console.log(this.products.mobile[0].variants,this.products.mobile[0]._id)
    })
    this.httpHandler.tasksHandler().subscribe((data:{}) => {
      console.log('tasks',data)
    })
  }
  ngOnInit(): void {
      var observer = {
        next:function(){
          console.log('Added to cart');
        },
        error:function(err){
          console.error(err);          
        },
        complete:function(){
          console.log('Completed');
        }
      };
  }
  onBuySubmit(product){
    console.log(product)
    this.authService.storeProuductData(product);
    this.router.navigate(['/buy-product'])
  }
  addCart(product){
    // this.authService.addToCart(product);
    this.httpHandler.addToCartHandler(product);
    
  }

}
