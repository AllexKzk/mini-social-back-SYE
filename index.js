const express = require('express');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'images/' });
const { addNewUser, authUser, getUser, updateProfileData, authUserByToken, createPost, collectPosts, likedPost, loadAvatar } = require('./MySql/queries');
const app = express();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200, 
  credentials: true, 
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept']
};
app.use(express.static('public'));
app.use('/images', express.static('images'));

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
    createPost(res, req.file, data.authorId, data.caption);
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
    loadAvatar(res, data.id, req.file);
});

app.listen(5000);
