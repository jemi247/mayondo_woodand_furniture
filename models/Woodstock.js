const mongoose = require("mongoose")

const woodstockSchema = new mongoose.Schema({
    woodName: {
        type: String,
    },
    woodType: {
        type: String,
    },
    quantity: {
        type: String,
    },
    supplier: {
        type: String,
    },
    unitPrice:{
        type: Number,
    },
    dateReceived: {
        type: Date,
    },
    salePrice: {
        type: Number,
    }
});

module.exports = mongoose.model('Woodstock', woodstockSchema);