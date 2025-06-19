const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const studentRoutes = require('./routes/studentRoutes');
const scheduleSync = require('./cron/cronJob');
const path =  require('path');

require('dotenv').config();

scheduleSync(process.env.CRON_TIME); // reads from .env or defaults to 2AM


const app = express();
const corsOptions = {
    origin:'https://tle-hackathon.onrender.com/',
    credentials:true
}


app.use(cors(corsOptions));
app.use(express.json());

const _dirname = path.resolve();

app.use(express.static(path.join(_dirname, "/my-app/dist")));

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Mongo connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('API Running');
});

app.use('/api/students', studentRoutes);
// routes/student.js


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});


