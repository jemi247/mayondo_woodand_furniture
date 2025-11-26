const mongoose = require("mongoose")

const woodstockSchema = new mongoose.Schema({
    woodType: {
        type: String,
    },
    quantity: {
        type: String,
    },
    supplier: {
        type: String,
    },
    price:{
        type: Number,
    },
    dateReceived: {
        type: Date,
    },
});

module.exports = mongoose.model('Woodstock', woodstockSchema);