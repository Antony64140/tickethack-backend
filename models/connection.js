const mongoose = require('mongoose');
require("dotenv").config();

const connectionString = process.env.connectionString+'/tickethack';

//Evite la connection à la base de prod lors des tests
if (process.env.NODE_ENV !== "test") {
  mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log('Database connected'))
  .catch(error => console.error(error));
}