import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { HttpHandlerService } from 'src/app/services/http-handler.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  data:any
  cartItems:[]
  constructor(
    private httpHandler:HttpHandlerService,
    private router:Router,
    private authService:AuthService
  ) {
    this.httpHandler.cartItemsHandler().subscribe((data:{items:[]}) => {
      this.data = data
      this.cartItems = data.items
      console.log(this.cartItems.length)
      console.log(this.cartItems)
    })

   }
  cartList:any
  ngOnInit(): void {
    
  }
  onBuySubmit(product){
    console.log(product)
    product.product.cartId = product._id
    console.log(product.product)
    this.authService.storeProuductData(product.product);
    this.router.navigate(['/buy-product'])
  }

}
