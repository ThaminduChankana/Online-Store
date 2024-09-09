const asyncHandler = require("express-async-handler");
const Vendor = require("../models/vendorModel");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

// Register vendor profile
const registerVendor = asyncHandler(async (req, res) => {
	const {
		name,
		telephone,
		homeAddress,
		email,
		password,
		businessName,
		businessAddress,
		website,
		businessRegNumber,
		description,
		pic,
	} = req.body;

	// Validate input fields
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	// Check if vendor already exists
	const vendorExists = await Vendor.findOne({ email });
	if (vendorExists) {
		return res.status(400).json({ message: "Vendor profile already exists!" });
	}

	// Create new vendor
	const vendor = new Vendor({
		name,
		telephone,
		homeAddress,
		email,
		password,
		businessName,
		businessAddress,
		website,
		businessRegNumber,
		description,
		pic,
	});

	// Hash the password
	const salt = await bcrypt.genSalt(10);
	vendor.password = await bcrypt.hash(password, salt);

	await vendor.save();

	// Return the registered vendor data
	res.status(201).json({
		_id: vendor._id,
		name: vendor.name,
		telephone: vendor.telephone,
		homeAddress: vendor.homeAddress,
		email: vendor.email,
		businessName: vendor.businessName,
		businessAddress: vendor.businessAddress,
		website: vendor.website,
		businessRegNumber: vendor.businessRegNumber,
		description: vendor.description,
		pic: vendor.pic,
		token: generateToken(vendor._id),
	});
});

// Authenticate vendor profile
const authVendor = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	// Validate input fields
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	// Check if vendor exists
	const vendor = await Vendor.findOne({ email });
	if (!vendor) {
		return res.status(401).json({ message: "Invalid Email or Password" });
	}

	// Validate password
	const isMatch = await bcrypt.compare(password, vendor.password);
	if (!isMatch) {
		return res.status(401).json({ message: "Invalid Email or Password" });
	}

	// Return authenticated vendor data
	res.status(200).json({
		_id: vendor._id,
		name: vendor.name,
		telephone: vendor.telephone,
		homeAddress: vendor.homeAddress,
		email: vendor.email,
		businessName: vendor.businessName,
		businessAddress: vendor.businessAddress,
		website: vendor.website,
		businessRegNumber: vendor.businessRegNumber,
		description: vendor.description,
		pic: vendor.pic,
		token: generateToken(vendor._id),
	});
});

// Get all vendors
const getVendors = asyncHandler(async (req, res) => {
	const vendors = await Vendor.find();

	if (vendors.length === 0) {
		return res.status(404).json({ message: "No vendors found" });
	}

	res.status(200).json(vendors);
});

// Get vendor profile by vendor
const getVendorProfile = asyncHandler(async (req, res) => {
	const vendor = await Vendor.findById(req.vendor._id);

	if (!vendor) {
		return res.status(404).json({ message: "Vendor not found" });
	}

	res.status(200).json(vendor);
});

// Get vendor profile by admin
const getVendorProfileById = asyncHandler(async (req, res) => {
	const vendor = await Vendor.findById(req.params._id);

	if (!vendor) {
		return res.status(404).json({ message: "Vendor not found" });
	}

	res.status(200).json(vendor);
});

// Update vendor profile by vendor
const updateVendorProfile = asyncHandler(async (req, res) => {
	const vendor = await Vendor.findById(req.vendor._id);

	if (!vendor) {
		return res.status(404).json({ message: "Vendor not found" });
	}

	// Update vendor fields if provided
	vendor.name = req.body.name || vendor.name;
	vendor.telephone = req.body.telephone || vendor.telephone;
	vendor.homeAddress = req.body.homeAddress || vendor.homeAddress;
	vendor.email = req.body.email || vendor.email;
	vendor.businessName = req.body.businessName || vendor.businessName;
	vendor.businessAddress = req.body.businessAddress || vendor.businessAddress;
	vendor.website = req.body.website || vendor.website;
	vendor.businessRegNumber = req.body.businessRegNumber || vendor.businessRegNumber;
	vendor.description = req.body.description || vendor.description;
	vendor.pic = req.body.pic || vendor.pic;

	// Update password if provided
	if (req.body.password) {
		const salt = await bcrypt.genSalt(10);
		vendor.password = await bcrypt.hash(req.body.password, salt);
	}

	const updatedVendor = await vendor.save();
	res.status(200).json(updatedVendor);
});

