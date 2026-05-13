const mongoose = require('mongoose');
require("dotenv").config();

const connectionString = process.env.connectionString+'/tickethack';

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log('Database connected'))
  .catch(error => console.error(error));
