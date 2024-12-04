const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');
const User = require('./models/user');
const PaySchedule = require('./models/paySchedule');
const {MainCategory, SubCategory, Bill} = require('./models/bill');

const app = express();
app.use(cors());
app.use(express.json());

const routes = require('./routes');
app.use('/api', routes);

const PORT = process.env.PORT || 5000;

async function testBillModels() {
  try {
      // Sync all models
      await sequelize.sync({ force: true });
      console.log('Models synced successfully');

      // Create test user
      const testUser = await User.create({
          email: 'test@example.com',
          password: 'testpassword123',
          name: 'Test User'
      });

      // Create main categories
      const fixedCategory = await MainCategory.create({
          name: 'fixed'
      });

      // Create sub-category
      const rentCategory = await SubCategory.create({
          name: 'Rent',
          MainCategoryId: fixedCategory.id
      });

      // Create test bill
      const testBill = await Bill.create({
          userId: testUser.id,
          name: 'Monthly Rent',
          amount: 1200.00,
          dueDate: '2024-01-01',
          frequency: 'monthly',
          MainCategoryId: fixedCategory.id,
          SubCategoryId: rentCategory.id,
          description: 'Monthly apartment rent',
          isAutoPay: true,
          reminderDays: 5,
          priority: 1
      });

      console.log('Test data created successfully');
      console.log('Bill details:', testBill.toJSON());

  } catch (error) {
      console.error('Error testing models:', error);
  }
}

testBillModels();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});