// Update vendor profile by admin
const updateVendorProfileById = asyncHandler(async (req, res) => {
	const vendor = await Vendor.findById(req.params._id);

	if (!vendor) {
		return res.status(404).json({ message: "Vendor not found" });
	}

	// Update vendor fields if provided
	vendor.name = req.body.name || vendor.name;
	vendor.telephone = req.body.telephone || vendor.telephone;
	vendor.homeAddress = req.body.homeAddress || vendor.homeAddress;
	vendor.email = req.body.email || vendor.email;
	vendor.businessName = req.body.businessName || vendor.businessName;
	vendor.businessAddress = req.body.businessAddress || vendor.businessAddress;
	vendor.website = req.body.website || vendor.website;
	vendor.businessRegNumber = req.body.businessRegNumber || vendor.businessRegNumber;
	vendor.description = req.body.description || vendor.description;
	vendor.pic = req.body.pic || vendor.pic;

	// Update password if provided
	if (req.body.password) {
		const salt = await bcrypt.genSalt(10);
		vendor.password = await bcrypt.hash(req.body.password, salt);
	}

	const updatedVendor = await vendor.save();
	res.status(200).json(updatedVendor);
});

// Delete vendor profile by vendor
const deleteVendorProfile = asyncHandler(async (req, res) => {
	const vendor = await Vendor.findById(req.vendor._id);

	if (!vendor) {
		return res.status(404).json({ message: "Vendor not found" });
	}

	await vendor.remove();
	res.status(200).json({ message: "Vendor removed" });
});

// Delete vendor profile by admin
const deleteVendorProfileById = asyncHandler(async (req, res) => {
	const vendor = await Vendor.findById(req.params._id);

	if (!vendor) {
		return res.status(404).json({ message: "Vendor not found" });
	}

	await vendor.remove();
	res.status(200).json({ message: "Vendor removed" });
});

// Get vendor statistics (new functionality)
const getVendorStatistics = asyncHandler(async (req, res) => {
	const totalVendors = await Vendor.countDocuments();
	const activeVendors = await Vendor.countDocuments({ status: "active" }); // Assuming there’s a status field
	const inactiveVendors = totalVendors - activeVendors;

	res.status(200).json({
		totalVendors,
		activeVendors,
		inactiveVendors,
	});
});

// Get vendor activity logs (new functionality)
const getVendorActivityLogs = asyncHandler(async (req, res) => {
	// Assuming you store logs in a separate collection
	const activityLogs = await ActivityLog.find({ vendorId: req.params._id });
	if (!activityLogs.length) {
		return res.status(404).json({ message: "No activity logs found for this vendor" });
	}

	res.status(200).json(activityLogs);
});

// Validation rules for vendor registration and updating
const validateVendorFields = [
	body("email", "Valid email is required").isEmail(),
	body("password", "Password must be at least 6 characters long").isLength({ min: 6 }),
	body("name", "Name is required").notEmpty(),
	body("telephone", "Telephone is required").notEmpty(),
	body("businessName", "Business name is required").notEmpty(),
	body("businessRegNumber", "Business registration number is required").notEmpty(),
];

module.exports = {
	registerVendor,
	authVendor,
	getVendors,
	getVendorProfile,
	getVendorProfileById,
	updateVendorProfile,
	updateVendorProfileById,
	deleteVendorProfile,
	deleteVendorProfileById,
	getVendorStatistics,
	getVendorActivityLogs,
	validateVendorFields,
};
