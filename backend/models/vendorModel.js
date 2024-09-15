const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ensure db connection is exported

const Vendor = sequelize.define('Vendor', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	isAdmin: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
	telephone: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	homeAddress: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	businessName: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	businessAddress: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	website: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	description: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	pic: {
		type: DataTypes.STRING,
		allowNull: true,
		defaultValue: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
	},
	regDate: {
		type: DataTypes.DATE,
		defaultValue: DataTypes.NOW,
	},
}, {
	timestamps: true,
});

module.exports = Vendor;
