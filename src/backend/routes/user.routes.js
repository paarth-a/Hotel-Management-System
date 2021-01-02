const auth = require('../middleware/auth');
const con = require('../models/db.js');

// login, make reservations, make payments, book rooms
module.exports = app => {
    const userQueries = require("../utils/user_queries");
    const sql = require("../models/db.js");
    
    // add routes
    app.get("/", (req, res) => {
        res.json({ message: "Welcome to the hotel management system." });
    });

    app.get("/api/searchProperties", (req, res) => {
        const checkIn = req.query.check_in;
        const checkOut = req.query.check_out;

        sql.query(userQueries.searchProperties(checkIn, checkOut), (err, resp) => {
            if (err) {
                res.statusMessage = err.sqlMessage;
                res.status(400).end();
                return;
            }

            const response = [];
            resp.forEach((row) => {
                response.push({
                    property_name: row.property_name,
                    phone_number: row.phone_number,
                    street_address: row.street_address,
                    unit_number: row.unit_number,
                    country: row.country,
                    postal_code: row.postal_code
                });
            });

            res.send(response);
        })
    });

    app.get("/api/searchPropertiesByCity", (req, res) => {
        const checkIn = req.query.check_in;
        const checkOut = req.query.check_out;
        const city = req.query.city;

        sql.query(userQueries.searchPropertiesByCity(checkIn, checkOut, city), (err, resp) => {
            if (err) {
                res.statusMessage = err.sqlMessage;
                res.status(400).end();
                return;
            }

            const response = [];
            resp.forEach((row) => {
                response.push({
                    property_name: row.property_name,
                    phone_number: row.phone_number,
                    street_address: row.street_address,
                    unit_number: row.unit_number,
                    country: row.country,
                    postal_code: row.postal_code
                });
            });

            res.send(response);
        })
    });

    app.get("/api/searchPropertiesByName", (req, res) => {
        console.log(req.query)
        const checkIn = req.query.check_in;
        const checkOut = req.query.check_out;
        const propertyName = req.query.property_name;

        sql.query(userQueries.searchPropertiesByName(checkIn, checkOut, propertyName), (err, resp) => {
            if (err) {
                res.statusMessage = err.sqlMessage;
                res.status(400).end();
                return;
            }
            
            const response = [];
            resp.forEach((row) => {
                response.push({
                    property_name: row.property_name,
                    phone_number: row.phone_number,
                    street_address: row.street_address,
                    unit_number: row.unit_number,
                    country: row.country,
                    postal_code: row.postal_code
                });
            });

            res.send(response);
        })
    });

    app.get("/api/roomsAvailable", (req, res) => {
        const checkIn = req.query.check_in;
        const checkOut = req.query.check_out;
        const propertyName = req.query.property_name;

        sql.query(userQueries.getRoomsAtProperty(checkIn, checkOut, propertyName), (err, resp) => {
            if (err) {
                res.statusMessage = err.sqlMessage;
                res.status(400).end();
                return;
            }

            const response = [];
            resp.forEach((row) => {
                response.push({
                    propertyName: row.property_name,
                    roomNum: row.room_num,
                    description: row._description,
                    totalCost: row.total_cost
                });
            });

            res.send(JSON.stringify(response));
        })
    });

    // Will get the rating of a property out of 10
    app.get("/api/averageReview", (req, res) => {
        const propertyName = req.query.property_name;
        sql.query(userQueries.getAverageReviewForProperty(propertyName), (err, resp) => {
            if (err) {
                res.statusMessage = err.sqlMessage;
                res.status(400).end();
                return;
            }

            const response = [];
            resp.forEach((row) => {
                response.push({
                    propertyName: row.property_name,
                    rating:  row['AVG(rating)']
                });
            });

            res.send(JSON.stringify(response));
        })
    });

    // Will post a new rating to a property
    app.post("/api/review", auth, (req, res) => {
        const rating = parseInt(req.body.rating);
        const propertyName = req.body.property_name;
        const userEmail = req.user.email;
        console.log(rating, propertyName, userEmail);
        sql.query(userQueries.addReviewToProperty(rating, propertyName, userEmail), (err, resp) => {
            if (err) {
                res.statusMessage = err.sqlMessage;
                res.status(400).end();
                return;
            }

            res.send(JSON.stringify(resp.review_id));
        });
    });

    // Will get reservations for a specific user
    app.get("/api/reservationsForUser", auth, (req, res) => {
        const userEmail = req.user.email;

        sql.query(userQueries.getReservationsForUser(userEmail), (err, resp) => {
            if (err) {
                res.statusMessage = err.sqlMessage;
                res.status(400).end();
                return;
            }

            const response = [];
            resp.forEach((row) => {
                response.push({
                    reservation_id: row.reservation_id,
                    check_in: row.check_in,
                    check_out: row.check_out,
                    total_price: row.total_price,
                    user_email: row.user_email,
                    property_name: row.property_name,
                    phone_number: row.phone_number
                });
            });

            res.send(JSON.stringify(response)).end();
        });
    });

    // Get payment info for a user. Right now only returns Primary Key.
    app.get("/api/paymentInformation", auth, (req, res) => {
        console.log(req.user)
        const userEmail = req.user.email;
        sql.query(userQueries.getPaymentInformationForUser(userEmail), (err, resp) => {
            if (err) {
                res.statusMessage = err.sqlMessage;
                res.status(400).end();
                return;
            }

            const response = [];
            resp.forEach((row) => {
                response.push({
                    card_num: row.card_num
                });
            });

            res.send(JSON.stringify(response)).end();
        });
    });

    app.post("/api/paymentInformation", auth, (req, res) => {
        const cardNum = req.body.card_num;
        const cardType = req.body.card_type;
        const cvv = req.body.cvv;
        const expiryMonth = req.body.expiry_month;
        const expiryYear = req.body.expiry_year;
        const userEmail = req.user.email;
        const streetAddress = req.body.street_address;
        const unitNumber = req.body.unit_number;
        const country = req.body.country;
        const postalCode = req.body.postal_code;
        const city = req.body.city;
        const province = req.body.province;

        console.log(req.body)

        sql.query(userQueries.createPaymentInformation(cardNum, cardType, cvv, expiryMonth, expiryYear, userEmail, streetAddress, unitNumber, country, postalCode, city, province), (err, resp) => {
            if (err) {
                res.statusMessage = err.sqlMessage;
                res.status(400).end();
                return;
            }

            res.send(JSON.stringify("OK")).end();
        })
    });

    app.post("/api/reservation", auth, (req, res) => {
        const checkIn = req.body.check_in;
        const checkOut = req.body.check_out;
        const propertyName = req.body.property_name;
        const roomNum = req.body.room_num;
        const cardNum = req.body.card_num;
        const emailAddress = req.user.email;
        const discount = req.body.discount;
        console.log(req.body, emailAddress);
        sql.query(userQueries.bookReservation(checkIn, checkOut, propertyName, roomNum, cardNum, emailAddress, discount), (err, resp) => {
            if (err) {
                res.statusMessage = err.sqlMessage;
                res.status(400).end();
                return;
            }

            res.send(JSON.stringify("OK")).end();
        });
    });
}
