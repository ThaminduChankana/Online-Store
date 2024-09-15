const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const { body, validationResult } = require("express-validator");

// Get all orders of a particular customer
const getCustomerOrders = asyncHandler(async (req, res) => {
	const orders = await Order.findAll({ where: { customerId: req.params.id } });

	if (orders.length === 0) {
		return res.status(404).json({ message: "No orders found for this customer" });
	}

	res.status(200).json(orders);
});

// Get all the orders by admin
const getAdminOrders = asyncHandler(async (req, res) => {
	const orders = await Order.findAll();

	if (orders.length === 0) {
		return res.status(404).json({ message: "No orders found" });
	}

	res.status(200).json(orders);
});

// Create an order
const createOrder = asyncHandler(async (req, res) => {
	const { customerId, total } = req.body;

	// Validate input fields
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	// Check if required fields are provided
	if (!customerId || !total) {
		return res.status(400).json({ message: "Customer and total amount are required" });
	}

	// Find items in the cart
	const cartItems = await Cart.findAll({ where: { customerId } });

	if (cartItems.length === 0) {
		return res.status(404).json({ message: "No items found in cart for this customer" });
	}

	// Generate order ID and build product details from cart
	let products = cartItems
		.map((item) => `${item.productName} : ${item.quantity}`)
		.join(", ");
	const orderID = Math.floor(Math.random() * 100000);
	const status = "pending";

	// Create new order
	const order = await Order.create({
		customerId,
		products,
		orderID,
		total,
		status,
	});

	res.status(201).json(order);
});

// Update the order status
const updateOrderStatus = asyncHandler(async (req, res) => {
	const { status } = req.body;

	// Validate input fields
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	// Find the order by ID
	const order = await Order.findByPk(req.params.id);

	if (!order) {
		return res.status(404).json({ message: "Order not found" });
	}

	// Update order status
	order.status = status;

	const updatedOrder = await order.save();
	res.status(200).json(updatedOrder);
});

// Validation rules for creating and updating orders
const validateOrderCreation = [
	body("customerId", "Customer ID is required").notEmpty(),
	body("total", "Total amount is required").isFloat({ gt: 0 }),
];

const validateOrderStatusUpdate = [
	body("status", "Status is required").notEmpty(),
];

module.exports = {
	createOrder,
	getCustomerOrders,
	getAdminOrders,
	updateOrderStatus,
	validateOrderCreation,
	validateOrderStatusUpdate,
};
