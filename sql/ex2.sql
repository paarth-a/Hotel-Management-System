SET GLOBAL connect_timeout=100;

DROP DATABASE IF EXISTS hotel_management;

CREATE DATABASE hotel_management;
USE hotel_management;

CREATE TABLE ProvinceCountryPostalCode (
    country VARCHAR(50) NOT NULL,
    postal_code VARCHAR(7) NOT NULL,
    province_or_state VARCHAR(50) NOT NULL,
    PRIMARY KEY (country , postal_code),
    CHECK (country = 'canada'
        AND LENGTH(postal_code) = 6
        OR country = 'united states'
        AND LENGTH(postal_code) = 5
        OR country <> 'canada'
        AND country <> 'united states')
);

CREATE TABLE Address (
    street_address VARCHAR(100) NOT NULL,
    unit_number VARCHAR(8) NOT NULL,
    country VARCHAR(50) NOT NULL,
    postal_code VARCHAR(7) NOT NULL,
    city VARCHAR(50) NOT NULL,
    address_type ENUM('billing', 'property', 'staff') NOT NULL,
    PRIMARY KEY (street_address , unit_number , country , postal_code),
    FOREIGN KEY (country , postal_code)
        REFERENCES ProvinceCountryPostalCode (country , postal_code)
);

CREATE TABLE Property (
    property_name VARCHAR(100) NOT NULL PRIMARY KEY,
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    street_address VARCHAR(100) NOT NULL,
    unit_number VARCHAR(8) NOT NULL,
    country VARCHAR(50) NOT NULL,
    postal_code VARCHAR(7) NOT NULL,
    FOREIGN KEY (street_address , unit_number , country , postal_code)
        REFERENCES Address (street_address , unit_number , country , postal_code)
);

CREATE TABLE _User
(
	user_email VARCHAR(100) CHECK(user_email LIKE '%@%.%') NOT NULL PRIMARY KEY,
	pass VARCHAR(50) NOT NULL, 
    first_name VARCHAR(25) NOT NULL,
    last_name VARCHAR (25) NOT NULL,
    phone_number VARCHAR(15) CHECK(LENGTH(phone_number) > 6) NOT NULL, # Shortest phone number is 7 digits
    dob DATE NOT NULL, # Make sure Users are older than 18. Note that guests do not have to have this restriction.
    is_user ENUM('y','n') NOT NULL, # This is for future proofing purposes
    UNIQUE(first_name, last_name, phone_number, dob)
);

CREATE TABLE PaymentInformation (
    card_num VARCHAR(16) NOT NULL PRIMARY KEY,
    card_type ENUM('AMEX', 'VISA', 'MC', 'DISCOVER') NOT NULL,
    cvv VARCHAR(4) NOT NULL,
    expiry_month INT UNSIGNED NOT NULL,
    expiry_year INT UNSIGNED NOT NULL,
    street_address VARCHAR(100) NOT NULL,
    unit_number VARCHAR(8) NOT NULL,
    country VARCHAR(50) NOT NULL,
    postal_code VARCHAR(7) NOT NULL,
    user_email VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_email)
        REFERENCES _USER (user_email)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (street_address , unit_number , country , postal_code)
        REFERENCES Address (street_address , unit_number , country , postal_code),
    CHECK (card_type = 'AMEX'
        AND LENGTH(card_num) = 15
        AND LENGTH(cvv) = 4
        OR card_type <> 'AMEX'
        AND LENGTH(card_num) = 16
        AND LENGTH(cvv) = 3)
);
    
CREATE TABLE Room (
    property_name VARCHAR(100) NOT NULL,
    room_num INT UNSIGNED NOT NULL,
    room_type VARCHAR(20) NOT NULL,
    _description VARCHAR(300) NOT NULL,
    capacity INT UNSIGNED NOT NULL,
    PRIMARY KEY (property_name , room_num),
    FOREIGN KEY (property_name)
        REFERENCES Property (property_name)
        ON DELETE CASCADE ON UPDATE CASCADE
);
    
CREATE TABLE _Date (
    _date DATE NOT NULL,
    isHoliday ENUM('y', 'n') NOT NULL,
    PRIMARY KEY (_date)
);
    
CREATE TABLE Staff (
    employee_num INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    sin CHAR(9) UNIQUE NOT NULL,
    position VARCHAR(20) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    first_name VARCHAR(25) NOT NULL,
    last_name VARCHAR(25) NOT NULL,
    property_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (property_name)
        REFERENCES Property (property_name)
);
    
CREATE TABLE Reservation (
    reservation_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    check_out DATE NOT NULL,
    check_in DATE NOT NULL,
    total_price FLOAT NOT NULL,
    user_email VARCHAR(100) NOT NULL,
    property_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_email)
        REFERENCES _USER (user_email)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (property_name)
        REFERENCES Property (property_name)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CHECK (check_out > check_in)
);

