const { mongoose } = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:");
    console.error(error);
    // Thoát process nếu không kết nối được database
    process.exit(1);
  }
};

// Xử lý các events của mongoose connection
mongoose.connection.on('disconnected', () => {
  console.log('Database disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('Database error:', err);
});

module.exports = dbConnection;