const {default: mongoose} = require("mongoose");
const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    image: {type: [String], required: true},
    category: {type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true},
    createdAt: {type: Date, required: true},
});

module.exports = mongoose.model("Product", productSchema);