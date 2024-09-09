const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const { body, validationResult } = require("express-validator");

// Get cart items for a particular customer
const getCartItems = asyncHandler(async (req, res) => {
	const items = await Cart.findAll({ where: { customerId: req.params.id } });
	if (items.length === 0) {
		return res.status(404).json({ message: "No items found in cart" });
	}
	res.status(200).json(items);
});

// Get total price of a particular customer
const getTotal = asyncHandler(async (req, res) => {
	const items = await Cart.findAll({ where: { customerId: req.params.id } });
	if (items.length === 0) {
		return res.status(404).json({ message: "No items found in cart" });
	}

	let total = 0;
	items.forEach((item) => {
		total += (item.price - item.discountPrice) * item.quantity;
	});

	res.status(200).json({ totalPrice: total });
});

// Add a product to a cart
const addToCart = asyncHandler(async (req, res) => {
	const { customerId, productName, category, productCode, picURL, price, discountNote, discountPrice, quantity } = req.body;

	// Check for missing fields
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	// Check if the product is already in the cart
	const item = await Cart.findOne({
		where: {
			customerId,
			productName,
		},
	});
	if (item) {
		return res.status(400).json({ message: "Product already in cart" });
	}

	// Check if product exists in the product table
	const product = await Product.findOne({ where: { productCode } });
	if (!product) {
		return res.status(404).json({ message: "Product not found" });
	}

	// Update product availability if the product exists
	if (product.quantity > 0) {
		product.quantity -= 1;
		await product.save();
	} else {
		return res.status(400).json({ message: "Product out of stock" });
	}

	// Save the new item to the cart
	const createdCart = await Cart.create({
		customerId,
		productName,
		category,
		productCode,
		picURL,
		price,
		discountNote,
		discountPrice,
		quantity,
	});

	res.status(201).json(createdCart);
});

// Update the product quantity of a cart item
const updateCart = asyncHandler(async (req, res) => {
	const { quantity } = req.body;

	const cart = await Cart.findByPk(req.params.id);
	if (!cart) {
		return res.status(404).json({ message: "Cart item not found" });
	}

	const product = await Product.findOne({ where: { productCode: cart.productCode } });
	if (!product) {
		return res.status(404).json({ message: "Product not found" });
	}

	const previousQuantity = cart.quantity;

	if (quantity > previousQuantity) {
		// Increase the cart item quantity
		if (product.quantity < quantity - previousQuantity) {
			return res.status(400).json({ message: "Insufficient stock" });
		} else {
			product.quantity -= quantity - previousQuantity;
		}
	} else if (quantity < previousQuantity) {
		// Decrease the cart item quantity
		product.quantity += previousQuantity - quantity;
	}

	await product.save();

	cart.quantity = quantity;
	const updatedCart = await cart.save();

	res.status(200).json(updatedCart);
});

// Delete one cart item from the cart
const deleteCartItem = asyncHandler(async (req, res) => {
	const cart = await Cart.findByPk(req.params.id);
	if (!cart) {
		return res.status(404).json({ message: "Cart item not found" });
	}

	const product = await Product.findOne({ where: { productCode: cart.productCode } });
	if (product) {
		product.quantity += cart.quantity;
		await product.save();
	}

	await cart.destroy();
	res.status(200).json({ message: "Item removed from cart" });
});

// Delete all the cart items from the cart when the customer is checking out
const deleteAllCartItems = asyncHandler(async (req, res) => {
	const cartItems = await Cart.findAll({ where: { customerId: req.params.id } });
	if (cartItems.length === 0) {
		return res.status(404).json({ message: "No items found in cart" });
	}

	// Update product quantities back to the original stock
	for (const cartItem of cartItems) {
		const product = await Product.findOne({ where: { productCode: cartItem.productCode } });
		if (product) {
			product.quantity += cartItem.quantity;
			await product.save();
		}
	}

	await Cart.destroy({ where: { customerId: req.params.id } });
	res.status(200).json({ message: "All items removed from cart" });
});

// Validation for cart item fields
const validateCartItem = [
	body("customerId", "Customer ID is required").notEmpty(),
	body("productName", "Product Name is required").notEmpty(),
	body("category", "Category is required").notEmpty(),
	body("productCode", "Product Code is required").notEmpty(),
	body("picURL", "Picture URL is required").notEmpty(),
	body("price", "Price is required").isFloat({ gt: 0 }),
	body("discountPrice", "Discount Price is required").isFloat({ gt: 0 }),
	body("quantity", "Quantity must be at least 1").isInt({ min: 1 }),
];

module.exports = {
	getCartItems,
	addToCart,
	updateCart,
	deleteCartItem,
	deleteAllCartItems,
	getTotal,
	validateCartItem,
};
