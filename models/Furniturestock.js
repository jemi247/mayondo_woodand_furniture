const mongoose = require("mongoose")

const furniturestockSchema = new mongoose.Schema({
    furnitureType: {
        type: String,
    },
    material: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    unitPrice: {
        type: Number,
    },
    furnitureImage: {
        type: String,
    },
});

module.exports = mongoose.model('Furniturestock', furniturestockSchema);