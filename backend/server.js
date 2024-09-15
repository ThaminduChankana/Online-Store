const express = require("express");
const sequelize = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
const customerRoutes = require("./routes/customerRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const dotenv = require('dotenv');
const cors = require("cors");

dotenv.config();
const app = express();
app.use(express.json());
app.use("*", cors());

app.get("/", (req, res) => {
	res.send("API is Running");
});

// Define routes
app.use("/admin", adminRoutes);
app.use("/customer", customerRoutes);
app.use("/vendor", vendorRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Sync models and start the server
const PORT = process.env.PORT || 5001;
sequelize.sync() // Sync all models with the database
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server Started on port ${PORT}..`);
		});
	})
	.catch((err) => {
		console.error('Failed to sync models and start server:', err);
	});
