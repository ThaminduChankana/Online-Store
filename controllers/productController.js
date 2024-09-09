const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Add a product according to vendor's email
const addProduct = asyncHandler(async (req, res) => {
	const {
		vendorEmail,
		title,
		category,
		productBrand,
		productCode,
		description,
		picURL,
		price,
		ingredients,
		usage,
		warnings,
		discountNote,
		discountPrice,
		quantity,
	} = req.body;

	// Validate input fields
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	// Check for missing required fields
	if (
		!vendorEmail ||
		!title ||
		!category ||
		!productBrand ||
		!productCode ||
		!description ||
		!picURL ||
		!price ||
		!ingredients ||
		!usage ||
		!warnings ||
		!discountNote ||
		!discountPrice ||
		!quantity
	) {
		return res.status(400).json({ message: "Please fill all the fields" });
	}

	// Create new product
	const product = await Product.create({
		vendorEmail,
		title,
		category,
		productBrand,
		productCode,
		description,
		picURL,
		price,
		ingredients,
		usage,
		warnings,
		discountNote,
		discountPrice,
		quantity,
		vendorId: req.vendor.id, // Assuming vendor ID is retrieved through authentication middleware
	});

	res.status(201).json(product);
});

// Get all products
const getProducts = asyncHandler(async (req, res) => {
	const products = await Product.findAll();

	if (products.length === 0) {
		return res.status(404).json({ message: "No products found" });
	}

	res.status(200).json(products);
});

// Get products for each vendor
const getProductsForEachVendor = asyncHandler(async (req, res) => {
	const products = await Product.findAll({ where: { vendorId: req.vendor.id } });

	if (products.length === 0) {
		return res.status(404).json({ message: "No products found for this vendor" });
	}

	res.status(200).json(products);
});

// Get product by ID
const getProductById = asyncHandler(async (req, res) => {
	const product = await Product.findByPk(req.params.id);

	if (!product) {
		return res.status(404).json({ message: "Product not found" });
	}

	res.status(200).json(product);
});

// Update product details
const updateProduct = asyncHandler(async (req, res) => {
	const {
		title,
		category,
		productBrand,
		productCode,
		description,
		picURL,
		price,
		ingredients,
		usage,
		warnings,
		discountNote,
		discountPrice,
		quantity,
	} = req.body;

	// Validate input fields
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const product = await Product.findByPk(req.params.id);

	if (!product) {
		return res.status(404).json({ message: "Product not found" });
	}

	// Update product fields if provided
	product.title = title || product.title;
	product.category = category || product.category;
	product.productBrand = productBrand || product.productBrand;
	product.productCode = productCode || product.productCode;
	product.description = description || product.description;
	product.picURL = picURL || product.picURL;
	product.price = price || product.price;
	product.ingredients = ingredients || product.ingredients;
	product.usage = usage || product.usage;
	product.warnings = warnings || product.warnings;
	product.discountNote = discountNote || product.discountNote;
	product.discountPrice = discountPrice || product.discountPrice;
	product.quantity = quantity || product.quantity;

	const updatedProduct = await product.save();
	res.status(200).json(updatedProduct);
});

// Delete a single product
const deleteProduct = asyncHandler(async (req, res) => {
	const product = await Product.findByPk(req.params.id);

	if (!product) {
		return res.status(404).json({ message: "Product not found" });
	}

	await product.destroy();
	res.status(200).json({ message: "Product removed" });
});

// Validation rules for adding and updating products
const validateProductFields = [
	body("vendorEmail", "Vendor Email is required").isEmail(),
	body("title", "Title is required").notEmpty(),
	body("category", "Category is required").notEmpty(),
	body("productBrand", "Product Brand is required").notEmpty(),
	body("productCode", "Product Code is required").notEmpty(),
	body("description", "Description is required").notEmpty(),
	body("picURL", "Picture URL is required").notEmpty(),
	body("price", "Price is required and must be a positive number").isFloat({ gt: 0 }),
	body("ingredients", "Ingredients are required").notEmpty(),
	body("usage", "Usage instructions are required").notEmpty(),
	body("warnings", "Warnings are required").notEmpty(),
	body("discountNote", "Discount Note is required").notEmpty(),
	body("discountPrice", "Discount Price is required and must be a positive number").isFloat({ gt: 0 }),
	body("quantity", "Quantity must be a positive integer").isInt({ min: 1 }),
];

module.exports = {
	addProduct,
	getProducts,
	getProductsForEachVendor,
	getProductById,
	updateProduct,
	deleteProduct,
	validateProductFields,
};
