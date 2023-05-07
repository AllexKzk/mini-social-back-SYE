const express = require('express');
const cors = require('cors');
const { addNewUser, authUser, getUser, updateProfileData } = require('./MySql/queries');
const app = express();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200, 
  credentials: true, 
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept']
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/api/', (req, res) => {
    pool.query("SELECT * FROM User", function(err, data) {
        if(err) 
            return console.log(err);
        console.log(data);
        res.send({ message: data[0] });
    });
});

app.post('/api/reg', (req, res) => {
    const data = req.body;
    addNewUser(res, data.Login, data.Password, data.Name, data.Surname);
});

app.put('/api/login', (req, res) => {
    const data = req.body;
    authUser(res, data.Login, data.Password);
});

app.put('/api/user', (req, res) => {
    const data = req.body;
    getUser(res, data.id);
});

app.put('/api/update-user', (req, res) => {
    const data = req.body;
    updateProfileData(res, data.id, data.field[0], data.field[1])
});

app.listen(5000);
