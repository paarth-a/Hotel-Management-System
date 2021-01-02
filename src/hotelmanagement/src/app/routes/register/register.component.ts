import { NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators, AbstractControl, NgForm} from '@angular/forms';
import {ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/auth-service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  constructor(private router : Router, public authService: AuthService) {} 

  ngOnInit(): void {
  }
register(form: NgForm){
  this.authService.register(form.value);
}

isValid(input:any){
  return this.registerForm.get(input).invalid && this.registerForm.get(input).touched;
  
}
}
