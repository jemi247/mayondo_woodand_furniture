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
    price: {
        type: Number,
    },
    furnitureImage: {
        type: String,
    },
});

module.exports = mongoose.model('Furniturestock', furniturestockSchema);