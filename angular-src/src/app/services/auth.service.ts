
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken: any;
  user: any;

  constructor(private http: HttpClient) { }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
  registerUser(user) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/register', user);
  }
  storeUserData(token, user) {
    sessionStorage.setItem('id_token', token);
    user.cartList = 'Cart is Empty'
    sessionStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }
  addToCart(product){
    var user = JSON.parse(sessionStorage.getItem("user"))
    delete user.cartList;
    user.cartList = []
    user.cartList.push(product)
    sessionStorage.setItem("user",JSON.stringify(user))
  }
  retriveCart(){
    var user = JSON.parse(sessionStorage.getItem("user"))
    return user.cartList;
  }
  storeProuductData(product){
    sessionStorage.setItem('buy-product',JSON.stringify(product))
  }
  getProductData(){
    return JSON.parse(sessionStorage.getItem("buy-product"))
  }
  logout() {
    this.authToken = null;
    this.user = null;
    sessionStorage.clear();
  }
  sendToken(token: string) {
    sessionStorage.setItem("LoggedInUser", token)
  }
  sendTokenUpdatePassword(token:string){
    sessionStorage.setItem("UpdatePassword",token)
  }

  getToken() {
    return sessionStorage.getItem("user")
  }
  getUpdateToken(){
    return sessionStorage.getItem("UpdatePassword")
  }
  isLoggedIn() {
    return this.getToken() !== null;
  }  
}
