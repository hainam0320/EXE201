const {default: mongoose} = require("mongoose");
const blogSchema = new mongoose.Schema({
    title: {type: String,required: true},
    description: {type: String,required: true},
    image: {type: String,required: true},
    user: {type: mongoose.Schema.Types.ObjectId,ref: "User",required: true},
    category: {type: mongoose.Schema.Types.ObjectId,ref: "Category",required: true},
    createdAt: {type: Date,default: Date.now},
    updatedAt: {type: Date,default: Date.now},
});
module.exports = mongoose.model("Blog", blogSchema);