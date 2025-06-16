const {default: mongoose} = require("mongoose");
const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: false},
    image: {type: String, required: false},
    stock: {type: Number, default: 0},
    category: [{type: mongoose.Schema.Types.ObjectId, ref: "CategoryProduct", required: false}],
    shop: {type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true},
    createdAt: {type: Date, default: Date.now},
    rating: {type: Number, default: 0},
    discount: {type: Number, default: 0},
    originalPrice: {type: Number}
}, {
    timestamps: true
});

// Add pre-save middleware to set originalPrice if not provided
productSchema.pre('save', function(next) {
    if (!this.originalPrice) {
        this.originalPrice = this.price;
    }
    next();
});

module.exports = mongoose.model("Product", productSchema);