import "dotenv/config";
import { app } from './src/app.js';
import connectDB from './src/config/database.js';
import { testAi } from "./src/services/ai.service.js";

const PORT = process.env.PORT || 5000;

testAi();

// Connect to Database
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
});
