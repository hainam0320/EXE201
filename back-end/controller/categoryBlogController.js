const Category = require("../model/categoryModel");

const getCategory = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).send(categories);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Internal server error" });
    }
};

module.exports = { getCategory };