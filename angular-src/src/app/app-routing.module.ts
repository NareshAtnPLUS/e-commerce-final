import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AccountComponent } from './components/account/account.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './guard/auth.guard';
import { ForgotPasswordComponent } from './components/account/forgot-password/forgot-password.component';
import { RegisterComponent } from './components/account/register/register.component';
import { LoginComponent } from './components/account/login/login.component';
import { OtpComponent } from './components/account/forgot-password/otp/otp.component';
import { UpdatePasswordComponent } from './components/account/forgot-password/update-password/update-password.component';
import { OfferComponent } from './components/offer/offer.component';
import { AdminComponent } from './components/admin/admin.component';
import { SupplierComponent } from './components/supplier/supplier.component';
import { AddProductsComponent } from './components/supplier/add-products/add-products.component';
import { MobileComponent } from './components/supplier/add-products/mobile/mobile.component';
import { BuyProductsComponent } from './components/buyer/buy-products/buy-products.component';
import { CartComponent } from './components/cart/cart.component';
import { SuppProfileComponent } from './components/supp-profile/supp-profile.component';
import { AdminDashComponent } from './components/admin-dash/admin-dash.component';


const routes: Routes = [
  { path:'',component:HomeComponent },
  { path:'admin',component:AdminComponent,canActivate:[AuthGuard] },
  { path:'cart',component:CartComponent,canActivate:[AuthGuard] },
  { path:'buy-product',component:BuyProductsComponent,canActivate:[AuthGuard] },
  { path:'offer-zone',component:OfferComponent },
  { path:'supplier',component:SupplierComponent,canActivate:[AuthGuard],children:[
    { path:'add-products',component:AddProductsComponent,canActivate:[AuthGuard],children:[
      {path:'add-mobile',component:MobileComponent,canActivate:[AuthGuard]}
    ]
    }
    ]
  },
  { path:'account',component:AccountComponent,children:[
    { path:'forgot-password',component:ForgotPasswordComponent,children:[
      { path:'otp',component:OtpComponent },
      { path:'update-password',component:UpdatePasswordComponent }
      ] 
    },
    { path:'register',component:RegisterComponent },
    { path:'login',component:LoginComponent }
    ] 
  },
  { path:'profile',component:ProfileComponent,canActivate:[AuthGuard] },
  { path:"adminDash",component:AdminDashComponent,canActivate:[AuthGuard]},
  {path:'supplierProfile',component:SuppProfileComponent,canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
