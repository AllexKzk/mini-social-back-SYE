const express = require('express');
const cors = require('cors')
const mysql = require('mysql')

const app = express();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200, 
  credentials: true, 
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept']
};

app.use(cors(corsOptions));

const pool = mysql.createPool({
    host: 'ben1e8tljjivtlkrlih5-mysql.services.clever-cloud.com',
    user: 'uv68wkbxill75bjc',
    password: 'SQWjlU4uQEFBPGAmdUcL',
    database: 'ben1e8tljjivtlkrlih5'
});


app.get('/api/', (req, res) => {
    pool.query("SELECT message FROM test", function(err, data) {
        if(err) 
            return console.log(err);
        console.log(data);
        res.send({ message: data[0] });
    });
});

app.listen(5000);
