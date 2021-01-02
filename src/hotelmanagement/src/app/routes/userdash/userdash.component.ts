import { NgForOf } from '@angular/common';
import { getSyntheticPropertyName } from '@angular/compiler/src/render3/util';
import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormControl, Validators, AbstractControl, NgForm} from '@angular/forms';
import {ActivatedRoute, Params, Router } from '@angular/router';
import { UserDashService } from '../userdash/userdash.service'

@Component({
  selector: 'app-userdash',
  templateUrl: './userdash.component.html',
  styleUrls: ['./userdash.component.scss']
})
export class UserdashComponent implements OnInit {
  defaults =
  { 'Properties': 'searchProperties', 'Payment': "paymentInformation", 'Reviews': 'getAverageReviewForProperty', 'Reservations': 'getReservationsForUser'}
  currTab = '';
  showpayment: boolean = false;
  showreservation: boolean = false;
  propertiesResult: any = [];
  cardNum;
  propertyMode = 'searchProperties';

  // Will store selected properties and payment
  selectedPropertyName: string = "";
  selectedRoom: string = "";
  selectedCheckIn: string = "";
  selectedCheckOut: string = "";

  selectedPayment: string = "";


  constructor(public userDashService: UserDashService) {}

  ngOnInit(): void {
    this.userDashService.getPaymentInformation()
    .subscribe((data) => {
      this.cardNum = data;
    });
  }

  selectDates(checkIn: string, checkOut: string) {
    this.selectedCheckIn = checkIn;
    this.selectedCheckOut = checkOut;
  }

  selectProperty(name: string) {
    this.selectedPropertyName = name;
    console.log(this.selectedPropertyName);
  }

  selectPayment(payment: string) {
    this.selectedPayment = payment;
    console.log(this.selectedPayment);
  }

  selectRoom(room: string) {
    this.selectedRoom = room;
    console.log(this.selectedRoom);
  }

  searchProperties(form: NgForm){
    this.userDashService.searchProperties(form.value.check_in, form.value.check_out)
    .subscribe((res) => {
      if (res instanceof Array && res.length === 0) return alert("No results found");
      this.propertiesResult = res;
  })
  }

  searchPropertiesByCity(form: NgForm){
    this.userDashService.searchPropertiesByCity(form.value.check_in, form.value.check_out, form.value.city)
    .subscribe((res) => {
      if (res instanceof Array && res.length === 0) return alert("No results found");
      console.log(res)
      this.propertiesResult = res;
  })
  }

  searchPropertiesByName(form: NgForm){
    this.userDashService.searchPropertiesByName(form.value.check_in, form.value.check_out, form.value.name)
    .subscribe((res) => {
      if (res instanceof Array && res.length === 0) return alert("No results found");
      console.log(res)
      this.propertiesResult = res;
  })
  }

  getRoomsAtProperty(form: NgForm){
    this.userDashService.getRoomsAtProperty(form.value.check_in, form.value.check_out, form.value.name)
    .subscribe((res) => {
      if (res instanceof Array && res.length === 0) return alert("No results found");
      console.log(res)
      this.propertiesResult = res;
  })
  }

  getAverageReviewForProperty(form: NgForm){
    this.userDashService.getAverageReviewForProperty(form.value.property_name)
    .subscribe((res) => {
      if (res instanceof Array && res.length === 0) return alert("No results found");
      console.log(res)
      this.propertiesResult = res;
  })
  }

  addReviewToProperty(form: NgForm){
    this.userDashService.addReviewToProperty(form.value.rating, form.value.property_name)
    .subscribe((res) => {
      alert("Review successfully created")
  })
  }

  getReservationsForUser(form: NgForm){
    this.userDashService.getReservationsForUser()
    .subscribe((res) => {
      if (res instanceof Array && res.length === 0) return alert("No results found");
      console.log(res)
      this.propertiesResult = res;
  })
  }

  createPaymentInformation(form: NgForm){
    this.userDashService.createPaymentInformation(form.value.card_num, form.value.card_type, form.value.cvv, form.value.expiry_month, form.value.expiry_year, form.value.street_address, form.value.unit_number, form.value.country, form.value.postal_code, form.value.city, form.value.province)
    .subscribe((res) => {
      console.log(res)
      alert("New card has been successfully added.")
      this.propertiesResult = res;

      // update ui
      this.cardNum = [{card_num: form.value.card_num}, ...this.cardNum]
  })
  }

  bookReservation(form: NgForm){
    this.userDashService.bookReservation(form.value.check_in, form.value.check_out, form.value.property_name, form.value.room_num, form.value.card_num, '0')
    .subscribe((res) => {
      alert(`You've successfully booked a reservation from ${form.value.check_in} to ${form.value.check_out} at ${form.value.property_name}.`)
      console.log(res)
      this.propertiesResult = res;
  })
}

  clearData(e){
    // console.log(e);
    this.currTab = e.tab.textLabel;
    this.propertyMode = this.defaults[e.tab.textLabel];
    this.propertiesResult = [];
  }

  onChange(e){
    this.propertiesResult = [];
    this.propertyMode = e
  }

}
