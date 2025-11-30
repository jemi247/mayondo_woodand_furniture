const mongoose = require("mongoose")

const woodsaleSchema = new mongoose.Schema({
    customerName: {
        type: String,
    },
    woodName: {
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
    woodPrice: {
        type: Number,
    },
    paymentType: {
        type: Boolean,
        default: false,
    },
    totalPrice: {
        type: Number,
    },
    agentName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Registration"
    }
});

module.exports = mongoose.model('Woodsale', woodsaleSchema);