CREATE TABLE Payment (
    transaction_no INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    amount FLOAT UNSIGNED NOT NULL,
    card_num VARCHAR(16) NOT NULL,
    reservation_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (card_num)
        REFERENCES PaymentInformation (card_num)
        ON DELETE CASCADE,
    FOREIGN KEY (reservation_id)
        REFERENCES Reservation (reservation_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Room_Date (
    property_name VARCHAR(100) NOT NULL,
    room_num INT UNSIGNED NOT NULL,
    _date DATE NOT NULL,
    rate FLOAT NOT NULL,
    reservation_id INT UNSIGNED DEFAULT NULL,
    PRIMARY KEY (property_name , room_num , _date),
    FOREIGN KEY (property_name , room_num)
        REFERENCES Room (property_name , room_num)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (_date)
        REFERENCES _Date (_date)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (reservation_id)
        REFERENCES Reservation (reservation_id)
        ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE Guest (
    phone_number VARCHAR(15) NOT NULL,
    first_name VARCHAR(25) NOT NULL,
    last_name VARCHAR(25) NOT NULL,
    dob DATE NOT NULL,
    PRIMARY KEY (phone_number , first_name , last_name , dob)
);
    
CREATE TABLE AdditionalGuests (
    reservation_id INT UNSIGNED NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    first_name VARCHAR(25) NOT NULL,
    last_name VARCHAR(25) NOT NULL,
    dob DATE NOT NULL,
    PRIMARY KEY (reservation_id , phone_number , first_name , last_name , dob),
    FOREIGN KEY (reservation_id)
        REFERENCES Reservation (reservation_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (phone_number , first_name , last_name , dob)
        REFERENCES Guest (phone_number , first_name , last_name , dob)
        ON DELETE CASCADE ON UPDATE CASCADE
);
    
CREATE TABLE PhoneNumberAddress (
    phone_number VARCHAR(15) NOT NULL PRIMARY KEY,
    street_address VARCHAR(100) NOT NULL,
    unit_number VARCHAR(8) NOT NULL,
    country VARCHAR(50) NOT NULL,
    postal_code VARCHAR(7) NOT NULL,
    FOREIGN KEY (street_address , unit_number , country , postal_code)
        REFERENCES Address (street_address , unit_number , country , postal_code)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Amenity (
    amenity_name VARCHAR(30) NOT NULL PRIMARY KEY,
    _description VARCHAR(300) NOT NULL
);
    
CREATE TABLE PropertyAmenity (
    amenity_name VARCHAR(30) NOT NULL,
    property_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (amenity_name , property_name),
    FOREIGN KEY (amenity_name)
        REFERENCES Amenity (amenity_name)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (property_name)
        REFERENCES Property (property_name)
        ON DELETE CASCADE ON UPDATE CASCADE
);
    
CREATE TABLE Review (
    review_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    rating INT UNSIGNED NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    property_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(100),
	CHECK (rating <= 10),
    FOREIGN KEY (user_email)
        REFERENCES _USER (user_email)
        ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (property_name)
        REFERENCES Property (property_name)
        ON DELETE CASCADE ON UPDATE CASCADE
);

# Create trigger for birthdates in User and Guest
delimiter $$
CREATE TRIGGER GuestDOBTrigger
	BEFORE INSERT ON Guest
    FOR EACH ROW
    BEGIN
		IF NEW.dob > CURDATE() THEN
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Guest DOB must be earlier than today';
		END IF;
    END$$

CREATE TRIGGER UserDOBTrigger
	BEFORE INSERT ON _User
	FOR EACH ROW
	BEGIN
		IF DATE_ADD(NEW.dob, INTERVAL 18 YEAR) > CURDATE() THEN
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User must be at least 18 years old';
		END IF;
	END$$
CREATE TRIGGER AssignRoomTrigger
	BEFORE INSERT ON Room_Date
    FOR EACH ROW
    BEGIN
		IF NEW.reservation_id IS NOT NULL 
        AND (NEW._date >= (SELECT check_out FROM Reservation WHERE reservation_id = NEW.reservation_id) 
			OR NEW._date < (SELECT check_in FROM Reservation WHERE reservation_id = NEW.reservation_id)) THEN
				SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Room cannot be assigned to reservation outside of the reservation dates';
        END IF;    
    END$$
CREATE TRIGGER UpdateRoomTrigger
	BEFORE UPDATE ON Room_Date
    FOR EACH ROW
    BEGIN
		IF NEW.reservation_id IS NOT NULL 
        AND NEW._date >= (SELECT check_out FROM Reservation WHERE reservation_id = NEW.reservation_id) THEN
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Room cannot be assigned to reservation later than check out';
        END IF;    
        
        IF NEW.reservation_id IS NOT NULL
        AND NEW._date < (SELECT check_in FROM Reservation WHERE reservation_id = NEW.reservation_id) THEN
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Room cannot be assigned to reservation earlier than check in';
		END IF;
    END$$
delimiter ;

# Show all of the schemas
DESCRIBE ProvinceCountryPostalCode;
DESCRIBE Address;
DESCRIBE Property;
DESCRIBE _User;
DESCRIBE PaymentInformation;
DESCRIBE Payment;
DESCRIBE Room;
DESCRIBE _Date;
DESCRIBE Staff;
DESCRIBE Reservation;
DESCRIBE Room_Date;
DESCRIBE Guest;
DESCRIBE AdditionalGuests;
DESCRIBE PhoneNumberAddress;
DESCRIBE Amenity;
DESCRIBE PropertyAmenity;
DESCRIBE Review;
