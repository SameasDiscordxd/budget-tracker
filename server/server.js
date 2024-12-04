const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');
const User = require('./models/user');
const PaySchedule = require('./models/paySchedule');
const {MainCategory, SubCategory, Bill} = require('./models/bills');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

async function testBillModel() {
    try {
      // Sync the models with the database (creates tables if they don't exist)
      await sequelize.sync({ force: true });
  
      // Create a user
      const user = await User.create({
        email: 'test@example.com',
        password: 'password123',
        name: 'John Doe',
      });
  
      // Create main categories
      const fixedCategory = await MainCategory.create({ name: 'fixed' });
      const variableCategory = await MainCategory.create({ name: 'variable' });
  
      // Create sub categories
      const rentSubCategory = await SubCategory.create({ name: 'Rent', MainCategoryId: fixedCategory.id });
      const groceriesSubCategory = await SubCategory.create({ name: 'Groceries', MainCategoryId: variableCategory.id });
  
      // Create bills
      const rentBill = await Bill.create({
        userId: user.id,
        name: 'Apartment Rent',
        amount: 1000.00,
        dueDate: '2023-06-01',
        frequency: 'monthly',
        MainCategoryId: fixedCategory.id,
        SubCategoryId: rentSubCategory.id,
      });
  
      const groceriesBill = await Bill.create({
        userId: user.id,
        name: 'Monthly Groceries',
        amount: 250.50,
        dueDate: '2023-06-15',
        frequency: 'monthly',
        MainCategoryId: variableCategory.id,
        SubCategoryId: groceriesSubCategory.id,
      });
  
      // Retrieve bills with associated user, main category, and sub category
      const bills = await Bill.findAll({
        include: [User, MainCategory, SubCategory],
      });
  
      console.log('Bills:', JSON.stringify(bills, null, 2));
    } catch (error) {
      console.error('Error testing Bill model:', error);
    }
  }
  
  testBillModel();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});