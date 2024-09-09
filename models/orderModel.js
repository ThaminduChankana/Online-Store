const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ensure db connection is exported

const Order = sequelize.define('Order', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	customerId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'Customers', // name of the Customer model
			key: 'id',
		},
	},
	products: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	orderID: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	total: {
		type: DataTypes.FLOAT,
		allowNull: false,
	},
	status: {
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue: 'pending',
	},
}, {
	timestamps: true,
});

module.exports = Order;
