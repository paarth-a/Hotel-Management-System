import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class AdminDashService {
  private baseUrl: string = 'http://localhost:3000'

  constructor(private http: HttpClient, private router: Router) {}

  getAllProperties() {
    return this.http.get(`${this.baseUrl}/api/adminProperties`);
  }

  highestSpenders(n){
      return this.http.get(`${this.baseUrl}/api/highSpender?n=${n}`)
  }

  highestRatedProperty(){
    return this.http.get(`${this.baseUrl}/api/highestRatedProperty`)
}

highestImpactAmenity(){
    return this.http.get(`${this.baseUrl}/api/highestImpactAmenity`)
}

highestEarningProperties(){
    return this.http.get(`${this.baseUrl}/api/highestEarningProperties`)
}

frequentReviewers(){
    return this.http.get(`${this.baseUrl}/api/frequentReviewers`)
}

addNewGuest(first_name, last_name, phone, dob){
    return this.http.post(`${this.baseUrl}/api/guest`, {first_name, last_name, phone, dob}, {"headers": {
        "Content-Type": "application/json"
    }, withCredentials: true });
}

updateGuest(oldGuest, newGuest){
    return this.http.put(`${this.baseUrl}/api/guest`, {oldGuest, newGuest}, {"headers": {
        "Content-Type": "application/json"
    }, withCredentials: true });
}

getGuests(){
    return this.http.get(`${this.baseUrl}/api/guests`, { withCredentials: true} )
}

assignGuest(reservation_id, phone, first_name, last_name, dob){
    return this.http.post(`${this.baseUrl}/api/assignGuest`, {reservation_id, phone, first_name, last_name, dob}, {"headers": {
        "Content-Type": "application/json"
    }, withCredentials: true });
}

getGuestsForReservation(reservation_id){
    return this.http.get(`${this.baseUrl}/api/reservation/guests?reservation_id=${reservation_id}`, {withCredentials: true});
}

getAllReservationsForProperty(property_name){
    return this.http.get(`${this.baseUrl}/api/reservation?property_name=${property_name}`, { withCredentials: true} )
}

deleteAGuest(phone_number, first_name, last_name, dob){
    return this.http.delete
    (`${this.baseUrl}/api/guest?phone_number=${phone_number}&first_name=${first_name}&last_name=${last_name}&dob=${dob}`, { withCredentials: true} )
}

getAllDates(){
    return this.http.get(`${this.baseUrl}/api/date`, { withCredentials: true} )
}

createDatesInRange(start_date, end_date){
    return this.http.post(`${this.baseUrl}/api/dates`, {start_date, end_date}, {"headers": {
        "Content-Type": "application/json"
    }, withCredentials: true });
}

editHoliday(date, isHoliday){


    return this.http.put(`${this.baseUrl}/api/date`, {date, isHoliday}, {"headers": {
        "Content-Type": "application/json"
    }, withCredentials: true });
}

createDatesForRoomType(start_date, end_date, room_type, rate, property_name){
    // Will create room dates for a specific room type at a specific property between two dates
    return this.http.post(`${this.baseUrl}/api/roomDates`, {start_date, end_date, room_type, rate, property_name}, {"headers": {
        "Content-Type": "application/json"
    }, withCredentials: true });
}

updateRoomDate(property_name, room_num, date, rate, reservation_id){
    return this.http.put(`${this.baseUrl}/api/roomDate`, {property_name, room_num, date, rate, reservation_id}, {"headers": {
        "Content-Type": "application/json"
    }, withCredentials: true });
}

getRoomDatesBetweenDates(start_date, end_date, property_name){
    return this.http.get(`${this.baseUrl}/api/roomDates?start_date=${start_date}&end_date=${end_date}&property_name=${property_name}`, { withCredentials: true} )
}

}
