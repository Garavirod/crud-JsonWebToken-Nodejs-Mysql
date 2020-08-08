const sequelize = require('sequelize');
const db = require('../config/db');


const User = db.define("UserNode", {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    first_name: {
        type: sequelize.STRING
    },
    last_name: {
        type: sequelize.STRING
    },
    email: {
        type: sequelize.STRING
    },
    password: {
        type: sequelize.STRING
    },
    created: {
        type: sequelize.DATE,
        defaultValue: sequelize.NOW
    }
});


module.exports = User;