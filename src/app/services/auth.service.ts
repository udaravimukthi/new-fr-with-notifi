import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import {environment} from '../../environments/environment';

const BASE_URL = environment.backendUrl;

@Injectable()
export class AuthService {
  private authToken: string;
  private user: string;

  private apiUrl: string = `${BASE_URL}/users`;

  constructor(private http: Http) { }

  registerUser(user): any {
    let url: string = this.apiUrl + "/register";

    // prepare the request
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    let reqBody = user;

    // POST
    let observableReq = this.http.post(url, reqBody, options)
                                 .map(this.extractData);

    return observableReq;
  }
  

  authenticateUser(user): any {
    let url: string = this.apiUrl + "/authenticate";

    // prepare the request
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    let reqBody = user;

    // POST
    let observableReq = this.http.post(url, reqBody, options)
                                 .map(this.extractData);

    return observableReq;
  }
// get logged in person details
  getProfile(username): any {
    let url: string = this.apiUrl + "/users/" + username;
    this.loadCredentials();

    // prepare the request
    let headers = new Headers({
      "Content-Type": "application/json",
      "Authorization": this.authToken
    });
    let options = new RequestOptions({ headers: headers });

    // POST
    let observableReq = this.http.get(url, options)
                                 .map(this.extractData);

    return observableReq;
  }



  storeUserData(token, users, email): void {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(users));
    localStorage.setItem("email", email);
    this.authToken = token;
    this.user = users;
    let user = JSON.parse(localStorage.getItem('user'));
    if(user.timeF)
      localStorage.setItem('timeF', user.timeF)
    if(user.timeT)
      localStorage.setItem('timeT', user.timeT)
    if(user.pickupLng)
      localStorage.setItem('pickupLng', user.pickupLng)
    if(user.pickupLat)
      localStorage.setItem('pickupLat', user.pickupLat)
  }

  getUserData(): any {
    this.loadCredentials();
    let jUser = JSON.parse(this.user);
    let jData = {token: this.authToken, user: jUser};

    return jData;
  }

  loadCredentials(): void {
    let token = localStorage.getItem("token");
    let user = localStorage.getItem("user");
    this.authToken = token;
    this.user = user;
  }

  loggedIn(): boolean {
    return tokenNotExpired();
  }

  logout(): void {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  extractData(res: Response): any {
    let body = res.json();
    return body || { };
  }


  //getSugestedProfileDetails
  frienddetails(id, username){
    let url: string = this.apiUrl + '/getSugestedProfileDetails/' + id
    let headers = new Headers({
      "Content-Type": "application/json",
    });
    let options = new RequestOptions({ headers: headers });
    let observableReq = this.http.get(url, options).map((respon , index )=>{
      console.log(respon)
      var datata = this.extractData(respon)
      console.log(datata.username)
    })
  console.log("getSugestedProfileDetails")
  console.log(this.extractData)
  return observableReq;


  }

  getuserdetails():  any {
    let url: string = this.apiUrl + "/userdetails/:id/:username";
    // prepare the request
    let headers = new Headers({
      "Content-Type": "application/json",
      "Authorization": this.authToken
    });
    let options = new RequestOptions({ headers: headers });

    // POST
    let observableReq = this.http.get(url, options)
                                 .map(this.extractData);

    return observableReq;
  }

  
// active account
  active(){
    let email = localStorage.getItem("email");
     console.log(email)
    let url: string = this.apiUrl + '/active/' + email
    this.http.get(url, { } ).subscribe(
        data => {
          console.log(data);
        },
        error => console.log(error)
      );
    
  // console.log("get email")
  // console.log(this.extractData)


  }

}