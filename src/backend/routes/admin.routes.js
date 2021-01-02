const auth = require('../middleware/auth')

// stuff from user might need to come here
module.exports = app => {
    const sql = require("../models/db.js");
    const adminQueries = require("../utils/admin_queries");

    app.get("/api/adminProperties", (req, res) => {
        sql.query(adminQueries.getAllProperties(), (err, resp) => {
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

    // Will get the highest spenders in the system.
    app.get("/api/highSpender", (req, res) => {
        const n = req.query.n;

        sql.query(adminQueries.searchNHighestSpenders(n), (err, resp) => {
            if (err) {
                res.statusMessage = err.sqlMessage;
                res.status(400).end();
                return;
            }

            const response = [];
            resp.forEach((row) => {
                response.push({
                    user_email: row.user_email,
                    total_spend: row['SUM(p.amount)']
                });
            });

            res.send(response);
        })
    });

    // Will get the highest rated properties
    app.get("/api/highestRatedProperty", (req, res) => {
        sql.query(adminQueries.getHighestRatedProperties(), (err, resp) => {
            if (err) {
                res.statusMessage = err.sqlMessage;
                res.status(400).end();
                return;
            }

            const response = [];

            resp.forEach((row) => {
                response.push({
                    avg_rating: row.avg_value,
                    property_name: row.property_name
                });
            });

            res.send(response);
        })
    });

    // Will find out which amenity results in the highest rating
    app.get("/api/highestImpactAmenity", (req, res) => {
        sql.query(adminQueries.getHighestImpactAmenities(), (err, resp) => {
            if (err) {
                res.statusMessage = err.sqlMessage;
                res.status(400).end();
                return;
            }

            const response = [];

            resp.forEach((row) => {
                response.push({
                    amenity_name: row.amenity_name,
                    avg_rating: row['AVG(Review.rating)']
                })
            });

            res.send(response);
        })
    });

    // Will get the highest earning properties
    app.get("/api/highestEarningProperties", (req, res) => {
        sql.query(adminQueries.getHighestEarningProperties(), (err, resp) => {
            if (err) {
                res.statusMessage = err.sqlMessage;
                res.status(400).end();
                return;
            }

            const response = [];
            resp.forEach((row) => {
                response.push({
                    max_value: row.max_value,
                    property_name: row.property_name
                });
            });

            res.send(response);
        })
    });

    // Will get the most frequent reviewers and their ratings
    app.get("/api/frequentReviewers", (req, res) => {
        sql.query(adminQueries.getFrequentReviewers(), (err, resp) => {
            if (err) {
                res.statusMessage = err.sqlMessage;
                res.status(400).end();
                return;
            }

            const response = [];
            resp.forEach((row) => {
                response.push({
                    num_of_reviews: row.reviews,
                    avg_rating: row.avg_rating,
                    user_email: row.user_email
                });
            });

            res.send(response);
        })
    });

    // Will add a new guest
    app.post("/api/guest", auth, (req, res) => {
        console.log(req.user)
        const phone = req.body.phone;
        const firstName = req.body.first_name;
        const lastName = req.body.last_name;
        const dob = req.body.dob;

        sql.query(adminQueries.createGuest(phone, firstName, lastName, dob), (err, resp) => {
            if (err) {
                res.statusMessage = err.sqlMessage;
                res.status(400).end();
                return;
            }

            res.send(JSON.stringify('OK')).end();
        });
    });

    /**
     * Will update a guest
     *
     * The guest objects should have phone, first_name, last_name, dob.
     */
    app.put("/api/guest", (req, res) => {
        const oldGuest = req.body.oldGuest;
        const newGuest = req.body.newGuest;


        sql.query(adminQueries.updateGuest(oldGuest, newGuest), (err, resp) => {
            if (err) {
                res.statusMessage = err.sqlMessage;
                res.status(400).end();
                return;
            }

            res.send(JSON.stringify('OK')).end();
        });
    });

    // Will get a list of all guests
    app.get("/api/guests", (req, res) => {
        sql.query(adminQueries.getGuests(), (err, resp) => {
            if (err) {
                res.statusMessage = err.sqlMessage;
                res.status(400).end();
                return;
            }

            const response = [];
            resp.forEach((row) => {
                response.push({
                    phone_number: row.phone_number,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    dob: row.dob
                });
            });

            res.send(JSON.stringify(response)).end();
        })
    });

    // Will assign a guest to a reservation
    app.post("/api/assignGuest", (req, res) => {
        const reservationId = req.body.reservation_id;
        const phone = req.body.phone;
        const firstName = req.body.first_name;
        const lastName = req.body.last_name;
        const dob = req.body.dob;

        sql.query(adminQueries.assignGuest(reservationId, phone, firstName, lastName, dob), (err, resp) => {
            if (err) {
                res.statusMessage = err.sqlMessage;
                res.status(400).end();
                return;
            }

            res.send(JSON.stringify("OK")).end();
        })
    });

    // Will get all guests belonging to a reservation
    app.get("/api/reservation/guests", (req, res) => {
        const reservationId = req.query.reservation_id;

        sql.query(adminQueries.getGuestsForReservation(reservationId), (err, resp) => {
            if (err) {
                res.statusMessage = err.sqlMessage;
                res.status(400).end();
                return;
            }

            const response = [];
            resp.forEach((row) => {
                response.push({
                    phone_number: row.phone_number,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    dob: row.dob
                });
            });

            res.send(JSON.stringify(response)).end();
        })
    });


    // Will get all reservations for a given property name, if specified.
    app.get("/api/reservation", (req, res) => {
        const propertyName = req.query.property_name;
        console.log(propertyName);
        sql.query(adminQueries.getReservations(propertyName), (err, resp) => {
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
                    property_name: row.property_name
                });
            });

            res.send(JSON.stringify(response)).end();
        })
    });

    // Will delete a specific guest.
    app.delete("/api/guest", (req, res) => {
        const phone = req.query.phone_number;
        const firstName = req.query.first_name;
        const lastName = req.query.last_name;
        const dob = req.query.dob;

        sql.query(adminQueries.deleteGuest(phone, firstName, lastName, dob), (err, resp) => {
            if (err) {
                res.statusMessage = err.sqlMessage;
                res.status(400).end();
                return;
            }

            res.send(JSON.stringify("OK")).end();
        })
    });

    // Will get all dates
    app.get("/api/date", (req, res) => {
        sql.query(adminQueries.getDates(), (err, resp) => {
            if (err) {
                res.statusMessage = err.sqlMessage;
                res.status(400).end();
                return;
            }

            const response = [];
            resp.forEach((row) => {
                response.push({
                    date: row._date,
                    isHoliday: row.isHoliday
                });
            });

            res.send(JSON.stringify(response)).end();
        })
    });

    // Will make dates between ranges
    app.post("/api/dates", (req, res) => {
        const startDate = req.body.start_date;
        const endDate = req.body.end_date;

        sql.query(adminQueries.makeDatesInRange(startDate, endDate), (err, resp) => {
            if (err) {
                res.statusMessage = err.sqlMessage;
                res.status(400).end();
                return;
            }

            res.send(JSON.stringify("OK")).end();
        })
    });

    // Edit a specific date
    app.put("/api/date", (req, res) => {
        const date = req.body.date;
        const isHoliday = req.body.isHoliday;

        sql.query(adminQueries.updateDate(date, isHoliday), (err, resp) => {
            if (err) {
                res.statusMessage = err.sqlMessage;
                res.status(400).end();
                return;
            }

            return res.status(200).json(true).end();
        })
    });

    // You can't delete a date in this MVP. Are you really going to delete a day of the week?

    // Will create room dates for a specific room type at a specific property between two dates
    app.post("/api/roomDates", (req, res) => {
        const startDate = req.body.start_date;
        const endDate = req.body.end_date;
        const roomType = req.body.room_type;
        const rate = req.body.rate;
        const propertyName = req.body.property_name;

        sql.query(adminQueries.createRoomDates(startDate, endDate, roomType, rate, propertyName), (err, resp) => {
            if (err) {
                res.statusMessage = err.sqlMessage;
                res.status(400).end();
                return;
            }

            res.send(true).end();
        })
    });

    // Will update a single roomdate.
    app.put("/api/roomDate", (req, res) => {
        const propertyName = req.body.property_name;
        const roomNum = req.body.room_num;
        const date = req.body.date;
        const rate = req.body.rate;
        const reservationId = req.body.reservation_id;

        sql.query(adminQueries.updateRoomDate(propertyName, roomNum, date, rate, reservationId), (err, resp) => {
            if (err) {
                res.statusMessage = err.sqlMessage;
                res.status(400).end();
                return;
            }

            res.send(JSON.stringify("OK")).end();
        })
    });

    // Will get all roomdates between dates.
    app.get("/api/roomDates", (req, res) => {
        const startDate = req.query.start_date;
        const endDate = req.query.end_date;
        const propertyName = req.query.property_name;
        console.log(startDate, endDate, propertyName)

        sql.query(adminQueries.getRoomDates(startDate, endDate, propertyName), (err, resp) => {
            if (err) {
                res.statusMessage = err.sqlMessage;
                res.status(400).end();
                return;
            }

            const response = [];
            resp.forEach((row) => {
                response.push({
                    property_name: row.property_name,
                    room_num: row.room_num,
                    date: row._date,
                    rate: row.rate,
                    reservation_id: row.reservation_id
                });
            });
            console.log(response);
            res.send(JSON.stringify(response)).end();
        })
    });
};
