faced issue : when creating provider it gets stored in customers

had to manually clear the models using : 
// Clear Mongoose model cache
delete mongoose.connection.models["User"]; // Remove the 'User' model from cache
delete mongoose.connection.models["Provider"]; // Remove the 'Provider' model from cacheS


// Clear all models from the cache
Object.keys(mongoose.connection.models).forEach(model => {
  delete mongoose.connection.models[model];
});

// Import models after clearing the cache
const User = require("./models/userModel");
const Admin = require("./models/adminModel");
const Provider = require("./models/providerModel");