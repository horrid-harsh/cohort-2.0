const mongoose = require("mongoose");

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Database connected");
    } catch (error) {
        console.error("❌ Database connection failed: ", error.message);
        process.exit(1);
    }    
}

module.exports = connectToDB;