const express = require('express');
const dotenv = require('dotenv');
const cookieParser=require('cookie-parser');
const connectDB = require('./config/db');
const companies = require('./routes/companies');
const interviews = require('./routes/interviews');
const auth = require('./routes/auth');
dotenv.config({ path: './config/config.env' });

connectDB();
const app = express();
app.use (express.json());
app.use (cookieParser());
// Body parser (สำคัญสำหรับ POST / PUT)
app.use('/api/v1/companies', companies);
app.use('/api/v1/interviews', interviews);
app.use('/api/v1/auth', auth);
app.set('query parser', 'extended');
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    'Server running in',
    process.env.NODE_ENV,
    'mode on port',
    PORT
  );
});
process.on('unhandledRejection',(err,promise)=>{
  console.log( `Error: ${err.message}`);
  server.close(()=> process.exit(1));
});
