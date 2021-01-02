import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators, AbstractControl, NgForm} from '@angular/forms';
import {ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../../auth-service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loggedIn : boolean = false; 
  constructor(private router: Router, private route : ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
  }

  login(form: NgForm) {
    this.authService.login(form.value);
  }
}
