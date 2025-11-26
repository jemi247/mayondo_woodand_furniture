const mongoose = require("mongoose")

const woodsaleSchema = new mongoose.Schema({
    customerName: {
        type: String,
    },
    woodType: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    saleDate: {
        type: String,
    },
    paymentType: {
        type: String,
    },
    agentName: {
        type: String,
    }
});

module.exports = mongoose.model('Woodsale', woodsaleSchema);