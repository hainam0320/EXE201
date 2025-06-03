const mongoose = require('mongoose');
const Product = require('../model/productModel');

// URL ảnh mẫu cho từng loại sản phẩm
const sampleImages = [
    'https://cdn.pixabay.com/photo/2015/04/19/08/32/rose-729509_1280.jpg', // Hoa hồng đỏ
    'https://cdn.pixabay.com/photo/2018/02/08/22/27/flower-3140492_1280.jpg', // Hoa sinh nhật
    'https://cdn.pixabay.com/photo/2018/07/11/12/15/rose-3530647_1280.jpg', // Hoa hồng trắng
    'https://cdn.pixabay.com/photo/2015/10/09/00/55/lotus-978659_1280.jpg', // Hoa sen
    'https://cdn.pixabay.com/photo/2016/11/29/09/16/roses-1868669_1280.jpg' // Bó hoa hồng
];

async function updateProductImages() {
    try {
        // Kết nối database
        await mongoose.connect('mongodb://localhost:27017/EXE2', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to database');

        // Lấy tất cả sản phẩm
        const products = await Product.find();
        console.log(`Found ${products.length} products`);

        // Cập nhật từng sản phẩm
        for (const product of products) {
            // Chọn ngẫu nhiên một URL ảnh từ danh sách
            const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
            
            // Cập nhật sản phẩm
            await Product.findByIdAndUpdate(product._id, {
                $set: { image: randomImage }
            });
            console.log(`Updated product ${product._id} with image ${randomImage}`);
        }

        console.log('All products updated successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error updating products:', error);
        process.exit(1);
    }
}

updateProductImages(); 