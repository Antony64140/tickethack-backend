const mongoose = require('mongoose');

const tripSchema = mongoose.Schema({
    departure: {type: String, required: true, trim: true},
    arrival: {type: String, required: true, trim: true},
	date: {type: Date},
    price: {type: Number, min: 0},    
    etat: {type: Number, min: 0, max: 1, default: 0}
});

const Trip = mongoose.model('trips', tripSchema);

module.exports = Trip;

