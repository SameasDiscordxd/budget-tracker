// Core dependencies
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Database and models
const sequelize = require('./config/database');
const User = require('./models/user');
const PaySchedule = require('./models/paySchedule');
const {MainCategory, SubCategory, Bill} = require('./models/bill');

// Express setup
const app = express();
app.use(cors());
app.use(express.json());

// Routes
const routes = require('./routes');
app.use('/api', routes);
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

// Database initialization and test data setup
async function initializeData() {
   try {
       await sequelize.sync();
       console.log('Models synced successfully');

       // Create test user if none exists
       let testUser = await User.findOne({
           where: { email: 'test@example.com' }
       });

       if (!testUser) {
           testUser = await User.create({
               email: 'test@example.com',
               password: 'testpassword123',
               name: 'Test User'
           });

           // Create main budget categories
           const [fixedCategory, variableCategory, nonEssentialCategory] = await Promise.all([
               MainCategory.create({ name: 'fixed' }),
               MainCategory.create({ name: 'variable' }),
               MainCategory.create({ name: 'non_essential' })
           ]);

           // Create subcategories for each main category
           await Promise.all([
               // Fixed expenses subcategories
               SubCategory.create({ name: 'Rent/Mortgage', MainCategoryId: fixedCategory.id }),
               SubCategory.create({ name: 'Car Payment', MainCategoryId: fixedCategory.id }),
               SubCategory.create({ name: 'Insurance', MainCategoryId: fixedCategory.id }),
               SubCategory.create({ name: 'Utilities', MainCategoryId: fixedCategory.id }),

               // Variable expenses subcategories
               SubCategory.create({ name: 'Groceries', MainCategoryId: variableCategory.id }),
               SubCategory.create({ name: 'Gas', MainCategoryId: variableCategory.id }),
               SubCategory.create({ name: 'Phone Bill', MainCategoryId: variableCategory.id }),
               SubCategory.create({ name: 'Internet', MainCategoryId: variableCategory.id }),

               // Non-essential expenses subcategories
               SubCategory.create({ name: 'Entertainment', MainCategoryId: nonEssentialCategory.id }),
               SubCategory.create({ name: 'Dining Out', MainCategoryId: nonEssentialCategory.id }),
               SubCategory.create({ name: 'Shopping', MainCategoryId: nonEssentialCategory.id }),
               SubCategory.create({ name: 'Subscriptions', MainCategoryId: nonEssentialCategory.id })
           ]);

           // Create sample bill
           await Bill.create({
               userId: testUser.id,
               name: 'Monthly Rent',
               amount: 1200.00,
               dueDate: '2024-01-01',
               frequency: 'monthly',
               MainCategoryId: fixedCategory.id,
               SubCategoryId: 1,
               description: 'Monthly apartment rent',
               isAutoPay: true,
               reminderDays: 5,
               priority: 1
           });
       }
       console.log('Initialization complete');
   } catch (error) {
       console.error('Error initializing data:', error);
   }
}

// Test endpoint to view data
app.get('/api/test-ids', async (req, res) => {
   try {
       const users = await User.findAll();
       const mainCategories = await MainCategory.findAll({
           include: [{
               model: SubCategory
           }]
       });
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

// Initialize data and start server
initializeData();

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});