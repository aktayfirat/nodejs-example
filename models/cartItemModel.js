const Sequelize = require('sequelize')
const sequelize = require('../utility/database.js')


const CartItem = sequelize.define('cartItem', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    quantity: Sequelize.INTEGER
})

module.exports = CartItem