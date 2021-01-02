function searchProperties(checkIn, checkOut) {
    return `SELECT * 
            FROM Property
            WHERE EXISTS((SELECT room_num
                   FROM Room_Date
                   WHERE _date BETWEEN '${checkIn}' AND DATE_SUB('${checkOut}', INTERVAL 1 DAY) AND reservation_id IS NULL
                   GROUP BY room_num
                   HAVING COUNT(*) = DATEDIFF('${checkOut}', '${checkIn}')
       ));`
}

function searchPropertiesByCity(checkIn, checkOut, city) {
    return `
            SELECT * 
            FROM Property p
            WHERE EXISTS((SELECT room_num
                    FROM Room_Date
                   WHERE _date BETWEEN '${checkIn}' AND DATE_SUB('${checkOut}', INTERVAL 1 DAY) AND reservation_id IS NULL
                   GROUP BY room_num
                   HAVING COUNT(*) = DATEDIFF('${checkOut}', '${checkIn}')
                   )) AND EXISTS(SELECT city FROM Address a WHERE p.street_address = a.street_address AND p.unit_number = a.unit_number AND p.country = a.country AND p.postal_code = a.postal_code AND a.city = '${city}');
            `;
}

function searchPropertiesByName(checkIn, checkOut, propertyName) {
    return `
            SELECT * 
            FROM Property p
            WHERE EXISTS((SELECT room_num
                    FROM Room_Date
                   WHERE _date BETWEEN '${checkIn}' AND DATE_SUB('${checkOut}', INTERVAL 1 DAY) AND reservation_id IS NULL
                   GROUP BY room_num
                   HAVING COUNT(*) = DATEDIFF('${checkOut}', '${checkIn}')
                   )) AND p.property_name = '${propertyName}';
            `;
}

function getRoomsAtProperty(checkIn, checkOut, propertyName) {
    return `
            SELECT r.property_name, rd.room_num, r._description, rd.total_cost
            FROM Room r, (SELECT rd.room_num, sum(rate) as total_cost
                        FROM Room_Date rd
                        WHERE rd._date BETWEEN '${checkIn}' AND DATE_SUB('${checkOut}', INTERVAL 1 DAY) AND rd.reservation_id IS NULL AND rd.property_name = '${propertyName}'
                        GROUP BY rd.room_num
                        HAVING COUNT(*) = DATEDIFF('${checkOut}', '${checkIn}')) rd
            WHERE rd.room_num = r.room_num
            ORDER BY rd.total_cost;`;
}

function getAverageReviewForProperty(propertyName) {
    return `
            SELECT property_name, AVG(rating)
            FROM Review
            WHERE property_name = '${propertyName}'
            GROUP BY property_name;
            `;
}

function addReviewToProperty(rating, propertyName, userEmail) {
    return `
        INSERT INTO Review (rating, property_name, user_email)
        VALUES
        (
            ${rating},
            '${propertyName}',
            '${userEmail}'
        );
        `;
}

function getReservationsForUser(userEmail) {
    return `
        SELECT r.*, p.phone_number
        FROM Reservation r, Property p
        WHERE r.user_email = '${userEmail}' AND r.property_name = p.property_name
    `;
}

function getPaymentInformationForUser(userEmail) {
    return `
        SELECT card_num
        FROM PaymentInformation
        WHERE user_email = '${userEmail}'
    `;
}

function createPaymentInformation
    (cardNum, cardType, cvv, expiryMonth, expiryYear, userEmail, streetAddress, unitNumber, country, postalCode, city, state) {
    return `
        CALL addPaymentInformation('${cardNum}', '${cardType}', '${cvv}', ${expiryMonth}, ${expiryYear}, '${userEmail}', '${streetAddress}', '${unitNumber}', '${country}', '${postalCode}', '${city}', '${state}')
    `;
}

function bookReservation (checkIn, checkOut, propertyName, roomNum, cardNum, emailAddress, discount) {
    return `
        CALL bookReservation('${checkIn}', '${checkOut}', '${propertyName}', ${roomNum}, '${cardNum}', '${emailAddress}', ${discount})
    `;
}

module.exports = { searchProperties, searchPropertiesByCity, searchPropertiesByName, getRoomsAtProperty, getAverageReviewForProperty, addReviewToProperty, getReservationsForUser, bookReservation, getPaymentInformationForUser, createPaymentInformation };
