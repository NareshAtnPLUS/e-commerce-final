import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RegisterService } from './register.service';
import { NgFlashMessageService } from 'ng-flash-messages';
import { AuthService } from './auth.service';
import { Res as ResLogin } from '../components/account/login/login.component';
import { Res as ResForgotPassword } from '../components/account/forgot-password/forgot-password.component';
import { Res as ResOtp } from '../components/account/forgot-password/otp/otp.component';
import { Res as ResUpdatePassword } from '../components/account/forgot-password/update-password/update-password.component';
import { Res as ResBuyProduct } from '../components/buyer/buy-products/buy-products.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
export interface Products{
  status:true,
  products:any
}
export interface ResCartItems{
  status:true,
  items:[]
}
@Injectable({
  providedIn: 'root'
})
export class HttpHandlerService {
  baseUrl:string = "http://localhost:3000"
  constructor(
    private router:Router,
    private http:HttpClient,
    private registerService:RegisterService,
    private flashMessage:NgFlashMessageService,
    private authService:AuthService,
      
  ) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  openSnackBar(message: string, action: string) {
    this.snackbar.open(message, action, {
      duration: 2000,
    });
  }
  mobilesHandler():Observable<Products>{
    return this.http.get<Products>(`${this.baseUrl}/products/getMobiles`)
      .pipe(retry(2),
      catchError(this.errorHandler)
    )
  }
  tasksHandler():Observable<any>{
    return this.http.get<any>(`http://127.0.0.1:5000/todo/api/v1.0/tasks`)
      .pipe(retry(2),
      catchError(this.errorHandler)
    )
  }
  ordersHandler():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/admin/getUsersOrders`)
    .pipe(
      retry(2),
      catchError(this.errorHandler)
    )
  }
  suppliersHandler():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/admin/getSuppliers`)
    .pipe(
      retry(2),
      catchError(this.errorHandler)
    )
  }
  cartItemsHandler():Observable<ResCartItems>{
    const user = JSON.parse(this.authService.getToken())
    const url = `${this.baseUrl}/user/fetchCart`;
    return this.http.post<ResCartItems>(url,{userName:user.username},this.httpOptions)
      .pipe(retry(2),
      catchError(this.errorHandler))
  }
  errorHandler(error){
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
          // Get server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      console.log(errorMessage);
      return throwError(errorMessage);
  }
  async addMobileHandler(product){
    product.type = "Mobile"
    const user = await JSON.parse(this.authService.getToken())
    console.log(product)
    const sellers = [];
    if(user.userName) {
      sellers.push({userName:user.userName,address:user.address})
    } else{
      sellers.push({userName:user.username,address:user.address})
    }
    product.sellers = sellers;
    console.log(product)
    const req = this.http.post<ResOtp>(`${this.baseUrl}/supplier/add-product`, product,this.httpOptions).subscribe(
      res => {
        console.log(res);// suplier address nad name
        if (res.success) {
          const msg = 'Product successfully added!';
          this.openSnackBar(msg,"Success!");
          this.flashMessage.showFlashMessage({
          messages: [],
          dismissible: true, timeout: 3000, type: 'success'
          });
        this.router.navigate(['/profile']);
        // console.log(res.msg, res.user);
        } else {
          
          this.flashMessage.showFlashMessage({
            messages: ['Invalid Details entered to the server'],
          dismissible: true, timeout: 5000, type: 'danger'
          });
          this.router.navigate(['/supplier/add-products']);
        }
      },
      err => {
        // console.log('Error Occured');
        this.flashMessage.showFlashMessage({
          messages: ['Something Went Wrong'],
          dismissible: true, timeout: 3000, type: 'danger'
          });
        this.router.navigate(['/supplier/add-products/add-mobile']);
     });    
  }

  updatePasswordHandler(updatePasswordForm){
    if(this.registerService.validateUpdatePassword(updatePasswordForm.value)){
      // console.log(this.updatePasswordForm.value);
      
      //this.user.password = this.updatePasswordForm.value;
      const user = {
        userName: this.authService.getUpdateToken(),
        password:updatePasswordForm.value,
      }
      // console.log(this.user)
      const req = this.http.post<ResUpdatePassword>(`${this.baseUrl}/user/update-password`, user,this.httpOptions).subscribe(
      res => {
        if (res.success) {
          this.flashMessage.showFlashMessage({
          messages: [res.msg],
          dismissible: true, timeout: 3000, type: 'success'
          });
        this.router.navigate(['/account/login']);
        } else {
          this.flashMessage.showFlashMessage({
            messages: [res.msg],
          dismissible: true, timeout: 5000, type: 'danger'
          });
          this.router.navigate(['/account/forgot-password/update-password']);
        }
      },
      err => {

        this.flashMessage.showFlashMessage({
          messages: ['Something Went Wrong'],
          dismissible: true, timeout: 3000, type: 'danger'
          });
        this.router.navigate(['/account/register']);
     });
      
    }
  }
  otpHttpHandler(otp){
    const req = this.http.post<ResOtp>(`${this.baseUrl}/user/verify-otp`, otp,this.httpOptions).subscribe(
      res => {
        // console.log(res);
        if (res.success) {
          this.authService.storeUserData(res.msg, res.user);
          this.flashMessage.showFlashMessage({
          messages: ['OTP verification sucessfull!'],
          dismissible: true, timeout: 3000, type: 'success'
          });
        this.router.navigate(['/account/forgot-password/update-password']);
        // console.log(res.msg, res.user);
        } else {
          this.flashMessage.showFlashMessage({
            messages: ['Username does not exists!,Please register yourself as a valid User'],
          dismissible: true, timeout: 5000, type: 'danger'
          });
          this.router.navigate(['/account/register']);
        }
      },
      err => {
        // console.log('Error Occured');
        this.flashMessage.showFlashMessage({
          messages: ['Something Went Wrong'],
          dismissible: true, timeout: 3000, type: 'danger'
          });
        this.router.navigate(['/account/register']);
     });
  }
  forgotPasswordHttpHandler(user){
    const req = this.http.post<ResForgotPassword>(`${this.baseUrl}/user/request-otp`, user,this.httpOptions).subscribe(
      res => {
        // console.log(res.success);
        if (res.success) {
          this.authService.sendTokenUpdatePassword(res.user);
          this.flashMessage.showFlashMessage({
          messages: ['Username exists enter OTP!'],
          dismissible: true, timeout: 3000, type: 'success'
          });
        this.router.navigate(['/account/forgot-password/otp']);
        // console.log(res.token, res.user);
        } else {
          this.flashMessage.showFlashMessage({
            messages: ['Username does not exists!,Please register yourself as a valid User'],
          dismissible: true, timeout: 5000, type: 'danger'
          });
          this.router.navigate(['/account/register']);
        }
      },
      err => {
        // console.log('Error Occured');
        this.flashMessage.showFlashMessage({
          messages: ['Something Went Wrong'],
          dismissible: true, timeout: 3000, type: 'danger'
          });
        this.router.navigate(['/account/register']);
     });
  }
  loginHttpHandler(user){
    
    const url = `${this.baseUrl}/${user.accountType.toLowerCase()}/authenticate`;
    const req = this.http.post<ResLogin>(url, user,this.httpOptions).subscribe(
      res => {
        // console.log(res.success,res.msg);
        if (res.success) {
          console.log(res);
          this.authService.storeUserData(res.token, res.user);
          const msg = 'You Are Now Logged In';
          const value="Success!";
          this.openSnackBar(msg,value);
          this.flashMessage.showFlashMessage({
          messages: [],
          dismissible: true, timeout: 3000, type: 'success'
          });
          if(user.accountType === 'User') this.router.navigate(['/profile']);
          else if(user.accountType === 'Admin') this.router.navigate(['/adminDash']);
          else if(user.accountType === 'Supplier') this.router.navigate(['/supplierProfile']);
        //console.log(res.msg, res.user);
        } else {
          this.flashMessage.showFlashMessage({
            messages: ['Check Login Credentials,User Name or password mismatch'],
          dismissible: true, timeout: 5000, type: 'danger'
          });
          this.router.navigate(['/account/login']);
        }
      },
      err => {
        // console.log('Error Occured');
        this.flashMessage.showFlashMessage({
          messages: ['Something Went Wrong'],
          dismissible: true, timeout: 3000, type: 'danger'
          });
        this.router.navigate(['/account/login']);
     });
  }
  orderMobileHttpHandler(order){
    console.log("order",order)
    if(order.variant === undefined){
      this.openSnackBar("Please Select a Variant","Error")
      return false
    }
    const url = `${this.baseUrl}/products/orderMobile`;
    console.log(order)
    const req = this.http.post<ResBuyProduct>( url, order,this.httpOptions).subscribe(
      res => {
        // console.log(res);
        if (res.success){
          const msg = 'Your order placed Sucessfully'
          const value = "Success"
          this.openSnackBar(msg,value)
          this.flashMessage.showFlashMessage({
            messages: [msg],
            dismissible: true, timeout: 3000, type: 'success'
            });
          this.router.navigate(['/']);
        }
      },
      err => {
        console.log('Error Occured');
        this.flashMessage.showFlashMessage({
          messages: ['Something Went Wrong'],
          dismissible: true, timeout: 3000, type: 'danger'
          });
        this.router.navigate(['/']);
      });
  }
  
  addToCartHandler(product){
    const user = JSON.parse(this.authService.getToken())
  
    const cartObject = {
      userName: user.username,
      product
    }
    console.log(cartObject)
    const url = `${this.baseUrl}/user/addToCart`;
    const req = this.http.post(url,cartObject,this.httpOptions).subscribe(
      res => {
        console.log(res)
        const msg = "Added to cart Sucessfully"
        const value = "Success";
        this.openSnackBar(msg,value)
        this.flashMessage.showFlashMessage({
          messages: [msg],
          dismissible: true, timeout: 3000, type: 'success'
        });
      },
      err=>{
        console.log('Error Occured');
        this.flashMessage.showFlashMessage({
          messages: ['Something Went Wrong'],
          dismissible: true, timeout: 3000, type: 'danger'
        });
      }
    )
  }
  registerHttpHandler(user,accountType,profileForm){
    if(!this.registerService.validateEmail(user.email)){
      this.flashMessage.showFlashMessage({
        messages:['Please Use Valid Email'],
        dismissible: true, timeout: 5000, type: 'danger'
      })
      return false
    }
    if(!(this.registerService.validateUpdatePassword(profileForm.value))){
      this.flashMessage.showFlashMessage({
        messages:['Passwords mismatch!,ReEnter with care'],
        dismissible: true, timeout: 3000, type: 'danger'
      })
      return false      
    }
    console.log(accountType);
    
    const url = `${this.baseUrl}/${accountType.toLowerCase()}/register`
    const req = this.http.post( url, user,this.httpOptions).subscribe(
      res => {
        // console.log(res);
        const msg = 'You Are Now Registered and can Login'
        const value = "Success"
        this.openSnackBar(msg,value)
        this.flashMessage.showFlashMessage({
          messages: [msg],
          dismissible: true, timeout: 3000, type: 'success'
          });
        this.router.navigate(['/account/login']);
      },
      err => {
        console.log('Error Occured');
        this.flashMessage.showFlashMessage({
          messages: ['Something Went Wrong'],
          dismissible: true, timeout: 3000, type: 'danger'
          });
        this.router.navigate(['/']);
      });
  }

}
