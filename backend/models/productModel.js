const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ensure db connection is exported

const Product = sequelize.define('Product', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	vendorEmail: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	title: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	category: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	productBrand: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	productCode: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	description: {
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
	ingredients: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	usage: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	warnings: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	discountNote: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	discountPrice: {
		type: DataTypes.FLOAT,
		allowNull: false,
	},
	quantity: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	vendorId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'Vendors',
			key: 'id',
		},
	},
}, {
	timestamps: true,
});

module.exports = Product;
