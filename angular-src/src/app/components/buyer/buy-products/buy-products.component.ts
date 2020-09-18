import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpHandlerService } from 'src/app/services/http-handler.service';

export interface Res {
  success: boolean;
  msg:string;
}
@Component({
  selector: 'app-buy-products',
  templateUrl: './buy-products.component.html',
  styleUrls: ['./buy-products.component.scss']
})

export class BuyProductsComponent implements OnInit {
  
  orderInfo:{
    doorNo:string;
    street:string;
    district:string;
    state:string;
    product:any;
    variant:String;
    userName:string;
    cartId:any
  }
  isLinear=true;
  product:any
  variantsForm:FormGroup;
  orderForm:FormGroup;
  user:any;
  variants:any
  variant:any;
  constructor(
    private authService:AuthService,
    private fb:FormBuilder,
    private httpHandler:HttpHandlerService
  ) { 
    this.product = this.authService.getProductData()
    this.variants  = this.product.variants;
    this.user = JSON.parse(this.authService.getToken())
  }
  
  ngOnInit(): void {
    console.log('Variants',this.variants) 
    // this.variantsForm = this.fb.group({
    //   variant:['',Validators.required]
    // })
    const address = this.user.address[0]
    this.orderForm = this.fb.group({
      doorNo:[address.doorNo,Validators.required],
      street:[address.street,Validators.required],
      district:[address.district,Validators.required],
      state:[address.state,Validators.required]
    })
  }
  
  onOrderSubmit(){
    this.orderInfo = this.orderForm.value
    this.orderInfo.userName = this.user.username
    this.orderInfo.variant = this.variant
    this.orderInfo.product = this.product.general
    this.orderInfo.cartId = this.product.cartId
    this.httpHandler.orderMobileHttpHandler(this.orderInfo)

  }

}
