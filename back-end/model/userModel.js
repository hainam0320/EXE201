const {default: mongoose} = require("mongoose");
const userSchema = new mongoose.Schema({
    userName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phone: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, default: 'user'},
    status: {type: String, default: 'active'},
    createdAt: {type: Date, default: Date.now},
    isAdmin: {type: Boolean, default: false}
});

module.exports = mongoose.model("User", userSchema);    