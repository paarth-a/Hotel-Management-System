// HOPEFULLY THIS WORKS LIKE THIS

function searchNHighestSpenders(n) {
    if (n) {
        return `
            SELECT pi.user_email, SUM(p.amount)
            FROM PaymentInformation pi, Payment p
            WHERE pi.card_num = p.card_num
            GROUP BY pi.user_email
            ORDER BY SUM(p.amount) DESC
            LIMIT ${n};
            `;
    }
    return `
            SELECT pi.user_email, SUM(p.amount)
            FROM PaymentInformation pi, Payment p
            WHERE pi.card_num = p.card_num
            GROUP BY pi.user_email
            ORDER BY SUM(p.amount) DESC;
            `;
}

function getFrequentReviewers() {
    return `
        SELECT reviews, user_email, avg_rating
        FROM (SELECT COUNT(*) AS reviews, user_email, avg(rating) AS avg_rating
              FROM Review 
              GROUP BY user_email) temp 
        ORDER BY reviews DESC, avg_rating DESC;
        `;
}

function getHighestRatedProperties() {
    return `
        SELECT avg_value, property_name
        FROM (SELECT AVG(rating) AS avg_value, property_name 
              FROM Review 
              GROUP BY property_name) temp 
        ORDER BY avg_value DESC;
        ;`;
}

function getHighestImpactAmenities() {
    return `
        SELECT PropertyAmenity.amenity_name, AVG(Review.rating)
        FROM Review, PropertyAmenity, Property
        WHERE PropertyAmenity.property_name = Review.property_name
        AND Review.property_name = Property.property_name
        GROUP BY PropertyAmenity.amenity_name
        ORDER BY AVG(Review.rating) DESC;
        `;
}

function getHighestEarningProperties() {
    return `
        SELECT max_value, property_name
        FROM (SELECT sum(total_price) AS max_value, property_name 
              FROM Reservation 
              GROUP BY property_name) temp 
        ORDER BY max_value DESC;
        `;
}

function createGuest(phone, firstName, lastName, date) {
    return `
    INSERT INTO Guest 
        VALUES (
            '${phone}',
            '${firstName}',
            '${lastName}',
            '${date}'
        );
    `;
}

function updateGuest(oldValues, newValues) {
    const oldPhone = oldValues.phone;
    const oldFirstName = oldValues.first_name;
    const oldLastName = oldValues.last_name;
    const oldDate = oldValues.dob;

    const newPhone = newValues.phone;
    const newFirstName = newValues.first_name;
    const newLastName = newValues.last_name;
    const newDate = newValues.dob;

    if (!(newPhone || newFirstName || newLastName || newDate)) {
        return;
    }

    return `
        UPDATE Guest 
        SET ${newPhone ? `phone_number = '${newPhone}', `: ''}
        ${newFirstName ? `first_name = '${newFirstName}', `: ''}
        ${newLastName ? `last_name = '${newLastName}', `: ''}
        ${newDate ? `dob = '${newDate}'`: ''}
        WHERE phone_number = '${oldPhone}' AND first_name = '${oldFirstName}' AND last_name = '${oldLastName}' AND dob = '${oldDate}';
    `;
}

function getGuests() {
    return `
        SELECT * 
        FROM Guest;
    `;
}

function assignGuest(reservation, phone, firstName, lastName, dob) {
    return `
        INSERT INTO AdditionalGuests
        VALUES (
            '${reservation}',
            '${phone}',
            '${firstName}',
            '${lastName}',
            '${dob}'
        );
    `
}

function getGuestsForReservation(reservation) {
    return `
        SELECT *
        FROM AdditionalGuests
        WHERE reservation_id = '${reservation}';
    `;
}

function getReservations(propertyName) {
    return `
        SELECT *
        FROM Reservation
       ${propertyName ? `WHERE property_name = '${propertyName}';` : ';'}
    `;
}

function deleteGuest(phone, firstName, lastName, dob) {
    return `
        DELETE FROM Guest
        WHERE phone_number = '${phone}' AND first_name = '${firstName}' AND last_name = '${lastName}' AND dob = '${dob}';
    `;
}

function getDates() {
    return `
        SELECT * FROM _Date;
    `;
}

function makeDatesInRange(startDate, endDate) {
    return `
        CALL createDatesInRange(CAST('${startDate}' AS DATE), CAST('${endDate}' AS DATE));
    `;
}

// Note that isHoliday should be 'y' or 'n'
function updateDate(date, isHoliday) {
    return `
        UPDATE _Date
        SET isHoliday = '${isHoliday}'
        WHERE _date = '${date}';
    `;
}

function createRoomDates(startDate, endDate, roomType, rate, propertyName) {
    return `
        CALL addRoomDates('${roomType}', CAST('${startDate}' AS DATE), CAST('${endDate}' AS DATE), ${rate}, '${propertyName}');
    `;
}

// ReservationID can be null
function updateRoomDate(propertyName, roomNum, date, rate, reservationId) {
    return `
        UPDATE Room_Date
        SET rate = ${rate} ${reservationId ? ` AND reservation_id = ${reservationId}`: ''}
        WHERE property_name = '${propertyName}' AND room_num = ${roomNum} AND _date = '${date}';
    `;
}

function getRoomDates(startDate, endDate, propertyName) {
    return `
        SELECT * 
        FROM Room_Date
        WHERE property_name = '${propertyName}' AND _date BETWEEN CAST('${startDate}' AS DATE) AND CAST('${endDate}' AS DATE);
    `;
}

function getAllProperties() {
    return 'SELECT * FROM Property';
}



module.exports = { searchNHighestSpenders, getFrequentReviewers, getHighestEarningProperties, getHighestImpactAmenities, getHighestRatedProperties, createGuest, updateGuest, getGuests, assignGuest, getGuestsForReservation, getReservations, deleteGuest, getDates, makeDatesInRange, updateDate, createRoomDates, updateRoomDate, getRoomDates, getAllProperties };
