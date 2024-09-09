const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ensure db connection is exported

const Cart = sequelize.define('Cart', {
	customerId: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	productName: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	category: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	productCode: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	picURL: {
		type: DataTypes.STRING,
		allowNull: true,
		defaultValue: "https://res.cloudinary.com/dfmnpw0yp/image/upload/v1679235307/assets/tsuh9f6v1reihgqxwxrz.ico",
	},
	price: {
		type: DataTypes.FLOAT,
		allowNull: false,
	},
	discountNote: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	discountPrice: {
		type: DataTypes.FLOAT,
		allowNull: false,
	},
	quantity: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
}, {
	timestamps: true,
});

module.exports = Cart;
