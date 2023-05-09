const express = require('express');
const cors = require('cors');
const multer = require('multer');       //get images from Form
const aws = require('aws-sdk');         //save in aws s3
const multerS3 = require('multer-s3');  //from form to aws
const app = express();

const corsOptions = {
  origin: '*', //dev
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200, 
  credentials: true, 
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept']
};
app.use(cors(corsOptions));

//store images with cyclic and AWS S3
aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    sessionToken: process.env.AWS_SESSION_TOKEN,
    region: process.env.AWS_REGION
});

const s3 = new aws.S3();

//thanks god smbd created multerS3
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.CYCLIC_BUCKET_NAME,
        key: function (req, file, cb) {
            cb(null, Date.now().toString());
        }
    })
});

app.use(express.json());

app.listen(5000);

const get = require('./requests/GET/get');
get(app);

const put = require('./requests/PUT/put');
put(app, s3);

const post = require('./requests/POST/post');
post(app, upload);
