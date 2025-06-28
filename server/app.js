const express = require('express')
const app =  express();
const router = require('./routes/index');
const connectDB = require('./config/db')
const cookieParser = require('cookie-parser');

app.use(cookieParser());

connectDB()
.then(()=>console.log("DB connected..."))
.catch()

require('dotenv').config();
const port = process.env.PORT;
app.use(express.json()) //json data using
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})