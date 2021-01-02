import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class UserDashService {
  private isAuthenticated = false;
  private baseUrl: string = 'http://localhost:3000'
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  searchProperties(check_in, check_out){
      return this.http.get(`${this.baseUrl}/api/searchProperties?check_in=${check_in}&check_out=${check_out}`)
  }

  searchPropertiesByCity(check_in, check_out, city){
    return this.http.get(`${this.baseUrl}/api/searchPropertiesByCity?check_in=${check_in}&check_out=${check_out}&city=${city}`)
}

searchPropertiesByName(check_in, check_out, name){
  return this.http.get(`${this.baseUrl}/api/searchPropertiesByName?check_in=${check_in}&check_out=${check_out}&property_name=${name}`)
}

getRoomsAtProperty(check_in, check_out, name){
  return this.http.get(`${this.baseUrl}/api/roomsAvailable?check_in=${check_in}&check_out=${check_out}&property_name=${name}`)
}

getAverageReviewForProperty(name){
  return this.http.get(`${this.baseUrl}/api/averageReview?property_name=${name}`)
}

addReviewToProperty(rating, property_name){
  return this.http.post(`${this.baseUrl}/api/review`, {rating, property_name}, {withCredentials: true});
}

getReservationsForUser(){
  return this.http.get(`${this.baseUrl}/api/reservationsForUser`,  {withCredentials: true});
}

getPaymentInformation(){
  return this.http.get(`${this.baseUrl}/api/paymentInformation`, { withCredentials: true })
}

createPaymentInformation(card_num, card_type, cvv, expiry_month, expiry_year, street_address, unit_number, country, postal_code, city, province){
  console.log(card_num, card_type, cvv, expiry_month, expiry_year, street_address, unit_number, country, postal_code, city, province)
  return this.http.post(`${this.baseUrl}/api/paymentInformation`, {card_num, card_type, cvv, expiry_month, expiry_year, street_address, unit_number, country, postal_code, city, province}, {withCredentials: true})
}

bookReservation(check_in, check_out, property_name, room_num, card_num, discount){
  return this.http.post(`${this.baseUrl}/api/reservation`, {check_in, check_out, property_name, room_num, card_num, discount}, {withCredentials: true})
}

}
