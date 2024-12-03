const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const PaySchedule = sequelize.define('PaySchedule', {
   // Unique identifier for each pay schedule
   id: {
       type: DataTypes.UUID,
       defaultValue: DataTypes.UUIDV4,
       primaryKey: true
   },

   // Links the schedule to a specific user
   userId: {
       type: DataTypes.UUID,
       allowNull: false,
       references: {
           model: User,
           key: 'id'
       }
   },

   // Name of income source (e.g., "Main Job", "Part-time Work")
   incomeName: {
       type: DataTypes.STRING,
       allowNull: false
   },

   // Amount paid each period
   amount: {
       type: DataTypes.DECIMAL(10, 2),  // 10 digits total, 2 after decimal
       allowNull: false
   },

   // How often they get paid
   frequency: {
       type: DataTypes.ENUM('weekly', 'biweekly', 'monthly'),
       allowNull: false
   },

   // For weekly/biweekly: day of week (0-6, where 0 = Sunday)
   // For monthly: day of month (1-31)
   payDay: {
       type: DataTypes.INTEGER,
       allowNull: false
   },

   // Optional description or notes
   description: {
       type: DataTypes.STRING,
       allowNull: true
   },

   // When this record was created
   createdAt: {
       type: DataTypes.DATE,
       defaultValue: DataTypes.NOW
   },

   // When this record was last updated
   updatedAt: {
       type: DataTypes.DATE,
       defaultValue: DataTypes.NOW
   }
});

// Set up the relationship with User model
PaySchedule.belongsTo(User);
User.hasMany(PaySchedule);

module.exports = PaySchedule;