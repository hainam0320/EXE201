const {defautl: mongoose} = require("mongoose");
const categoryBlogSchema = new mongoose.Schema({
    name: {type: String,required: true},
});
module.exports = mongoose.model("CategoryBlog", categoryBlogSchema);
