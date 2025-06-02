const {default: mongoose} = require("mongoose");

const categoryProductSchema = new mongoose.Schema({
    name: {type: String,required: true,},
});
module.exports = mongoose.model("CategoryProduct", categoryProductSchema);