const express = require("express");
const {
	registerVendor,
	authVendor,
	getVendorProfile,
	updateVendorProfile,
	deleteVendorProfile,
} = require("../controllers/vendorController");
const { protectVendor } = require("../middleware/authVendorMiddleware");
const router = express.Router();

//Routes for Vendor Account Operations
router.route("/register").post(registerVendor);
router.route("/login").post(authVendor);
router.route("/view").get(protectVendor, getVendorProfile);
router.route("/edit").put(protectVendor, updateVendorProfile);
router.route("/delete").delete(protectVendor, deleteVendorProfile);

module.exports = router;
