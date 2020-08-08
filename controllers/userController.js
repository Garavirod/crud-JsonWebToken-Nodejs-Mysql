const User = require("../models/User");
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const controllers = {};
process.env.SECRET_KEY = "secret";
db.sync(); // Migrate tables if do not exist

// REGISTER
controllers.register = async(req, res) => {
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
                        res.json({ token: token });
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
controllers.login = async(req, res) => {
    User.findOne({ where: { email: req.body.email } })
        .then(user => {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                    expiresIn: 1440,
                });
                res.json({ token: token });
            } else {
                res.send('User does not exist !')
            }
        })
        .catch((err) => {
            res.send("Error >: " + err);
        });
};

// PROFILE
controllers.profile = async(req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    let issuccefully;
    const profile = await User.findOne({
            where: { id: decoded.id }
        })
        .then(userProfile => {
            if (userProfile) {
                // res.json(userProfile);
                issuccefully = true;
                return userProfile;
            } else {
                issuccefully = false;
                res.send("User does not exist!");
            }
        })
        .catch(err => {
            res.send("Error >: " + err)
        });

    res.json({ success: issuccefully, data: profile });
};


// USERS LIST
controllers.list = async(req, res) => {
    const users = await User.findAll()
        .then(users => {
            if (users) {
                return users;
            } else {
                res.send("There are not users!");
            }
        })
        .catch(err => {
            res.send("Error >: " + err);
        });
    res.json({ success: true, data: users });
};


// USER BY ID
controllers.oneUser = async(req, res) => {
    const userbyid = await User.findOne({
            where: { id: req.params.id }
        })
        .then(user => {
            return user;
        })
        .catch(err => {
            res.send("Error >: " + err);
        });
    res.json({ success: true, data: userbyid });
};

module.exports = controllers;