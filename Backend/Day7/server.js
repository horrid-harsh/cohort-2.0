const app = require('./src/app');
const connectToDb = require('./src/config/database');

require('dotenv').config();
connectToDb();

app.listen(3000, (req, res)=> {
    console.log('server running at port 3000...');    
})

