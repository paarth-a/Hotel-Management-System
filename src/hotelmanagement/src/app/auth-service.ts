import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
  private baseUrl: string = 'http://localhost:3000'
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getIsAuth() {
    if (document.cookie.includes('token')){
      this.isAuthenticated = true;
      this.authStatusListener.next(this.isAuthenticated);
    }
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  login(loginForm) {
    const { useremail, password, type } = loginForm;
    // console.log(useremail, password, type)
    this.http
    .post(`${this.baseUrl}/api/login`, { useremail, password, type }, { withCredentials: true})
    .subscribe(() => {
      // if browser cookies has token
      
      if (document.cookie.includes('token')){
      // console.log(document.cookie);
      
        if(type == 'user'){
          this.isAuthenticated = true;
          this.authStatusListener.next(this.isAuthenticated);
          this.router.navigate(['/user'])

        }
        else {
          this.isAuthenticated = true;
          this.authStatusListener.next(this.isAuthenticated);
          this.router.navigate(['/admin'])
        }
      
      }
    })
  }


  register(registerForm) {
    console.log(registerForm);
    
    const { useremail, pass, first_name, last_name, dob, phone_number, is_user} = registerForm

    
    this.http
    .post(`${this.baseUrl}/api/register`, { registerForm },
    { withCredentials: true})
    .subscribe(() => {
        this.router.navigate(['/login'])
    })
  }

  logout() {
    this.http
    .post(`${this.baseUrl}/api/logout`, {}, { withCredentials: true })
    .subscribe(() => {
      this.router.navigate(['/'])
      this.isAuthenticated = false;
      this.authStatusListener.next(this.isAuthenticated);
    })
  }
}
