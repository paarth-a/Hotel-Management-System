let loginQueries = require('../utils/login_queries');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth')

module.exports = app => {
    const sql = require("../models/db.js");

    app.post('/api/login', (req, res) => {
        // console.log(req.body)
        // get user email and pwd from body
        var useremail = req.body.useremail;
        var password = req.body.password;
        var is_user = req.body.type;

        is_user = is_user === 'user' ? 'y' : 'n';

        if (!useremail || !password || !is_user) {
            return res.status(400).send('Bad Request: Username and Password are required');
        }

        // check if user is admin
        console.log(is_user, useremail, password)
        if (is_user === 'n' && useremail && password) {
            sql.query(loginQueries.loginQuery, [useremail, is_user], (err, response) => {
                if (err) {
                    console.log("error: ", err);
                    res.status(500).end();
                } else if (response.length > 0) {
                    // compare hashed pwd
                 
                    if (response[0].pass === password) {

                        const payload = {
                            user: {
                              email: useremail,
                            },
                          };
                          console.log('reached')
                          jwt.sign(
                            payload,
                            'secret',
                            { expiresIn: 3600 },
                            (err, token) => {
                              if (err) throw err;
                  
                              return res
                              .cookie("token", token)
                              .cookie("is_user", is_user)
                              .json({ success: true });
                            }
                          );

                    } else {
                        return res.status(401).send('Email or Password is Invalid');
                    }
                }  else {
                    return res.status(401).send('Email or Password is Invalid');
                }
            })
        } else if (is_user === 'y' && useremail && password) {
            // regular users
            sql.query(loginQueries.loginQuery, [useremail, is_user], (err, response) => {
                if (err) {
                    console.log("error: ", err);
                    return;
                } else if (response.length > 0) {
                    console.log(response);
                    if (response[0].pass === password) {
                        // req.session.loggedin = true;
                        // req.session.useremail = useremail;
                        // console.log(req.session);

                        const payload = {
                            user: {
                              email: useremail,
                            },
                          };
                          console.log('reached')
                          jwt.sign(
                            payload,
                            'secret',
                            { expiresIn: 3600 },
                            (err, token) => {
                              if (err) throw err;
                  
                              return res
                              .cookie("token", token)
                              .cookie("is_user", is_user)
                              .json({ success: true });
                            }
                          );
                    } else {
                        return res.status(401).send('Email or Password is Invalid');
                    }

                } else {
                    return res.status(401).send('Email or Password is Invalid');
                }

            });
        }
    });

    app.post('/api/logout', async (req, res) => {
        console.log('reached');
        res.clearCookie("token");
        return res.send({ success: true });
      })

    app.post('/api/register', (req, res) => {
        // change type to enum
        var is_user = req.body.registerForm.role;
        is_user = is_user === 'user' ? 'y' : 'n';

        var users =
            {
                "user_email": req.body.registerForm.useremail,
                "pass": req.body.registerForm.password,
                "first_name": req.body.registerForm.firstname,
                "last_name": req.body.registerForm.lastname,
                "dob": req.body.registerForm.dob,
                "phone_number": req.body.registerForm.phonenumber,
                "is_user": is_user
            };

        sql.query(loginQueries.registerQuery, users, function (error, results, fields) {
            if (error) {
                console.log(error);
                res.send({
                    "code": 400,
                    "failed": "Required fields not present"
                })
            } else {
                res.send({
                    "code": 200,
                    "success": "User registered successfully"
                });
            }
        });

    })
}
