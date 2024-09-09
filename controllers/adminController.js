const asyncHandler = require("express-async-handler");
const Admin = require("../models/adminModel");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

// Register user as an admin
const registerAdmin = asyncHandler(async (req, res) => {
	const { name, telephone, address, email, password, pic } = req.body;

	// Validation for required fields
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	// Check if the admin already exists
	const adminExists = await Admin.findOne({ where: { email } });
	if (adminExists) {
		return res.status(400).json({ message: "Admin profile already exists!" });
	}

	// Encrypt password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	// Create new admin
	const admin = await Admin.create({
		name,
		telephone,
		address,
		email,
		password: hashedPassword,
		pic,
	});

	// Return the response with token
	res.status(201).json({
		id: admin.id,
		name: admin.name,
		isAdmin: admin.isAdmin,
		telephone: admin.telephone,
		address: admin.address,
		email: admin.email,
		pic: admin.pic,
		token: generateToken(admin.id),
	});
});

// Authenticate the admin
const authAdmin = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	// Validate email and password presence
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	// Check if the admin exists
	const admin = await Admin.findOne({ where: { email } });
	if (!admin) {
		return res.status(401).json({ message: "Invalid Email or Password" });
	}

	// Check password
	const isMatch = await bcrypt.compare(password, admin.password);
	if (!isMatch) {
		return res.status(401).json({ message: "Invalid Email or Password" });
	}

	// Return admin details and token
	res.status(200).json({
		id: admin.id,
		name: admin.name,
		telephone: admin.telephone,
		address: admin.address,
		email: admin.email,
		pic: admin.pic,
		token: generateToken(admin.id),
	});
});

// View admin profile
const getAdminProfile = asyncHandler(async (req, res) => {
	const admin = await Admin.findByPk(req.admin.id);

	if (!admin) {
		return res.status(404).json({ message: "Admin not found!" });
	}

	// Return admin profile
	res.status(200).json(admin);
});

// Update admin profile
const updateAdminProfile = asyncHandler(async (req, res) => {
	const admin = await Admin.findByPk(req.admin.id);

	if (!admin) {
		return res.status(404).json({ message: "Admin not found!" });
	}

	// Update fields if provided
	admin.name = req.body.name || admin.name;
	admin.telephone = req.body.telephone || admin.telephone;
	admin.address = req.body.address || admin.address;
	admin.email = req.body.email || admin.email;
	admin.pic = req.body.pic || admin.pic;

	// Update password if provided
	if (req.body.password) {
		const salt = await bcrypt.genSalt(10);
		admin.password = await bcrypt.hash(req.body.password, salt);
	}

	// Save the updated admin
	const updatedAdmin = await admin.save();

	// Return updated admin details and token
	res.status(200).json({
		id: updatedAdmin.id,
		name: updatedAdmin.name,
		isAdmin: updatedAdmin.isAdmin,
		telephone: updatedAdmin.telephone,
		address: updatedAdmin.address,
		email: updatedAdmin.email,
		pic: updatedAdmin.pic,
		token: generateToken(updatedAdmin.id),
	});
});

// Validation rules for required fields
const validateAdminRegistration = [
	body("name", "Name is required").notEmpty(),
	body("email", "Valid email is required").isEmail(),
	body("password", "Password must be at least 6 characters long").isLength({ min: 6 }),
	body("telephone", "Telephone is required").notEmpty(),
];

const validateAdminLogin = [
	body("email", "Valid email is required").isEmail(),
	body("password", "Password is required").notEmpty(),
];

module.exports = {
	registerAdmin,
	authAdmin,
	getAdminProfile,
	updateAdminProfile,
	validateAdminRegistration,
	validateAdminLogin,
};
