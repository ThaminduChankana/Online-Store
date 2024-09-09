const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Sequelize with the environment variables
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE, 
  process.env.MYSQL_USER, 
  process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    port: 3306, // Default MySQL port
  }
);

// Function to connect to the database
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Connected');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

connectDB(); // Call the function to connect to the database

module.exports = sequelize;
