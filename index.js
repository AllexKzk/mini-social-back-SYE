const express = require('express');
const cors = require('cors')

const app = express();

const whitelist = ['https://mini-social-front-5c8mhjdvm-allexkzk.vercel.app/']; 
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200, 
  credentials: true, 
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept']
};

app.use(cors(corsOptions));

app.get('/api/', (req, res) => {
    res.send({ message: 'Hello world!' });
});

app.listen(5000);
