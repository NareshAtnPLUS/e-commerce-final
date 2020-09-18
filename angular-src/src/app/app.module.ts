import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MainNavComponent } from "./components/main-nav/main-nav.component";
import { LayoutModule } from "@angular/cdk/layout";
import { HomeComponent } from "./components/home/home.component";
import { AccountComponent } from "./components/account/account.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { LoginComponent } from "./components/account/login/login.component";
import { RegisterComponent } from "./components/account/register/register.component";
import { MaterialModule } from "./material/material.module";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RegisterService } from "./services/register.service";
import { NgFlashMessagesModule } from "ng-flash-messages";
import { HttpClientModule } from "@angular/common/http";
import { AuthService } from "./services/auth.service";
import { AuthGuard } from "./guard/auth.guard";
import { ForgotPasswordComponent } from "./components/account/forgot-password/forgot-password.component";
import { OtpComponent } from "./components/account/forgot-password/otp/otp.component";
import { UpdatePasswordComponent } from "./components/account/forgot-password/update-password/update-password.component";
import { OfferComponent } from "./components/offer/offer.component";
import { AdminComponent } from "./components/admin/admin.component";
import { SupplierComponent } from "./components/supplier/supplier.component";
import { AddProductsComponent } from "./components/supplier/add-products/add-products.component";
import { MobileComponent } from "./components/supplier/add-products/mobile/mobile.component";
import { HttpHandlerService } from "./services/http-handler.service";
import { FooterComponent } from "./components/footer/footer.component";
import { BuyProductsComponent } from "./components/buyer/buy-products/buy-products.component";
import { CartComponent } from "./components/cart/cart.component";
import { SuppProfileComponent } from "./components/supp-profile/supp-profile.component";
import { AdminDashComponent } from "./components/admin-dash/admin-dash.component";

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    HomeComponent,
    AccountComponent,
    ProfileComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    OtpComponent,
    UpdatePasswordComponent,
    OfferComponent,
    AdminComponent,
    SupplierComponent,
    AddProductsComponent,
    MobileComponent,
    FooterComponent,
    BuyProductsComponent,
    CartComponent,
    SuppProfileComponent,
    AdminDashComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgFlashMessagesModule.forRoot(),
  ],
  providers: [RegisterService, AuthService, AuthGuard, HttpHandlerService],
  bootstrap: [AppComponent],
})
export class AppModule {}
