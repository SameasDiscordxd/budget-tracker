const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

// Define the MainCategory model
const MainCategory = sequelize.define('MainCategory', {
  // Define the 'name' field as an ENUM with specific allowed values
  name: {
    type: DataTypes.ENUM('fixed', 'variable', 'non_essential'),
    allowNull: false, // This field is required
    unique: true, // Each value must be unique
  },
});

// Define the SubCategory model
const SubCategory = sequelize.define('SubCategory', {
  // Define the 'name' field as a STRING with a maximum length of 50 characters
  name: {
    type: DataTypes.STRING(50),
    allowNull: false, // This field is required
  },
});

// Define the Bill model
const Bill = sequelize.define('Bill', {
  // Define the 'id' field as the primary key with a default value of a unique UUID
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  // Define the 'userId' field as a foreign key referencing the 'id' field in the User model
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  // Define the 'name' field as a STRING with a maximum length of 100 characters
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  // Define the 'amount' field as a DECIMAL with a total of 10 digits and 2 decimal places
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  // Define the 'dueDate' field as a DATEONLY (date without time)
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  // Define the 'frequency' field as an ENUM with specific allowed values
  frequency: {
    type: DataTypes.ENUM('daily', 'weekly', 'biweekly', 'monthly', 'annually'),
    allowNull: false,
  },
  // Define the 'isPaid' field as a BOOLEAN with a default value of false
  isPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  // Add description/notes field
  description: {
    type: DataTypes.TEXT,
    allowNull: true  // Optional field
  },

  // Auto-payment status
  isAutoPay: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  // Reminder settings (days before due date)
  reminderDays: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 30
    }
  },

  // Priority level (1 = highest, 3 = lowest)
  priority: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2,
    validate: {
      min: 1,
      max: 3
    }
  },
  // Define the 'createdAt' field as a DATE with a default value of the current timestamp
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  // Define the 'updatedAt' field as a DATE with a default value of the current timestamp
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Define associations between models
// A User can have multiple Bills (one-to-many relationship)
User.hasMany(Bill);
// A Bill belongs to a single User (one-to-one relationship)
Bill.belongsTo(User);

// A MainCategory can have multiple SubCategories (one-to-many relationship)
MainCategory.hasMany(SubCategory);
// A SubCategory belongs to a single MainCategory (one-to-one relationship)
SubCategory.belongsTo(MainCategory);

// A MainCategory can have multiple Bills (one-to-many relationship)
MainCategory.hasMany(Bill);
// A Bill belongs to a single MainCategory (one-to-one relationship)
Bill.belongsTo(MainCategory);

// A SubCategory can have multiple Bills (one-to-many relationship)
SubCategory.hasMany(Bill);
// A Bill belongs to a single SubCategory (one-to-one relationship)
Bill.belongsTo(SubCategory);

// Export the models so they can be used in other parts of the application
module.exports = {
  MainCategory,
  SubCategory,
  Bill,
};