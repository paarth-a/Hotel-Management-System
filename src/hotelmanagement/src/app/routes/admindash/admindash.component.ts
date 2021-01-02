import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AdminDashService } from './admindash.service';
import {Guest} from "../../Guest";

@Component({
  selector: 'app-admindash',
  templateUrl: './admindash.component.html',
  styleUrls: ['./admindash.component.scss']
})
export class AdmindashComponent implements OnInit {
  // default views on mat tab change
  defaults = { 'Property': 'getAllProperties', 'Reviews': 'frequentReviewers', 'Guest': 'addNewGuest', 'Reservation': 'assignGuest', 'Dates' : 'getAllDates', 'Rooms': 'getRoomBetweenDates'}
  results: any = [];
  cardNum;
  mode = '';

  selectedReservation = "";
  selectedDate = "";
  selectedRoom = "";
  selectedProperty = "";
  selectedGuest: Guest = new Guest();

  constructor(private adminDashService: AdminDashService) { }

  ngOnInit(): void {
    this.mode = this.defaults['Property'];
  }

  selectProperty(name: string) {
    this.selectedProperty = name;
  }

  selectReservation(id: string) {
    this.selectedReservation = id;
  }

  selectDate(date: string){
    this.selectedDate = date;
  }

  selectRoom(room: string) {
    this.selectedRoom = room;
  }

  selectGuest(firstName: string, lastName: string, phone: string, dob: string) {
    this.selectedGuest.first_name = firstName;
    this.selectedGuest.last_name = lastName;
    this.selectedGuest.phone = phone;
    this.selectedGuest.dob = dob;
  }

  clearData(e){
    this.mode = this.defaults[e.tab.textLabel];
    this.results = [];
  }

  onChange(e){
    this.results = [];
    this.mode = e;
  }

  getProperties() {
    this.adminDashService.getAllProperties()
      .subscribe((data) => {
        if (data instanceof Array && data.length === 0) return alert("No results found");

        this.results = data;
      });
  }

  highestSpenders(form: NgForm){
    this.adminDashService.highestSpenders(form.value.n)
    .subscribe((data) => {
      if (data instanceof Array && data.length === 0) return alert("No results found");
      console.log(data);
      this.results = data;
    })
  }


  highestRatedProperty(form: NgForm){
    this.adminDashService.highestRatedProperty()
    .subscribe((data) => {
      if (data instanceof Array && data.length === 0) return alert("No results found");
      console.log(data);
      this.results = data;
    })
  }

  highestImpactAmenity(form: NgForm){
    this.adminDashService.highestImpactAmenity()
    .subscribe((data) => {
      if (data instanceof Array && data.length === 0) return alert("No results found");
      console.log(data);
      this.results = data;
    })
  }

  highestEarningProperties(form: NgForm){
    this.adminDashService.highestEarningProperties()
    .subscribe((data) => {
      if (data instanceof Array && data.length === 0) return alert("No results found");
      console.log(data);
      this.results = data;
    })
  }

  frequentReviewers(form: NgForm){
    this.adminDashService.frequentReviewers()
    .subscribe((data) => {
      if (data instanceof Array && data.length === 0) return alert("No results found");
      console.log(data);
      this.results = data;
    })
  }

  addNewGuest(form: NgForm){
    this.adminDashService.addNewGuest
    (form.value.first_name, form.value.last_name, form.value.phone, form.value.dob)
    .subscribe((data) => {
      console.log(data);
      this.results = data;
    })
  }

  updateGuest(form: NgForm){
    const {old_first_name, old_last_name, old_phone, old_dob, new_first_name, new_last_name, new_phone, new_dob} = form.value;
    var oldGuest = {first_name: old_first_name, last_name: old_last_name, phone: old_phone, dob: old_dob};
    var newGuest = {first_name: new_first_name, last_name: new_last_name, phone: new_phone, dob: new_dob};
    this.adminDashService.updateGuest
    (oldGuest, newGuest)
    .subscribe((data) => {
      alert(`${old_first_name} ${old_last_name} (Guest) has successfully been updated`);
      this.selectedGuest.first_name = newGuest.first_name;
      this.selectedGuest.last_name = newGuest.last_name;
      this.selectedGuest.phone = newGuest.phone;
      this.selectedGuest.dob = newGuest.dob;
      this.results = data;
    })
  }

  getGuests(){
    this.adminDashService.getGuests()
    .subscribe((data) => {
      if (data instanceof Array && data.length === 0) return alert("No results found");
      console.log(data);
      this.results = data;
    })
  }

  assignGuest(form: NgForm){
    this.adminDashService.assignGuest
    (form.value.reservation_id, form.value.phone, form.value.first_name, form.value.last_name, form.value.dob)
    .subscribe((data) => {
      alert(`Assigned ${form.value.first_name} ${form.value.last_name} (Guest) to reservation ${form.value.reservation_id}`);
      this.results = data;
    })
  }

  getGuestsForReservation(reservation_id){
    this.adminDashService.getGuestsForReservation(reservation_id)
    .subscribe((data) => {
      if (data instanceof Array && data.length === 0) return alert("No results found");
      console.log(data);
      this.results = data;
    })
  }

  getAllReservationsForProperty(property_name){
    this.adminDashService.getAllReservationsForProperty(property_name)
    .subscribe((data) => {
      if (data instanceof Array && data.length === 0) return alert("No results found");
      console.log(data);
      this.results = data;
    })
  }

  deleteAGuest(form: NgForm){
    this.adminDashService.deleteAGuest
    (form.value.phone_number, form.value.first_name, form.value.last_name, form.value.dob)
    .subscribe((data) => {
      if (data){
        this.selectedGuest = new Guest();
        alert(`Guest ${form.value.first_name} ${form.value.last_name} deleted!`);
      }
    })
  }

  getAllDates(){
    this.adminDashService.getAllDates()
    .subscribe((data) => {
      if (data instanceof Array && data.length === 0) return alert("No results found");
      console.log(data);
      this.results = data;
    })
  }


  createDatesInRange(form : NgForm){
  return this.adminDashService.createDatesInRange(form.value.start_date, form.value.end_date)
  .subscribe((data) => {
    if (data){
      alert(`Dates Created from: ${form.value.start_date} to:  ${form.value.end_date}`);
    }
  })
  }

  editHoliday(form : NgForm){
    return this.adminDashService.editHoliday(form.value.date, form.value.is_Holiday)
    .subscribe((data) => {
      if (data){
        alert(`Changed Date ${form.value.date} to Is Holiday  ${form.value.is_Holiday}`);
      }
    })
}

createDatesForRoomType(form : NgForm){
  console.log(form.value);

  return this.adminDashService.createDatesForRoomType(form.value.start_date, form.value.end_date, form.value.room_type, form.value.rate, form.value.property_name)
  .subscribe((data) => {
    if (data){
      alert(`Dates for room ${form.value.room_type} at ${form.value.property_name} added`)
    }
  })
  }

  updateRoomDate(form : NgForm){
    return this.adminDashService.updateRoomDate(form.value.property_name, form.value.room_num, form.value.date, form.value.rate, form.value.reservation_id)
    .subscribe((data) => {
     if (data){
       this.selectedDate = form.value.date;
       this.selectedRoom = form.value.room_num;
       alert(`Room Date updated`);
     }
    })
  }

  getRoomDatesBetweenDates(form: NgForm){
    return this.adminDashService.getRoomDatesBetweenDates(form.value.start_date, form.value.end_date,  form.value.property_name)
    .subscribe((data) => {
      if (data instanceof Array && data.length === 0) return alert("No results found");
      console.log(data);
      this.results = data;
    })
}

}
