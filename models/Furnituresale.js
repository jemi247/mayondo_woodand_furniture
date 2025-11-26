const mongoose = require("mongoose")

const furnituresaleSchema = new mongoose.Schema({
    customerName: {
        type: String,
    },
    furnitureType: {
        type: String,
    },
    Quantity: {
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

module.exports = mongoose.model('Furnituresale', furnituresaleSchema);