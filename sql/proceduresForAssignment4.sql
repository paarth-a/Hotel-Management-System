USE hotel_management;

# Stored Procedures for Assignment 4
# Will book a reservation. Note that the payment information already needs to be in the system for this to work. 
# To add a payment information, see above query. 
# You may leave discount as null
DELIMITER $$
CREATE PROCEDURE bookReservation(checkIn DATE, checkOut DATE, propertyName VARCHAR(100), roomNum INT UNSIGNED, cardNum VARCHAR(16), emailAddress VARCHAR(100), discount FLOAT)
BEGIN
	DECLARE price FLOAT; 
    DECLARE reservationId INT UNSIGNED;
    DECLARE roomCount INT;
    
    # Get the details of the rooms available    
    SET price = 
		(SELECT CAST(SUM(rate) as FLOAT)
		FROM Room_Date rd
		WHERE rd._date BETWEEN checkIn AND DATE_SUB(checkOut, INTERVAL 1 DAY) AND rd.reservation_id IS NULL AND rd.property_name = propertyName AND rd.room_num = roomNum
		HAVING COUNT(*) = DATEDIFF(checkOut, checkIn));
    
    SET roomCount = 
		(SELECT COUNT(*)
		FROM Room_Date rd
		WHERE rd._date BETWEEN checkIn AND DATE_SUB(checkOut, INTERVAL 1 DAY) AND rd.reservation_id IS NULL AND rd.property_name = propertyName AND rd.room_num = roomNum
		HAVING COUNT(*) = DATEDIFF(checkOut, checkIn));
	
    IF roomCount = 0 OR NOT EXISTS (SELECT * FROM PaymentInformation WHERE card_num = cardNum AND user_email = emailAddress)
    THEN
        SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'Bad Request';
    ELSE       
        # If there is a discount, add it on
		IF discount IS NOT NULL AND discount < CAST(price AS FLOAT)
		THEN
			SET price = price - discount;
        END IF;
        
		IF price < 0
		THEN
			SET price = 0;
		END IF;
        
        # Make the reservation
        INSERT INTO Reservation (check_out, check_in, total_price, user_email, property_name)
        VALUES
        (
			checkOut,
            checkIn,
            price,
            emailAddress,
            propertyName
        );
		SET reservationId = LAST_INSERT_ID();

        # Block off the rooms
        UPDATE Room_Date
        SET reservation_id = reservationId
        WHERE _date BETWEEN checkIn AND DATE_SUB(checkOut, INTERVAL 1 DAY) AND property_name = propertyName AND room_num = roomNum;

        # Make a payment
        INSERT INTO Payment (amount, card_num, reservation_id)
        VALUES 
        (
			price,
            cardNum,
            reservationId
        );
    END IF;
END$$

# User must exist before this.
# If you know that provincecountrypostalcode exists, leave provinceState null. Furthermore, if you know address exists, pass null for city. Address type will be billing if adding for the first time. Otherwise, it doesn't matter what it's listed as.
CREATE PROCEDURE addPaymentInformation
(cardNum VARCHAR(16), cardType ENUM('AMEX', 'VISA', 'MC', 'DISCOVER'), secCode VARCHAR(4), expiryMonth INT UNSIGNED, expiryYear INT UNSIGNED, emailAddress VARCHAR(100), streetAddress VARCHAR(100), unitNumber VARCHAR(8), country VARCHAR(50), postalCode VARCHAR(7), city VARCHAR(50), provinceState VARCHAR(50))
BEGIN
	# First, we need to check if the address exists. If the optional parameters as indicated in comment above the procedure are null, this check will be ignored
    IF city IS NOT NULL AND NOT EXISTS (SELECT * FROM Address a WHERE a.street_address = streetAddress AND a.unit_number = unitNumber AND a.country = country AND a.city = city) 
    THEN
    	#Then, we need to add to the ProvinceCountryPostalCode if it does not exist. If province null, we assume this exists in the table and this check is ignored.
		IF provinceState IS NOT NULL AND NOT EXISTS(SELECT * FROM ProvinceCountryPostalCode pcpc WHERE pcpc.country = country AND pcpc.postal_code = postalCode)
		THEN
			INSERT INTO ProvinceCountryPostalCode
			VALUES
			(
				country,
				postalCode,
				provinceState
			);
		END IF;
        
        # Now, we will add the address
        INSERT INTO Address
        VALUES
        (
			streetAddress,
            unitNumber,
            country,
            postalCode,
            city,
            'billing'
        );
    END IF;
	
    # By now the address is good to go. Adding payment information
    INSERT INTO PaymentInformation
    VALUES
    (
		cardNum, 
        cardType,
        secCode,
        expiryMonth, 
        expiryYear,
        streetAddress,
        unitNumber,
        country,
        postalCode,
        emailAddress
    );
END$$

# Will create dates. Defaults to not holidays
DROP PROCEDURE IF EXISTS createDatesInRange;
DELIMITER $$
CREATE PROCEDURE createDatesInRange(startDate date, endDate date)
BEGIN
	DECLARE currentDate DATE DEFAULT startDate;
    WHILE datediff(endDate, currentDate) >= 0
    DO
		IF NOT EXISTS(SELECT * FROM _Date WHERE _date = currentDate)
		THEN
			INSERT INTO _Date
			VALUES (
				currentDate,
				'n'
			);
		END IF;
        
        SET currentDate = DATE_ADD(currentDate, INTERVAL 1 DAY);
    END WHILE;
END$$
# Will Add RoomDates (i.e. make rooms available for specific date ranges)
CREATE PROCEDURE addRoomDates(roomtype VARCHAR(20), startDate date, endDate date, rate FLOAT, propertyName VARCHAR(100))
BEGIN
	INSERT INTO Room_Date (property_name, room_num, _date, rate) 
	SELECT r.property_name, r.room_num, d._date, rate
	FROM Room r, _Date d
	WHERE r.room_type = roomtype AND r.property_name = propertyName AND d._date BETWEEN startDate AND endDate;
END$$
DELIMITER ;

CALL createDatesInRange(CAST('2020-12-10' AS DATE), CAST('2021-03-03' AS DATE));
SELECT * FROM _DATE;
CALL addRoomDates('Double', '2020-12-10', '2021-03-03', 349, 'Candlewood Suites');
SELECT * FROM ROOM_DATE WHERE _date BETWEEN '2020-12-10' AND '2021-03-03';
DESCRIBE Property;


SELECT * FROM PROPERTY;
