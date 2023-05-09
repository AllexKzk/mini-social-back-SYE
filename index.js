const express = require('express');
const cors = require('cors');
const multer = require('multer');       //get images from Form
const aws = require('aws-sdk');         //save in aws s3
const multerS3 = require('multer-s3');  //from form to aws
const { addNewUser, authUser, getUser, updateProfileData, authUserByToken, createPost, collectPosts, likedPost, loadAvatar } = require('./MySql/queries');
const app = express();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200, 
  credentials: true, 
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept']
};

//app.use(express.static('public'));
//app.use('/images', express.static('images'));

console.log(process.env.CYCLIC_BUCKET_NAME)
console.log(process.env.AWS_ACCESS_KEY_ID)
console.log(process.env.AWS_REGION)

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    sessionToken: process.env.AWS_SESSION_TOKEN,
    region: process.env.AWS_REGION
});
const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.CYCLIC_BUCKET_NAME,
        key: function (req, file, cb) {
            cb(null, Date.now().toString());
        }
    })
});

app.use(cors(corsOptions));
app.use(express.json());

app.get('/api/', (req, res) => {
    res.end();
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

app.put('/api/bytoken', (req, res) => {
    const data = req.body;
    authUserByToken(res, data.id, data.token);
});

app.post('/api/create-post', upload.single('caption-img'), (req, res) => {
    const data = req.body;
    createPost(res, req.file.key, data.authorId, data.caption);
});

app.put('/api/get-posts', (req, res) => {
    const data = req.body;
    collectPosts(res, data.sources, data.reqUserId);
});

app.put('/api/like', (req, res) => {
    const data = req.body;
    likedPost(res, data.postId, data.authorId);
});

app.post('/api/load-avatar', upload.single('avatar'), (req, res) => {
    const data = req.body;
    loadAvatar(res, data.id, req.file.key);
});

app.put('/api/image', (req, res) => {
    if (req.body.key){
        const signedUrl = s3.getSignedUrl('getObject', {
            Bucket: process.env.CYCLIC_BUCKET_NAME,
            Key: req.body.key,
            Expires: 1800
        });
        res.send( {signedSrc: signedUrl} );
    }
    else
        res.status(404);
    res.end();
});

app.listen(5000);
