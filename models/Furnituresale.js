const mongoose = require("mongoose")

const furnituresaleSchema = new mongoose.Schema({
    customerName: {
        type: String,
    },
    furnitureName: {
        type: String,
    },
    furnitureType: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    furniturePrice: {
        type: Number,
    },
    saleDate: {
        type: String,
    }, 
    paymentType: {
        type: String,
    },
    transportProvided:{
        type: Boolean,
        default: false
    },
    totalPrice:{
        type: Number,
    },
     agentName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Registration"
    },
});

module.exports = mongoose.model('Furnituresale', furnituresaleSchema);