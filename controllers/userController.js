const User = require("../models/User");
const db = require("../config/db");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const controllers = {};
process.env.SECRET_KEY = "secret";
db.sync(); // Migrate tables if not exist

// REGISTER
controllers.register = async(res, req) => {
    const today = new Date();
    const userData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        created: today,
    };

    User.findOne({
            where: { email: userData.email },
        })
        .then((user) => {
            if (!user) {
                const hash = bcrypt.hashSync(userData.password, 10);
                userData.password = hash;
                User.create(userData)
                    .then((user) => {
                        let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                            expiresIn: 1440,
                        });
                        res.json({ toke: token });
                    })
                    .catch((err) => {
                        res.send("Error >:" + err);
                    });
            } else {
                res.json({ error: "User already exist!" });
            }
        })
        .catch((err) => {
            res.send("Error >:" + err);
        });
};

// LOGIN
controllers.login = async(res, req) => {
    User.findOne({ where: { email: req.body.email } })
        .then(user => {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                    expiresIn: 1440,
                });
                res.json({ toke: token });
            } else {
                res.send('User does not exist !')
            }
        })
        .catch((err) => {
            res.send("Error >: " + err);
        });
};

// PROFILE
controllers.profile = async(res, req) => {
    var decoded = jwt.verify(req.headers["authorization"], process.env.SECRET_KEY);
    User.findOne({
            where: { id: decoded.id }
        })
        .then(user => {
            if (user) {
                res.json(user);
            } else {
                res.send("User does not exist!");
            }
        })
        .catch(err => {
            res.send("Error >: " + err)
        });
};


module.exports = controllers;