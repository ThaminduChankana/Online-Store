const asyncHandler = require("express-async-handler");
const Customer = require("../models/customerModel");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

// Register customer profile
const registerCustomer = asyncHandler(async (req, res) => {
	const { name, telephone, address, email, password, pic } = req.body;

	// Validation errors check
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	// Check if customer already exists
	const customerExists = await Customer.findOne({ where: { email } });
	if (customerExists) {
		return res.status(400).json({ message: "Customer profile already exists!" });
	}

	// Hash the password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	// Create new customer
	const customer = await Customer.create({
		name,
		telephone,
		address,
		email,
		password: hashedPassword,
		pic,
	});

	// Save customer and return response
	res.status(201).json({
		id: customer.id,
		name: customer.name,
		telephone: customer.telephone,
		address: customer.address,
		email: customer.email,
		pic: customer.pic,
		token: generateToken(customer.id),
	});
});

// Authenticate customer profile
const authCustomer = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	// Validation errors check
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	// Check if customer exists
	const customer = await Customer.findOne({ where: { email } });
	if (!customer) {
		return res.status(401).json({ message: "Invalid Email or Password" });
	}

	// Validate password
	const isMatch = await bcrypt.compare(password, customer.password);
	if (!isMatch) {
		return res.status(401).json({ message: "Invalid Email or Password" });
	}

	// Return authenticated customer data
	res.status(200).json({
		id: customer.id,
		name: customer.name,
		telephone: customer.telephone,
		address: customer.address,
		email: customer.email,
		pic: customer.pic,
		regDate: customer.regDate,
		token: generateToken(customer.id),
	});
});

// Get all customers
const getCustomers = asyncHandler(async (req, res) => {
	const customers = await Customer.findAll();
	if (!customers.length) {
		return res.status(404).json({ message: "No customers found" });
	}
	res.status(200).json(customers);
});

// View customer profile by customer
const getCustomerProfile = asyncHandler(async (req, res) => {
	const customer = await Customer.findByPk(req.customer.id);
	if (!customer) {
		return res.status(404).json({ message: "Customer not found" });
	}
	res.status(200).json(customer);
});

// View customer profile by admin
const getCustomerProfileById = asyncHandler(async (req, res) => {
	const customer = await Customer.findByPk(req.params.id);
	if (!customer) {
		return res.status(404).json({ message: "Customer not found" });
	}
	res.status(200).json(customer);
});

// Update customer profile by customer
const updateCustomerProfile = asyncHandler(async (req, res) => {
	const customer = await Customer.findByPk(req.customer.id);
	if (!customer) {
		return res.status(404).json({ message: "Customer not found" });
	}

	// Update fields if provided
	customer.name = req.body.name || customer.name;
	customer.telephone = req.body.telephone || customer.telephone;
	customer.address = req.body.address || customer.address;
	customer.email = req.body.email || customer.email;
	customer.pic = req.body.pic || customer.pic;

	// Update password if provided
	if (req.body.password) {
		const salt = await bcrypt.genSalt(10);
		customer.password = await bcrypt.hash(req.body.password, salt);
	}

	const updatedCustomer = await customer.save();

	// Return updated customer data
	res.status(200).json({
		id: updatedCustomer.id,
		name: updatedCustomer.name,
		telephone: updatedCustomer.telephone,
		address: updatedCustomer.address,
		email: updatedCustomer.email,
		pic: updatedCustomer.pic,
		token: generateToken(updatedCustomer.id),
	});
});

// Update customer profile by admin
const updateCustomerProfileById = asyncHandler(async (req, res) => {
	const customer = await Customer.findByPk(req.params.id);
	if (!customer) {
		return res.status(404).json({ message: "Customer not found" });
	}

	// Update fields if provided
	customer.name = req.body.name || customer.name;
	customer.telephone = req.body.telephone || customer.telephone;
	customer.address = req.body.address || customer.address;
	customer.email = req.body.email || customer.email;
	customer.pic = req.body.pic || customer.pic;

	// Update password if provided
	if (req.body.password) {
		const salt = await bcrypt.genSalt(10);
		customer.password = await bcrypt.hash(req.body.password, salt);
	}

	const updatedCustomer = await customer.save();

	// Return updated customer data
	res.status(200).json({
		id: updatedCustomer.id,
		name: updatedCustomer.name,
		telephone: updatedCustomer.telephone,
		address: updatedCustomer.address,
		email: updatedCustomer.email,
		pic: updatedCustomer.pic,
		token: generateToken(updatedCustomer.id),
	});
});

// Delete customer profile by customer
const deleteCustomerProfile = asyncHandler(async (req, res) => {
	const customer = await Customer.findByPk(req.customer.id);
	if (!customer) {
		return res.status(404).json({ message: "Customer not found" });
	}

	await customer.destroy();
	res.status(200).json({ message: "Customer removed" });
});

// Delete customer profile by admin
const deleteCustomerProfileById = asyncHandler(async (req, res) => {
	const customer = await Customer.findByPk(req.params.id);
	if (!customer) {
		return res.status(404).json({ message: "Customer not found" });
	}

	await customer.destroy();
	res.status(200).json({ message: "Customer removed" });
});

// Validation rules for customer fields
const validateCustomerRegistration = [
	body("name", "Name is required").notEmpty(),
	body("email", "Valid email is required").isEmail(),
	body("password", "Password must be at least 6 characters long").isLength({ min: 6 }),
	body("telephone", "Telephone is required").notEmpty(),
];

module.exports = {
	registerCustomer,
	authCustomer,
	getCustomers,
	getCustomerProfile,
	getCustomerProfileById,
	updateCustomerProfile,
	updateCustomerProfileById,
	deleteCustomerProfile,
	deleteCustomerProfileById,
	validateCustomerRegistration,
};
