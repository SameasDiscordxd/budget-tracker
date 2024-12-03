const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');
const User = require('./models/user');
const PaySchedule = require('./models/paySchedule');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

async function testPaySchedule() {
    try {
        // Sync both models
        await sequelize.sync({ force: true });
        console.log('Models synced successfully');

        // First create a test user
        const testUser = await User.create({
            email: 'test@example.com',
            password: 'testpassword123',
            name: 'Test User'
        });
        console.log('Test user created:', testUser.toJSON());

        // Create a pay schedule for this user
        const testSchedule = await PaySchedule.create({
            userId: testUser.id,
            incomeName: 'Main Job',
            amount: 2000.00,
            frequency: 'biweekly',
            payDay: 5, // Friday (0 = Sunday, 5 = Friday)
            description: 'Salary from primary employment'
        });
        console.log('Test pay schedule created:', testSchedule.toJSON());

    } catch (error) {
        console.error('Error testing models:', error);
    }
}

testPaySchedule();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});