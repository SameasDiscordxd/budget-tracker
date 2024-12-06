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

let testUserId; // Store the user ID

async function initializeData() {
   try {
       // Sync without force: true
       await sequelize.sync();
       console.log('Models synced successfully');

       // Check if we already have a test user
       let testUser = await User.findOne({
           where: { email: 'test@example.com' }
       });

       // If no test user exists, create one
       if (!testUser) {
           testUser = await User.create({
               email: 'test@example.com',
               password: 'testpassword123',
               name: 'Test User'
           });
           console.log('Test user created');

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
       }
       testUserId = testUser.id;
       console.log('Initialization complete');
   } catch (error) {
       console.error('Error initializing data:', error);
   }
}

// Route to get test IDs
app.get('/api/test-ids', async (req, res) => {
   try {
       // First, find users
       const users = await User.findAll();
       console.log("Users found:", users); // Debug log

       // Then categories
       const mainCategories = await MainCategory.findAll({
           include: [{
               model: SubCategory
           }]
       });
       console.log("Categories found:", mainCategories); // Debug log

       // Send everything in response
       res.json({
           debug: "Full data dump",
           users: users,
           mainCategories: mainCategories
       });
   } catch (error) {
       console.error("Error in test-ids route:", error);
       res.status(500).json({ error: error.message });
   }
});

initializeData();

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});